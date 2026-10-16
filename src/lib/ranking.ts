import type { EvCondition, SlotEntry } from '../types/machine';

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
