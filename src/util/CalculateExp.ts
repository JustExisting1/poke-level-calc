import { GrowRate } from "./PokiApiSearch";

export default function CalculateExp(
  currentLevel: number,
  targetLevel: number,
  growRate: GrowRate
): number {
  if (currentLevel == undefined || targetLevel == undefined) return -1;

  switch (growRate) {
    case GrowRate.ERRATIC: {
      const currExp = erratic(currentLevel);
      const targetExp = erratic(targetLevel);
      return targetExp - currExp;
    }
    case GrowRate.MEDIUM_FAST: {
      const currExp = currentLevel ** 3;
      const targetExp = targetLevel ** 3;
      return targetExp - currExp;
    }
    case GrowRate.MEDIUM_SLOW: {
      const currExp =
        (6 / 5) * currentLevel ** 3 -
        15 * currentLevel ** 2 +
        100 * currentLevel -
        140;
      const targetExp =
        (6 / 5) * targetLevel ** 3 -
        15 * targetLevel ** 2 +
        100 * targetLevel -
        140;
      return targetExp - currExp;
    }
    case GrowRate.SLOW: {
      const currExp = (5 * currentLevel ** 3) / 4;
      const targetExp = (5 * targetLevel ** 3) / 4;
      return targetExp - currExp;
    }
    case GrowRate.FLUCTUATING: {
      const currExp = fluctuating(currentLevel);
      const targetExp = fluctuating(targetLevel);
      return targetExp - currExp;
    }
    default:
      return -1;
  }
}

function erratic(lvl: number): number {
  if (lvl < 50) return (lvl ** 3 * (100 - lvl)) / 50;
  else if (50 <= lvl && lvl < 68) return (lvl ** 3 * (150 - lvl)) / 100;
  else if (68 <= lvl && lvl < 98)
    return (lvl ** 3 * ~~((1911 - 10 * lvl) / 3)) / 500;
  else return (lvl ** 3 * (160 - lvl)) / 100;
}

function fluctuating(lvl: number): number {
  if (lvl < 15) return (lvl ** 3 * (~~((lvl + 1) / 3) + 24)) / 50;
  else if (15 <= lvl && lvl < 36) return (lvl ** 3 * (lvl + 14)) / 50;
  else return (lvl ** 3 * (~~(lvl / 2) + 32)) / 50;
}
/*
  api = wiki
  slow-then-very-fast = erratic
  fast = fast
  medium = medium fast 
  medium-slow = medium slow
  slow = slow
  slow-then-very-slow = Fluctuating
*/
