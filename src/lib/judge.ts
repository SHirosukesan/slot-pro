import type { EntryRule, Machine, NumValue, ResetState } from '../types/machine';
import { isUsable } from './format';

export type JudgeState = 'go' | 'near' | 'prio' | 'skip' | 'unknown';

export interface JudgeResult {
  state: JudgeState;
  label: string;
  rule: EntryRule | null;
  ceiling: NumValue;
  /** 朝イチ表示中か（リセット時のみ朝イチ狙い目・朝一天井を使う） */
  morningApplied: boolean;
}

export const STATE_LABEL: Record<JudgeState, string> = {
  go: '打てる',
  near: 'あと少し',
  prio: '優先',
  skip: '見送り',
  unknown: '未確認',
};

/** 最低ラインまでこの幅以内なら「あと少し」 */
export const NEAR_MARGIN = 100;

/**
 * 現在値から狙えるかを判定する。
 * - 朝イチモードで「リセット」のときだけ朝イチ狙い目・朝一天井を使う
 * - 「不明」「据え置き」はリセット扱いしない（不確かな情報でリセット確定にしない）
 */
export const judge = (m: Machine, current: number | null, morning: boolean, reset: ResetState): JudgeResult => {
  const morningApplied = morning && reset === 'リセット';
  const rule = morningApplied
    ? m.morningRules.entry
    : (m.entryRules.find((r) => r.condition === '通常') ?? m.entryRules[0] ?? null);
  const ceiling = morningApplied ? m.ceilingRules.morning : m.ceilingRules.normal;
  const base = { rule, ceiling, morningApplied };

  if (!rule || rule.minLine == null || !isUsable(rule.status)) return { ...base, state: 'unknown', label: STATE_LABEL.unknown };
  if (current == null) return { ...base, state: 'skip', label: '未入力' };

  const max = rule.recommended?.max ?? null;
  if (max != null && current > max) return { ...base, state: 'prio', label: STATE_LABEL.prio };
  if (current >= rule.minLine) return { ...base, state: 'go', label: STATE_LABEL.go };
  if (rule.minLine - current <= NEAR_MARGIN) return { ...base, state: 'near', label: STATE_LABEL.near };
  return { ...base, state: 'skip', label: STATE_LABEL.skip };
};
