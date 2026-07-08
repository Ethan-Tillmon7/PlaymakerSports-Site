import { COLOR_MAP, colorLabel, parseVariantName } from './accessoryParse';
import type { ResponsiveImageData } from '../types/image';

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
}

const IN_STOCK: CategoryDef[] = [
  { id: 'sliding-mitts', name: 'Sliding Mitts', desc: 'Protective sliding mitts in a stack of custom designs.', folder: 'Sliding Mitts', prefix: 'slidingMitt-' },
  { id: 'chains', name: 'Chains', desc: 'Gold and silver rope chains with baseball medallions.', folder: 'Chains', prefix: 'chain-' },
  { id: 'cubans', name: 'Cubans', desc: 'Classic Cuban link chains — bold look for the field.', folder: 'Cubans', prefix: 'cuban-' },
  { id: 'arm-sleeves', name: 'Arm Sleeves', desc: 'Compression arm sleeves in every colorway.', folder: 'Arm Sleeves', prefix: 'armsleeve-' },
  { id: 'bead-necklaces', name: 'Bead Necklaces', desc: 'Colorful bead necklaces to rep your team colors.', folder: 'Bead Necklaces', prefix: 'beadNecklace-' },
  { id: 'ball-on-string', name: 'Ball on String', desc: 'Ball-on-a-string charms — a dugout staple.', folder: 'Ball on String', prefix: 'ballString-' },
  { id: 'eye-black', name: 'Eye Black', desc: 'Anti-glare eye black for game day.', folder: 'Eye Black', prefix: 'eyeblack-' },
  { id: 'cooling-towels', name: 'Cooling Towels', desc: 'Stay-cool towels for the sideline and dugout.', folder: 'Cooling Towel', prefix: 'coolingTowel-' },
];

const COMING_SOON: CategoryDef[] = [
  { id: 'hats', name: 'Hats', desc: 'Custom Playmaker hat designs — arriving soon.', folder: '', prefix: '' },
  { id: 'batting-gloves', name: 'Batting Gloves', desc: 'Custom batting gloves — arriving soon.', folder: '', prefix: '' },
  { id: 'sunglasses', name: 'Sunglasses', desc: 'UV-protection sport frames — arriving soon.', folder: '', prefix: '' },
];

interface ImageMetadata {
  src: string;
  width: number;
  height: number;
  format: string;
}

const modules = import.meta.glob('../assets/images/inventory/**/*.png', {
  eager: true,
  query: { w: '128;320;640;1024', format: 'webp', as: 'metadata' },
  import: 'default',
}) as Record<string, ImageMetadata[]>;

function toResponsive(meta: ImageMetadata[]): ResponsiveImageData {
  const sorted = [...meta].sort((a, b) => a.width - b.width);
  const srcset = sorted.map((m) => `${m.src} ${m.width}w`).join(', ');
  const fallback = sorted[sorted.length - 1];
  return { src: fallback.src, srcset, width: fallback.width, height: fallback.height };
}

// Group resolved metadata by their immediate parent folder name, skipping HEIC.
const byFolder = new Map<string, { base: string; image: ResponsiveImageData }[]>();
for (const [path, meta] of Object.entries(modules)) {
  if (path.includes('/HEIC/')) continue;
  const parts = path.split('/');
  const file = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  const base = file.replace(/\.png$/i, '');
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

export function paletteFor(category: AccessoryCategory): { token: string; hex: string; name: string }[] {
  const present = new Set<string>();
  for (const v of category.variants) for (const c of v.colors) present.add(c);
  return Object.keys(COLOR_MAP)
    .filter((token) => present.has(token))
    .map((token) => ({ token, hex: COLOR_MAP[token], name: colorLabel(token) }));
}
