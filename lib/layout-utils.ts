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
export const MIN_COLS = 10;
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

/** Pick column count that wastes the fewest cells on the last row */
export function getOptimalColumns(blocks: GridBlock[]) {
  const skinCount = blocks.filter((b) => b.type === 'skin').length;
  if (skinCount === 0) return MIN_COLS;

  let bestCols = MIN_COLS;
  let bestWaste = Infinity;

  for (let cols = MIN_COLS; cols <= MAX_COLS; cols++) {
    if (cols < PROFILE_W) continue;
    const row1Skins = cols - AVATAR_W - SCROLL_W;
    const row2Skins = cols - PROFILE_W;
    const filledInHeaderRows = row1Skins + row2Skins;
    const remaining = Math.max(0, skinCount - filledInHeaderRows);
    const fullRows = Math.ceil(remaining / cols);
    const waste = fullRows * cols - remaining;
    if (waste < bestWaste || (waste === bestWaste && cols > bestCols)) {
      bestWaste = waste;
      bestCols = cols;
    }
  }
  return bestCols;
}

/** Build final grid layout for display and export */
export function buildDisplayGrid(blocks: GridBlock[], cols: number): GridBlock[] {
  const overall = blocks.find((b) => b.type === 'overall');
  const avatar = blocks.find((b) => b.id === 'b_avatar') || blocks.find((b) => b.type === 'asset' && b.file === 'avatar1.png');
  const profile = blocks.find((b) => b.id === 'b_profile') || blocks.find((b) => b.type === 'profile');
  const accessories = blocks.find((b) => b.id === 'b_accessories') || blocks.find((b) => b.type === 'accessories');
  const skins = blocks.filter((b) => b.type === 'skin');

  const grid: GridBlock[] = [];
  let skinIdx = 0;

  if (overall) {
    grid.push({ ...overall, w: cols });
  }

  if (avatar) grid.push(avatar);
  if (accessories) {
    grid.push(accessories);
  } else {
    grid.push({ id: 'b_accessories', type: 'accessories', w: SCROLL_W, emblemCount: 0, scrollCount: 0 });
  }
  const row1Fill = cols - AVATAR_W - SCROLL_W;
  for (let i = 0; i < row1Fill && skinIdx < skins.length; i++) {
    grid.push(skins[skinIdx++]);
  }

  if (profile) grid.push(profile);
  const row2Fill = cols - PROFILE_W;
  for (let i = 0; i < row2Fill && skinIdx < skins.length; i++) {
    grid.push(skins[skinIdx++]);
  }

  while (skinIdx < skins.length) {
    grid.push(skins[skinIdx++]);
  }

  return grid;
}

/** Build GridBlock array from account data + form inputs */
export function buildBlocksFromAccountData(data: {
  skins: Array<{ image: string; image_url?: string }>;
  heroes_count: number;
  skins_count: number;
}, opts: {
  overallFile?: string | null;
  overallImageUrl?: string | null;
  emblemCount?: number;
  scrollCount?: number;
}): GridBlock[] {
  return [
    ...(opts.overallFile ? [{ id: 'b_overall', type: 'overall' as const, file: opts.overallFile, imageUrl: opts.overallImageUrl || undefined, w: 1 }] : []),
    { id: 'b_avatar', type: 'asset' as const, file: 'avatar1.png', w: AVATAR_W },
    { id: 'b_accessories', type: 'accessories' as const, w: SCROLL_W, emblemCount: opts.emblemCount || 0, scrollCount: opts.scrollCount || 0 },
    { id: 'b_profile', type: 'profile' as const, w: PROFILE_W, heroCount: data.heroes_count, skinCount: data.skins_count },
    ...data.skins.map((s, i) => ({
      id: 'sk_' + i,
      type: 'skin' as const,
      file: s.image,
      imageUrl: s.image_url || undefined,
      w: 1,
    })),
  ];
}
