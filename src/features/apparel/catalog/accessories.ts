import { parseVariantName } from './parseVariantName';
import { toResponsive, type ImageMetadata, type ResponsiveImageData } from '@/lib/responsiveImage';

// Product-type groupings for the All Accessories view, in display order.
export type AccessoryGroup = 'Jewelry' | 'Wearables' | 'Gear' | 'Coming Soon';
export const ACCESSORY_GROUP_ORDER: AccessoryGroup[] = ['Jewelry', 'Wearables', 'Gear', 'Coming Soon'];

export interface AccessoryVariant {
  id: string;
  label: string;
  image: ResponsiveImageData;
  colors: string[];
}

export interface AccessoryCategory {
  id: string;
  name: string;
  desc: string;
  folder: string; // inventory subfolder name
  prefix: string; // filename type prefix to strip
  group: AccessoryGroup;
  comingSoon: boolean;
  coverImage?: ResponsiveImageData;
  variants: AccessoryVariant[];
}

// Hand-authored category metadata. `variants`/`coverImage` are filled from the glob below.
interface CategoryDef {
  id: string;
  name: string;
  desc: string;
  folder: string;
  prefix: string;
  group: AccessoryGroup;
  /**
   * File name (no extension) of the photo that fronts the category. Without
   * one the cover is the "-package" shot, or else the first design by name.
   */
  cover?: string;
}

const IN_STOCK: CategoryDef[] = [
  // Jewelry
  { id: 'chains', name: 'Chains', desc: 'Gold and silver rope chains with baseball medallions.', folder: 'chains', prefix: 'chain-', group: 'Jewelry', cover: 'chain-gold-batter-medallion' },
  { id: 'cubans', name: 'Cubans', desc: 'Classic Cuban link chains — bold look for the field.', folder: 'cubans', prefix: 'cuban-', group: 'Jewelry', cover: 'cuban-gold' },
  { id: 'bead-necklaces', name: 'Bead necklaces', desc: 'Colorful bead necklaces to rep your team colors.', folder: 'bead-necklaces', prefix: 'beadNecklace-', group: 'Jewelry', cover: 'beadNecklace-gold-black' },
  // Wearables
  { id: 'arm-sleeves', name: 'Arm sleeves', desc: 'Compression arm sleeves in every colorway.', folder: 'arm-sleeves', prefix: 'armsleeve-', group: 'Wearables', cover: 'armsleeve-blue-red-white-digitalcamo' },
  { id: 'sliding-mitts', name: 'Sliding mitts', desc: 'Protective sliding mitts in a stack of custom designs.', folder: 'sliding-mitts', prefix: 'slidingMitt-', group: 'Wearables', cover: 'slidingMitt-blue-white-red-stars' },
  { id: 'eye-black', name: 'Eye black', desc: 'Anti-glare eye black for game day.', folder: 'eye-black', prefix: 'eyeblack-', group: 'Wearables', cover: 'eyeblack-1' },
  { id: 'wrist-tape', name: 'Wrist tape', desc: 'Self-adhesive grip tape in bright game-day colors.', folder: 'wrist-tape', prefix: 'wristTape-', group: 'Wearables', cover: 'wristTape-hotPink' },
  // Gear
  { id: 'ball-on-string', name: 'Ball on string', desc: 'Ball-on-a-string charms — a dugout staple.', folder: 'ball-on-string', prefix: 'ballString-', group: 'Gear', cover: 'ballString-baseball-yellow' },
  { id: 'cooling-towels', name: 'Cooling towels', desc: 'Stay-cool towels for the sideline and dugout.', folder: 'cooling-towels', prefix: 'coolingTowel-', group: 'Gear' },
  { id: 'squishy-toys', name: 'Squishy toys', desc: 'Fidget squishies in fruit, animal, and treat shapes.', folder: 'squishy-toys', prefix: 'squishyToys-', group: 'Gear', cover: 'squishyToys-assorted' },
];

const COMING_SOON: CategoryDef[] = [
  { id: 'hats', name: 'Hats', desc: 'Custom Playmaker hat designs — arriving soon.', folder: '', prefix: '', group: 'Coming Soon' },
  { id: 'batting-gloves', name: 'Batting gloves', desc: 'Custom batting gloves — arriving soon.', folder: '', prefix: '', group: 'Coming Soon' },
  { id: 'sunglasses', name: 'Sunglasses', desc: 'UV-protection sport frames — arriving soon.', folder: '', prefix: '', group: 'Coming Soon' },
];

const modules = import.meta.glob('/src/assets/images/inventory/**/*.{png,jpg,jpeg}', {
  eager: true,
  // q72 matches the other site photos and is ~35% lighter than the q80 default.
  // 768 serves retina desktop cards (~367 CSS px) without jumping to 1024.
  query: { w: '128;320;640;768;1024', format: 'webp', quality: '72', as: 'meta:src;width;height;format' },
  import: 'default',
}) as Record<string, ImageMetadata[]>;

// Group resolved metadata by their immediate parent folder name, skipping heic/ originals.
const byFolder = new Map<string, { base: string; image: ResponsiveImageData }[]>();
for (const [path, meta] of Object.entries(modules)) {
  if (path.includes('/heic/')) continue;
  const parts = path.split('/');
  const file = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  const base = file.replace(/\.(png|jpe?g)$/i, '');
  const list = byFolder.get(folder) ?? [];
  list.push({ base, image: toResponsive(meta) });
  byFolder.set(folder, list);
}

function buildVariants(def: CategoryDef): { variants: AccessoryVariant[]; coverImage?: ResponsiveImageData } {
  const files = (byFolder.get(def.folder) ?? []).slice().sort((a, b) => a.base.localeCompare(b.base));
  let coverImage: ResponsiveImageData | undefined;
  const variants: AccessoryVariant[] = [];
  const seen = new Set<string>();

  for (const { base, image } of files) {
    // A "-package" shot becomes the cover, not a variant.
    if (/-package$/i.test(base)) {
      coverImage = image;
      continue;
    }
    const parsed = parseVariantName(base, def.prefix);
    let id = parsed.id || base.toLowerCase();
    while (seen.has(id)) id = `${id}-x`;
    seen.add(id);
    variants.push({ id, label: parsed.label, image, colors: parsed.colors });
  }

  if (def.cover) {
    // A hand-picked cover is still one of the designs. A renamed photo fails the
    // build here instead of quietly falling back to a different cover.
    const picked = files.find((f) => f.base === def.cover);
    if (!picked) throw new Error(`accessories: no photo named "${def.cover}" in inventory/${def.folder}/`);
    coverImage = picked.image;
  }
  if (!coverImage && variants.length > 0) coverImage = variants[0].image;
  return { variants, coverImage };
}

export const accessoryCategories: AccessoryCategory[] = [
  ...IN_STOCK.map((def) => {
    const { variants, coverImage } = buildVariants(def);
    return { ...def, comingSoon: variants.length === 0, coverImage, variants };
  }),
  ...COMING_SOON.map((def) => ({ ...def, comingSoon: true, coverImage: undefined, variants: [] })),
];

/** Categories with at least one photo, i.e. everything not "Coming Soon". */
export const inStockCategories = accessoryCategories.filter((c) => !c.comingSoon);
