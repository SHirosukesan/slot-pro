import type { AdvantageousSectionRules } from '../types/machine';
import { isUsable } from './format';

export type RemainingResult =
  | { kind: 'ok'; remaining: number; target: number }
  | { kind: 'none' } // 仕組みなし
  | { kind: 'unconfirmed' } // 切断条件が未確認
  | { kind: 'notNet' } // 差枚の条件ではない（獲得枚数等）→差枚から計算しない
  | { kind: 'noStart' } // 区間開始点が不明
  | { kind: 'noInput' };

/**
 * 切断までの残り差枚。
 * - 機種固有の「差枚」切断条件だけを使う（規定上の基準 +2,400 枚では計算しない）
 * - 区間開始点が不明・切断条件が未確定なら計算しない
 */
export const remainingNet = (
  rules: AdvantageousSectionRules,
  currentNet: number | null,
  startKnown: boolean,
): RemainingResult => {
  if (rules.mechanism === 'none') return { kind: 'none' };
  const net = rules.cutConditions.find((c) => c.kind === '差枚');
  if (!net) return rules.cutConditions.length > 0 ? { kind: 'notNet' } : { kind: 'unconfirmed' };
  if (net.value == null || !isUsable(net.status)) return { kind: 'unconfirmed' };
  if (!startKnown) return { kind: 'noStart' };
  if (currentNet == null) return { kind: 'noInput' };
  return { kind: 'ok', remaining: Math.max(0, net.value - currentNet), target: net.value };
};
