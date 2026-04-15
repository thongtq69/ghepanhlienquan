export interface GridBlock {
  id: string;
  type: 'empty' | 'asset' | 'skin' | 'profile' | 'accessories' | 'overall';
  file?: string;
  /** Signed URL for rendering (FE only — not sent to BE generate) */
  imageUrl?: string;
  w: number;
  badge?: string | null;
  heroCount?: number;
  skinCount?: number;
  emblemCount?: number;
  scrollCount?: number;
}

export const PROFILE_W = 4;
export const AVATAR_W = 1;
export const SCROLL_W = 1;
export const HEADER_FIXED = AVATAR_W + SCROLL_W + PROFILE_W; // 6 cols fixed in header
export const MIN_COLS = 8;
export const MAX_COLS = 30;

export function createEmptyBlock(): GridBlock {
  return { id: 'bl_' + Math.random().toString(36).substr(2, 9), type: 'empty', w: 1 };
}

export function defaultGrid(): GridBlock[] {
  return [
    { id: 'b_avatar', type: 'asset', file: 'avatar1.png', w: AVATAR_W },
    { id: 'b_accessories', type: 'accessories', w: SCROLL_W, emblemCount: 0, scrollCount: 0 },
    { id: 'b_profile', type: 'profile', w: PROFILE_W, heroCount: 0, skinCount: 0 },
  ];
}

/**
 * Pick optimal column count that:
 * 1. Fills the last row as completely as possible (least waste)
 * 2. Keeps grid compact — not too wide for small accounts
 * 3. Overall image auto-stretches to match grid width
 */
export function getOptimalColumns(blocks: GridBlock[]): number {
  const skinCount = blocks.filter((b) => b.type === 'skin').length;
  if (skinCount === 0) return MIN_COLS;

  // For very few skins, use smaller grid
  if (skinCount <= 5) return MIN_COLS;
  if (skinCount <= 12) return Math.max(MIN_COLS, Math.min(12, skinCount + HEADER_FIXED));

  let bestCols = MIN_COLS;
  let bestScore = -Infinity;

  for (let cols = MIN_COLS; cols <= MAX_COLS; cols++) {
    if (cols < HEADER_FIXED) continue;

    // Row 1: avatar(1) + accessories(1) + skins to fill
    const row1Skins = cols - AVATAR_W - SCROLL_W;
    // Row 2: profile(4) + skins to fill
    const row2Skins = cols - PROFILE_W;
    const headerSkins = row1Skins + row2Skins;

    const remaining = Math.max(0, skinCount - headerSkins);
    const fullRows = remaining > 0 ? Math.ceil(remaining / cols) : 0;
    const totalCells = fullRows * cols;
    const waste = totalCells - remaining;

    // Score: prefer less waste, then prefer fewer total rows (compact)
    const totalRows = 2 + fullRows; // header rows + skin rows
    const score = -waste * 10 - totalRows;

    if (score > bestScore) {
      bestScore = score;
      bestCols = cols;
    }
  }
  return bestCols;
}

/**
 * Build final grid layout for display and export.
 * - Row 0 (optional): Overall image spanning full width
 * - Row 1: Avatar + Accessories + Skins
 * - Row 2: Profile(4 cols) + Skins
 * - Row 3+: Remaining skins, last row padded with empty blocks
 */
export function buildDisplayGrid(blocks: GridBlock[], cols: number): GridBlock[] {
  const overall = blocks.find((b) => b.type === 'overall');
  const avatar = blocks.find((b) => b.id === 'b_avatar') || blocks.find((b) => b.type === 'asset' && b.file === 'avatar1.png');
  const profile = blocks.find((b) => b.id === 'b_profile') || blocks.find((b) => b.type === 'profile');
  const accessories = blocks.find((b) => b.id === 'b_accessories') || blocks.find((b) => b.type === 'accessories');
  const skins = blocks.filter((b) => b.type === 'skin');

  const grid: GridBlock[] = [];
  let skinIdx = 0;

  // Overall row — spans full grid width
  if (overall) {
    grid.push({ ...overall, w: cols });
  }

  // Row 1: avatar + accessories + skins
  if (avatar) grid.push(avatar);
  grid.push(accessories || { id: 'b_accessories', type: 'accessories', w: SCROLL_W, emblemCount: 0, scrollCount: 0 });
  const row1Fill = cols - AVATAR_W - SCROLL_W;
  for (let i = 0; i < row1Fill && skinIdx < skins.length; i++) {
    grid.push(skins[skinIdx++]);
  }
  // Pad row 1 if not enough skins
  const row1Used = AVATAR_W + SCROLL_W + Math.min(row1Fill, skins.length);
  for (let i = row1Used; i < cols && skinIdx >= skins.length; i++) {
    grid.push(createEmptyBlock());
  }

  // Row 2: profile + skins
  if (profile) grid.push(profile);
  const row2Fill = cols - PROFILE_W;
  for (let i = 0; i < row2Fill && skinIdx < skins.length; i++) {
    grid.push(skins[skinIdx++]);
  }
  // Pad row 2 if not enough skins
  const row2SkinsFilled = Math.min(row2Fill, skins.length - (skinIdx - Math.min(row2Fill, skins.length - (skinIdx - row2Fill))));
  if (skinIdx >= skins.length) {
    const row2Used = PROFILE_W + (skins.length > row1Fill ? Math.min(row2Fill, skins.length - row1Fill) : 0);
    for (let i = row2Used; i < cols; i++) {
      grid.push(createEmptyBlock());
    }
  }

  // Remaining rows: skins fill left to right
  while (skinIdx < skins.length) {
    grid.push(skins[skinIdx++]);
  }

  // Pad last row to fill complete row
  const totalNonOverall = grid.filter(b => b.type !== 'overall').length;
  const remainder = totalNonOverall % cols;
  if (remainder > 0) {
    const padding = cols - remainder;
    for (let i = 0; i < padding; i++) {
      grid.push(createEmptyBlock());
    }
  }

  return grid;
}

/** Build GridBlock array from account data + form inputs */
export function buildBlocksFromAccountData(data: {
  skins: Array<{ t: string }>;
  heroes_count: number;
  skins_count: number;
}, opts: {
  overallFile?: string | null;
  emblemCount?: number;
  scrollCount?: number;
}): GridBlock[] {
  return [
    ...(opts.overallFile ? [{ id: 'b_overall', type: 'overall' as const, file: opts.overallFile, w: 1 }] : []),
    { id: 'b_avatar', type: 'asset' as const, file: 'avatar1.png', w: AVATAR_W },
    { id: 'b_accessories', type: 'accessories' as const, w: SCROLL_W, emblemCount: opts.emblemCount || 0, scrollCount: opts.scrollCount || 0 },
    { id: 'b_profile', type: 'profile' as const, w: PROFILE_W, heroCount: data.heroes_count, skinCount: data.skins_count },
    ...data.skins.map((s, i) => ({
      id: 'sk_' + i,
      type: 'skin' as const,
      file: s.t,
      imageUrl: `/img/t/${s.t}`,
      w: 1,
    })),
  ];
}
