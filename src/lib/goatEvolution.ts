export type GoatStage = 'default' | 'tok' | 'kasli' | 'alpha';

export function getGoatStage(streak: number): GoatStage {
  if (streak >= 60) return 'alpha';
  if (streak >= 21) return 'kasli';
  if (streak >= 7) return 'tok';
  return 'default';
}

export const GOAT_SPRITES: Record<GoatStage, string> = {
  default: '/goat/default.png',
  tok: '/goat/tok.png',
  kasli: '/goat/kasli.png',
  alpha: '/goat/alpha.png'
};
