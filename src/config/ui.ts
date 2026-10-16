/**
 * 表示設定（M. UIの調整しやすさ）
 * 色・角丸・余白・フォントサイズ・画像サイズは styles/tokens.css の CSS変数で一括調整。
 * ここでは「何をどの順で出すか」を調整する。
 */

/** 一覧カードに出す項目 */
export const LIST_ITEMS = {
  aim: true, // 狙い目
  ev: true, // 期待値
  ceiling: false, // 通常天井
} as const;

/** 機種詳細の表示順（上から）。消せば非表示、並べ替えれば順番が変わる */
export type DetailKey =
  | 'aim'
  | 'ev'
  | 'ceilingNormal'
  | 'ceilingMorning'
  | 'quit'
  | 'precursor'
  | 'zone'
  | 'skipCeiling'
  | 'skipAim'
  | 'resetBenefit'
  | 'resetDetect'
  | 'advantage';

export const DETAIL_ORDER: DetailKey[] = [
  'aim',
  'ev',
  'ceilingNormal',
  'ceilingMorning',
  'quit',
  'precursor',
  'zone',
  'skipCeiling',
  'skipAim',
  'resetBenefit',
  'resetDetect',
  'advantage',
];

/** 入力シートのワンタップ加減算ボタン */
export const STEP_BUTTONS = [-100, -10, 10, 100] as const;

/** 期待値の基準条件の選択肢 */
export const EXCHANGE_RATES = [5.0, 5.6, 6.0] as const;

/** 期待値順で大きなカードで出す台数（それ以降は1行で順番だけ表示） */
export const RANKING_TOP = 5;
