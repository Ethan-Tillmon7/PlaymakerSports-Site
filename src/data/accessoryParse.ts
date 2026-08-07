// Curated color token -> hex. Insertion order defines palette display order.
// Only tokens present in the inventory filenames are included.
export const COLOR_MAP: Record<string, string> = {
  white: '#F4F1E8',
  cream: '#E8D89A',
  yellow: '#F5C842',
  gold: '#C99E1F',
  orange: '#E07A2F',
  lightorange: '#F0A02A',
  darkorange: '#C2551C',
  red: '#C0392B',
  pink: '#E86FA6',
  hotpink: '#D45CB4',
  peach: '#F1B48A',
  purple: '#6C3FB5',
  navy: '#1A2B5C',
  blue: '#2B5FB5',
  lightblue: '#7FB2E5',
  teal: '#2FA5A0',
  green: '#2E8B4F',
  darkgreen: '#1F4D2C',
  lime: '#9BCB3C',
  silver: '#B8BCC2',
  gray: '#8A8D93',
  black: '#111111',
};

// Multi-word color tokens that need a nicer display label than title-case.
const COLOR_LABEL_OVERRIDES: Record<string, string> = {
  lightblue: 'Light Blue',
  darkgreen: 'Dark Green',
  lightorange: 'Light Orange',
  darkorange: 'Dark Orange',
  hotpink: 'Hot Pink',
};

// Non-color tokens that need a nicer display label than plain title-case.
const WORD_OVERRIDES: Record<string, string> = {
  usa: 'USA',
  goat: 'GOAT',
  icandoallthings: 'I Can Do All Things',
  gods: "God's",
  crossbats: 'Cross Bats',
  redtape: 'Red Tape',
  lightningbolt: 'Lightning Bolt',
  icecreamdrip: 'Ice Cream Drip',
  icecream: 'Ice Cream',
  gingerbreadman: 'Gingerbread Man',
  swagswag: 'Swag Swag',
  digitalcamo: 'Digital Camo',
};

function titleCase(token: string): string {
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

export function colorLabel(token: string): string {
  return COLOR_LABEL_OVERRIDES[token] ?? titleCase(token);
}

function wordLabel(token: string): string {
  return WORD_OVERRIDES[token] ?? titleCase(token);
}

/**
 * Parse an inventory filename base (no extension) into a variant.
 * - Strips the given type prefix (case-insensitive) and a trailing "(1)" dupe marker.
 * - Classifies each `-`-separated token as a color (in COLOR_MAP) or a design word.
 * - Produces a readable label and the ordered list of color tokens found.
 */
export function parseVariantName(
  base: string,
  prefix: string,
): { id: string; label: string; colors: string[] } {
  let slug = base;
  if (slug.toLowerCase().startsWith(prefix.toLowerCase())) {
    slug = slug.slice(prefix.length);
  }
  slug = slug.replace(/\(\d+\)$/, ''); // drop trailing "(1)"
  slug = slug.replace(/^-+|-+$/g, '');

  const tokens = slug.split('-').filter(Boolean);
  const id = slug.toLowerCase();

  // All-numeric remainder -> "Design N"
  if (tokens.length > 0 && tokens.every((t) => /^\d+$/.test(t))) {
    return { id, label: `Design ${tokens.join(' ')}`, colors: [] };
  }

  const colors: string[] = [];
  const labelParts: string[] = [];
  for (const raw of tokens) {
    const token = raw.toLowerCase();
    if (token in COLOR_MAP) {
      colors.push(token);
      labelParts.push(colorLabel(token));
    } else {
      labelParts.push(wordLabel(token));
    }
  }

  const label = labelParts.join(' ') || 'Design';
  return { id, label, colors };
}
