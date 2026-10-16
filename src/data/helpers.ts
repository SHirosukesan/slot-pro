import type {
  Certainty,
  SourceRef,
  Detection,
  EvCondition,
  NumValue,
  RangeValue,
  TextValue,
  Unit,
  VerificationStatus,
} from '../types/machine';

/**
 * データ記述用ヘルパー。
 * STEP1 のサンプル値は必ず status: 'sample' にする（画面に「表示サンプル」と出る）。
 */

export const num = (value: number | null, unit: Unit, status: VerificationStatus = 'sample', note?: string): NumValue => ({
  value,
  unit,
  status,
  sources: [],
  ...(note ? { note } : {}),
});

export const range = (min: number | null, max: number | null, unit: Unit, status: VerificationStatus = 'sample'): RangeValue => ({
  min,
  max,
  unit,
  status,
  sources: [],
});

export const text = (t: string | null, status: VerificationStatus = 'sample'): TextValue => ({
  text: t,
  status,
  sources: [],
});

/** 公表情報なし */
export const unverifiedText = (): TextValue => text(null, 'unverified');
/** 仕組みなし */
export const naText = (): TextValue => text(null, 'na');
export const naNum = (unit: Unit): NumValue => num(null, unit, 'na');

export const detect = (label: string, method: string, certainty: Certainty, status: VerificationStatus = 'sample'): Detection => ({
  label,
  method,
  certainty,
  status,
  sources: [],
});

/** サンプル期待値の計算前提（全機種共通の架空条件） */
export const SAMPLE_EV_CONDITION: EvCondition = {
  exchangeRate: 5.6,
  play: '持ちメダル',
  quitAssumption: '機種別やめどき',
  closingConsidered: false,
};

/** 出典の記録 */
export const src = (site: string, url: string, referencedAt = '2026-10-17'): SourceRef => ({ site, url, referencedAt });

/**
 * 出典つきの数値。出典が2件以上で一致したら verified、1件なら needsReview（確認待ち）。
 * 食い違いがある時は status を明示して渡す。
 */
export const sourcedNum = (value: number | null, unit: Unit, sources: SourceRef[], note?: string, status?: VerificationStatus): NumValue => ({
  value,
  unit,
  status: status ?? (sources.length >= 2 ? 'verified' : 'needsReview'),
  sources,
  checkedAt: '2026-10-17',
  ...(note ? { note } : {}),
});

/** 出典つきの短文 */
export const sourcedText = (t: string, sources: SourceRef[], note?: string, status?: VerificationStatus): TextValue => ({
  text: t,
  status: status ?? (sources.length >= 2 ? 'verified' : 'needsReview'),
  sources,
  checkedAt: '2026-10-17',
  ...(note ? { note } : {}),
});
