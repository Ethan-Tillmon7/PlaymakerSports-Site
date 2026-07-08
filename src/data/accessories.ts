import { COLOR_MAP, colorLabel, parseVariantName } from './accessoryParse';

export interface AccessoryVariant {
  id: string;
  label: string;
  imageUrl: string;
  colors: string[];
}

export interface AccessoryCategory {
  id: string;
  name: string;
  desc: string;
  folder: string; // inventory subfolder name
  prefix: string; // filename type prefix to strip
  comingSoon: boolean;
  coverImage?: string;
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

// Eager URL glob of every inventory PNG. Vite resolves these to hashed asset URLs.
const modules = import.meta.glob('../assets/images/inventory/**/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

// Group resolved URLs by their immediate parent folder name, skipping HEIC.
const byFolder = new Map<string, { base: string; url: string }[]>();
for (const [path, url] of Object.entries(modules)) {
  if (path.includes('/HEIC/')) continue;
  const parts = path.split('/');
  const file = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  const base = file.replace(/\.png$/i, '');
  const list = byFolder.get(folder) ?? [];
  list.push({ base, url });
  byFolder.set(folder, list);
}

function buildVariants(def: CategoryDef): { variants: AccessoryVariant[]; coverImage?: string } {
  const files = (byFolder.get(def.folder) ?? []).slice().sort((a, b) => a.base.localeCompare(b.base));
  let coverImage: string | undefined;
  const variants: AccessoryVariant[] = [];
  const seen = new Set<string>();

  for (const { base, url } of files) {
    // A "-package" shot becomes the cover, not a variant.
    if (/-package$/i.test(base)) {
      coverImage = url;
      continue;
    }
    const parsed = parseVariantName(base, def.prefix);
    let id = parsed.id || base.toLowerCase();
    while (seen.has(id)) id = `${id}-x`;
    seen.add(id);
    variants.push({ id, label: parsed.label, imageUrl: url, colors: parsed.colors });
  }

  if (!coverImage && variants.length > 0) coverImage = variants[0].imageUrl;
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
