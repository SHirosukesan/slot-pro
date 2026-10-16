import type { AimType, EntryRule, Machine, NumValue, ResetState } from '../types/machine';
import { isUsable } from './format';

export type JudgeState = 'go' | 'near' | 'prio' | 'skip' | 'unknown';

export interface JudgeResult {
  state: JudgeState;
  label: string;
  aim: AimType;
  rule: EntryRule | null;
  /** 狙い先の天井（天井狙いなら通常天井/朝一天井、CZ狙いならCZ天井/朝一CZ天井） */
  ceiling: NumValue | null;
  /** 天井まであと何G。出せなければ null */
  distance: number | null;
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
export const NEAR_MARGIN: Record<AimType, number> = { 天井: 100, CZ: 50 };

/** CZ狙いの対象機種か（CZ天井かCZの狙い目が登録されている） */
export const hasAim = (m: Machine, aim: AimType): boolean =>
  aim === '天井' ? true : m.ceilingRules.cz != null || m.entryRules.some((r) => r.aim === 'CZ');

/** 天井までの残り。天井・現在値のどちらかが不明なら null。到達済みは 0 */
export const distanceTo = (ceiling: NumValue | null | undefined, current: number | null): number | null => {
  if (!ceiling || ceiling.value == null || !isUsable(ceiling.status) || current == null) return null;
  return Math.max(0, ceiling.value - current);
};

/** 狙い先の天井を選ぶ。朝イチ（リセット）で朝一の天井が無ければ通常の天井を使う */
export const pickCeiling = (m: Machine, aim: AimType, morningApplied: boolean): NumValue | null => {
  const c = m.ceilingRules;
  if (aim === '天井') return morningApplied ? c.morning : c.normal;
  if (morningApplied && c.czMorning && c.czMorning.value != null && isUsable(c.czMorning.status)) return c.czMorning;
  return c.cz ?? null;
};

export const pickRule = (m: Machine, aim: AimType, morningApplied: boolean): EntryRule | null => {
  if (morningApplied) {
    const r = m.entryRules.find((x) => x.aim === aim && x.condition === '朝イチ');
    if (r) return r;
    return aim === '天井' ? m.morningRules.entry : null;
  }
  return m.entryRules.find((x) => x.aim === aim && x.condition === '通常') ?? null;
};

/**
 * 現在値から狙えるかを判定する。
 * - aim で「天井狙い」「CZ狙い」を切り替える
 * - 朝イチモードで「リセット」のときだけ朝イチ狙い目・朝一天井を使う
 * - 「不明」「据え置き」はリセット扱いしない（不確かな情報でリセット確定にしない）
 */
export const judge = (m: Machine, current: number | null, morning: boolean, reset: ResetState, aim: AimType = '天井'): JudgeResult => {
  const morningApplied = morning && reset === 'リセット';
  const rule = pickRule(m, aim, morningApplied);
  const ceiling = pickCeiling(m, aim, morningApplied);
  const base = { aim, rule, ceiling, morningApplied, distance: distanceTo(ceiling, current) };

  if (!rule || rule.minLine == null || !isUsable(rule.status)) return { ...base, state: 'unknown', label: STATE_LABEL.unknown };
  if (current == null) return { ...base, state: 'skip', label: '未入力' };

  const max = rule.recommended?.max ?? null;
  if (max != null && current > max) return { ...base, state: 'prio', label: STATE_LABEL.prio };
  if (current >= rule.minLine) return { ...base, state: 'go', label: STATE_LABEL.go };
  if (rule.minLine - current <= NEAR_MARGIN[aim]) return { ...base, state: 'near', label: STATE_LABEL.near };
  return { ...base, state: 'skip', label: STATE_LABEL.skip };
};

/**
 * 現在値の保存キー。天井狙いとCZ狙いは数えるG数が別なので分けて持つ。
 * 朝イチはどちらも開店からのG数なので共通（天井側）を使う。
 */
export const counterKey = (machineId: string, aim: AimType, morning: boolean): string =>
  aim === 'CZ' && !morning ? `${machineId}#cz` : machineId;
