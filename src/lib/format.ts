import type { NumValue, Unit, VerificationStatus } from '../types/machine';

export const fmtNum = (n: number): string => n.toLocaleString('ja-JP');

/** 円表示。signed=true なら +/− を付ける */
export const fmtYen = (n: number, signed = false): string => {
  const s = `¥${fmtNum(Math.abs(n))}`;
  if (!signed) return n < 0 ? `−${s}` : s;
  return n > 0 ? `+${s}` : n < 0 ? `−${s}` : s;
};

/** 「550〜650G」「100G」「550G〜」。値がなければ null */
export const fmtRange = (min: number | null, max: number | null, unit: Unit | string): string | null => {
  if (min == null && max == null) return null;
  if (min != null && max != null) return min === max ? `${fmtNum(min)}${unit}` : `${fmtNum(min)}〜${fmtNum(max)}${unit}`;
  if (min != null) return `${fmtNum(min)}${unit}〜`;
  return `〜${fmtNum(max as number)}${unit}`;
};

/** 期待値レンジ。根拠がなければ「未算出」 */
export const fmtEvRange = (ev: { min: number | null; max: number | null } | null): string => {
  if (!ev || (ev.min == null && ev.max == null)) return '未算出';
  if (ev.min != null && ev.max != null) return ev.min === ev.max ? fmtYen(ev.min) : `${fmtYen(ev.min)}〜${fmtYen(ev.max)}`;
  if (ev.min != null) return `${fmtYen(ev.min)}〜`;
  return `〜${fmtYen(ev.max as number)}`;
};

/** やめどきの確認G数: null=未確認 / 0=0G / それ以外 +20G */
export const fmtCheckCount = (n: number | null, unit: Unit): string => {
  if (n == null) return '未確認';
  if (n === 0) return `0${unit}`;
  return `+${fmtNum(n)}${unit}`;
};

export const STATUS_LABEL: Record<VerificationStatus, string> = {
  verified: '確認済み',
  single: '単一ソース',
  needsReview: '要確認',
  unverified: '未確認',
  na: '該当なし',
  sample: '表示サンプル',
};

/** 値が出せない時の表示 */
export const missingText = (status: VerificationStatus): string => (status === 'na' ? 'なし' : '未確認');

/** 計算に使ってよい状態か（要確認・未確認・該当なしは使わない） */
export const isUsable = (status: VerificationStatus): boolean =>
  status === 'verified' || status === 'single' || status === 'sample';

/** 単一数値の表示。値がなければ「未確認」/「なし」 */
export const numText = (v: NumValue): string => (v.value == null ? missingText(v.status) : `${fmtNum(v.value)}${v.unit}`);
