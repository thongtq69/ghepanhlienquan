export interface GridBlock {
  id: string;
  type: 'empty' | 'asset' | 'skin' | 'profile' | 'accessories' | 'overall';
  file?: string;
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
export const HEADER_FIXED = AVATAR_W + SCROLL_W + PROFILE_W; // 6
export const MIN_COLS = 6;
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
 * Pick column count for a balanced, visually pleasing layout.
 *
 * Strategy: target a grid where total skin rows ≈ sqrt(skinCount / 1.5)
 * This creates a roughly portrait/square ratio that looks good
 * alongside the overall image above.
 *
 * Then pick the column count with the least waste near that target.
 */
export function getOptimalColumns(blocks: GridBlock[]): number {
  const skinCount = blocks.filter((b) => b.type === 'skin').length;
  if (skinCount === 0) return MIN_COLS;

  // Target total skin rows for visual balance (including header rows)
  const targetTotalRows = Math.max(3, Math.round(Math.sqrt(skinCount / 1.5)));

  // Estimate columns from target rows: skinCount ≈ cols * targetTotalRows (rough)
  const targetCols = Math.round(skinCount / targetTotalRows) + 2; // +2 for header overhead
  const searchMin = Math.max(MIN_COLS, targetCols - 5);
  const searchMax = Math.min(MAX_COLS, targetCols + 5);

  let bestCols = Math.max(MIN_COLS, Math.min(MAX_COLS, targetCols));
  let bestScore = -Infinity;

  for (let cols = searchMin; cols <= searchMax; cols++) {
    if (cols < HEADER_FIXED) continue;

    // Row 1: avatar(1) + accessories(1) + skins
    const row1Skins = cols - AVATAR_W - SCROLL_W;
    // Row 2: profile(4) + skins
    const row2Skins = cols - PROFILE_W;
    const headerSkins = row1Skins + row2Skins;

    const remaining = Math.max(0, skinCount - headerSkins);
    const bodyRows = remaining > 0 ? Math.ceil(remaining / cols) : 0;
    const totalRows = 2 + bodyRows;
    const waste = (bodyRows > 0) ? (bodyRows * cols - remaining) : 0;

    // Score: penalize waste, penalize deviation from target rows
    const rowDiff = Math.abs(totalRows - targetTotalRows);
    const score = -waste * 5 - rowDiff * 15;

    if (score > bestScore || (score === bestScore && cols <= bestCols)) {
      bestScore = score;
      bestCols = cols;
    }
  }

  return bestCols;
}

/**
 * Build final grid layout:
 * - Row 0 (optional): Overall image = full grid width
 * - Row 1: Avatar + Accessories + Skins
 * - Row 2: Profile(4w) + Skins
 * - Row 3+: Remaining skins, last row padded
 */
export function buildDisplayGrid(blocks: GridBlock[], cols: number): GridBlock[] {
  const overall = blocks.find((b) => b.type === 'overall');
  const avatar = blocks.find((b) => b.id === 'b_avatar') || blocks.find((b) => b.type === 'asset' && b.file === 'avatar1.png');
  const profile = blocks.find((b) => b.id === 'b_profile') || blocks.find((b) => b.type === 'profile');
  const accessories = blocks.find((b) => b.id === 'b_accessories') || blocks.find((b) => b.type === 'accessories');
  const skins = blocks.filter((b) => b.type === 'skin');

  const grid: GridBlock[] = [];
  let skinIdx = 0;

  // Overall — full width
  if (overall) {
    grid.push({ ...overall, w: cols });
  }

  // Row 1: avatar + accessories + skins
  if (avatar) grid.push(avatar);
  grid.push(accessories || { id: 'b_accessories', type: 'accessories', w: SCROLL_W, emblemCount: 0, scrollCount: 0 });
  const row1Capacity = cols - AVATAR_W - SCROLL_W;
  for (let i = 0; i < row1Capacity; i++) {
    grid.push(skinIdx < skins.length ? skins[skinIdx++] : createEmptyBlock());
  }

  // Row 2: profile + skins
  if (profile) grid.push(profile);
  const row2Capacity = cols - PROFILE_W;
  for (let i = 0; i < row2Capacity; i++) {
    grid.push(skinIdx < skins.length ? skins[skinIdx++] : createEmptyBlock());
  }

  // Remaining rows
  while (skinIdx < skins.length) {
    grid.push(skins[skinIdx++]);
  }

  // Pad last row
  const totalNonOverall = grid.filter(b => b.type !== 'overall').length;
  const remainder = totalNonOverall % cols;
  if (remainder > 0) {
    for (let i = 0; i < cols - remainder; i++) {
      grid.push(createEmptyBlock());
    }
  }

  return grid;
}

/** Build blocks from account data */
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
