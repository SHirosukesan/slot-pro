import type { AimType, EvCondition, Machine, SlotEntry, Unit } from '../types/machine';
import { hasAim, judge } from './judge';

export interface RankedSlot extends SlotEntry {
  /** 時給換算（円/時）。消化時間が無ければ null */
  hourly: number | null;
}

export interface Excluded {
  slot: SlotEntry;
  reason: '条件不一致' | '未算出';
}

export const sameCondition = (a: EvCondition, b: EvCondition): boolean =>
  a.exchangeRate === b.exchangeRate &&
  a.play === b.play &&
  a.quitAssumption === b.quitAssumption &&
  a.closingConsidered === b.closingConsidered;

/**
 * 期待値ランキング。
 * 計算条件が基準と違う行・期待値が無い行は順位付けせず「順位外」にする。
 * 時給順は全行に消化時間がある場合のみ可能。
 */
export const rankSlots = (slots: SlotEntry[], base: EvCondition, sortBy: 'ev' | 'hourly' = 'ev') => {
  const excluded: Excluded[] = [];
  const ranked: RankedSlot[] = [];
  for (const s of slots) {
    if (s.ev == null || !s.evCondition) excluded.push({ slot: s, reason: '未算出' });
    else if (!sameCondition(s.evCondition, base)) excluded.push({ slot: s, reason: '条件不一致' });
    else
      ranked.push({
        ...s,
        hourly: s.estimatedMinutes ? Math.round(s.ev / (s.estimatedMinutes / 60)) : null,
      });
  }
  const hourlyAvailable = ranked.length > 0 && ranked.every((r) => r.hourly != null);
  const key = sortBy === 'hourly' && hourlyAvailable ? 'hourly' : 'ev';
  ranked.sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0));
  return { ranked, excluded, hourlyAvailable, sortedBy: key as 'ev' | 'hourly' };
};

export interface NearestTarget {
  aim: AimType;
  /** 天井 or CZ天井までの残り */
  distance: number;
  unit: Unit;
  /** 引いた元の現在値 */
  current: number;
}

/**
 * 天井とCZ天井のうち、残りG数が近い方を返す。どちらも出せなければ null。
 * （単位が違う・天井が未確認・現在値が無い場合は比べない）
 */
export const nearestTarget = (m: Machine, slot: Pick<SlotEntry, 'current' | 'czCurrent' | 'resetState'>): NearestTarget | null => {
  const cands: NearestTarget[] = [];
  const t = judge(m, slot.current, false, slot.resetState, '天井');
  if (t.distance != null) cands.push({ aim: '天井', distance: t.distance, unit: t.unit, current: slot.current });
  if (hasAim(m, 'CZ') && slot.czCurrent != null) {
    const c = judge(m, slot.czCurrent, false, slot.resetState, 'CZ');
    if (c.distance != null) cands.push({ aim: 'CZ', distance: c.distance, unit: c.unit, current: slot.czCurrent });
  }
  cands.sort((a, b) => a.distance - b.distance);
  return cands[0] ?? null;
};
