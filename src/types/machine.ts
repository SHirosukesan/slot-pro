/**
 * SLOT PRO 機種データ型
 * UI と攻略データを分離するため、画面側はこの型だけを参照する。
 * 数値・単位・適用条件・出典は必ず独立して持つ。
 */

/** データ状態（K. データ検証） */
export type VerificationStatus =
  | 'verified' // 確認済み（独立した2つ以上の情報源で一致）
  | 'single' // 単一ソース（信頼性の高い一次資料1件）
  | 'needsReview' // 要確認（情報源で不一致など）
  | 'unverified' // 未確認（出典なし）
  | 'na' // 該当なし（その仕組みが無い）
  | 'sample'; // 表示サンプル（STEP1 の架空値。実機値ではない）

/** 判別の確度（F. 朝イチ） */
export type Certainty = '確定' | '示唆' | '推測' | '未確認';

/** 対応単位 */
/** 対応単位。当たりまでを数える単位は機種ごとに違う（G・喰・あべし・pt など） */
export type Unit = 'G' | '液晶G' | '喰' | 'あべし' | 'pt' | '周期' | '回' | '枚' | '円';

export type MachineType = 'pachislot' | 'pachinko';

export interface SourceRef {
  /** 例: ちょんぼりすた / DMMぱちタウン / メーカー公式 */
  site: string;
  /** 該当記事・該当見出しのURL。トップページで代用しない */
  url: string;
  /** 参照日 YYYY-MM-DD */
  referencedAt: string;
}

/** 出典つき情報の共通部分 */
export interface Sourced {
  status: VerificationStatus;
  sources: SourceRef[];
  /** 確認日 YYYY-MM-DD */
  checkedAt?: string;
  /** 短い補足（長文は書かない） */
  note?: string;
}

/** 単一の数値 */
export interface NumValue extends Sourced {
  value: number | null;
  unit: Unit;
}

/** 範囲値 */
export interface RangeValue extends Sourced {
  min: number | null;
  max: number | null;
  unit: Unit;
}

/** 短文情報 */
export interface TextValue extends Sourced {
  text: string | null;
}

/** 何を狙うか。天井狙い（AT・ボーナスの天井）と CZ狙い（チャンスゾーンの天井・ゾーン）を分ける */
export type AimType = '天井' | 'CZ';

/** 適用条件 */
export type Condition = '通常' | '朝イチ' | 'リセット' | '据え置き' | 'AT後' | 'ボーナス後';

/** 期待値の計算前提（I. 期待値データ） */
export interface EvCondition {
  /** 交換率 (枚/1000円)。例: 5.0 = 等価 / 5.6 */
  exchangeRate: number;
  /** 持ちメダル or 現金投資 */
  play: '持ちメダル' | '現金';
  /** 期待値計算でのやめどき前提 */
  quitAssumption: string;
  /** 閉店時間を考慮しているか */
  closingConsidered: boolean;
}

/** 狙い目（範囲がある場合は最低ラインと推奨範囲を分ける） */
export interface EntryRule extends Sourced {
  id: string;
  /** 天井狙い / CZ狙い */
  aim: AimType;
  /** 通常 / 朝イチ など。朝イチの CZ狙いは condition: '朝イチ' で登録する */
  condition: Condition;
  /** 何で判断するか: G / 液晶G / あべし / pt 等 */
  unit: Unit;
  /** 最低ライン */
  minLine: number | null;
  /** 推奨範囲 */
  recommended: { min: number | null; max: number | null } | null;
  /** 範囲内の各条件に対応する根拠ある期待値（円）。根拠がなければ null = 未算出 */
  ev: { min: number | null; max: number | null; condition: EvCondition } | null;
  /** 確認対象の説明（例: 液晶G数） */
  target?: string;
}

/** やめどき。確認G数は必須: 0 = 追加確認不要、null = 未確認 */
export interface QuitRule extends Sourced {
  id: string;
  /** どの状況でのやめどきか（例: AT終了後） */
  situation: string;
  checkCount: number | null;
  unit: Unit;
  /** 短い補足（例: 前兆なければヤメ） */
  action: string;
}

/** 前兆。発生目安・確認G数・終了条件を区別 */
export interface PrecursorRule extends Sourced {
  /** 発生目安（例: 天井・ゾーンの何G手前から） */
  onset: { min: number | null; max: number | null; unit: Unit } | null;
  /** 確認G数 */
  checkCount: number | null;
  checkUnit: Unit;
  /** 終了条件（短文） */
  endCondition: string | null;
}

export interface ZoneRule extends Sourced {
  id: string;
  label: string;
  min: number | null;
  max: number | null;
  unit: Unit;
}

/** スルー。機種に仕組みが無ければ Machine.skipRules = null（表示しない） */
export interface SkipRules {
  /** 何を失敗した回数か（必須定義） */
  definition: string;
  ceiling: NumValue;
  aimFrom: NumValue;
}

/** AT駆け抜け（単発・すぐ終了）時の扱い。情報がある機種だけ登録 */
export interface KakenukeRule {
  /** 何をもって駆け抜けとするか（機種ごとに違う） */
  definition: string;
  /** 駆け抜け後の恩恵・モード（短文） */
  benefit: TextValue;
}

export interface CeilingRules {
  normal: NumValue;
  /** 「朝一天井」 リセット時の天井。仕組みが無ければ status: 'na' */
  morning: NumValue;
  /** CZ天井（CZの仕組みが無い機種は省略） */
  cz?: NumValue;
  /** 朝一CZ天井（リセット時のCZ天井） */
  czMorning?: NumValue;
  /** 天井到達時の恩恵（短文） */
  benefit?: TextValue;
}

export interface Detection extends Sourced {
  label: string;
  method: string;
  certainty: Certainty;
}

/** 朝イチ・リセット（F） */
export interface MorningRules {
  entry: EntryRule | null;
  resetBenefit: TextValue;
  /** 宵越し条件 */
  carryOver: TextValue;
  /** ガックン判別 */
  gakkun: Detection;
  /** ステージ・液晶の初期状態 */
  initialState: Detection | null;
  /** ランプ・ポイント・モード等の判別方法 */
  otherDetections: Detection[];
  /** 店舗側の対策による判別の限界 */
  limits: TextValue;
}

/** 有利区間（G）。規定上の基準と機種固有の切断条件は別物として持つ */
export interface CutCondition extends Sourced {
  id: string;
  /** 差枚と獲得枚数を混同しないため種類を明示 */
  kind: '差枚' | '獲得枚数' | 'G数' | 'その他';
  value: number | null;
  unit: Unit;
  label: string;
}

export interface AdvantageousSectionRules {
  /** 1. 差枚に関する規定上の基準（機種の切断条件ではない） */
  regulatoryNetBaseline: NumValue;
  /** 2–3. 機種固有の切断条件（複数可）。仕組みが無ければ空配列 + mechanism='none' */
  cutConditions: CutCondition[];
  /** 'none' = 該当する仕組みなし */
  mechanism: 'exists' | 'none' | 'unknown';
  /** 4. 切断恩恵 */
  benefit: TextValue;
  /** 5. 切断判別方法 */
  detection: TextValue;
}

export interface MachineImage {
  /** public/machines/ 以下のパス。null なら代替表示 */
  src: string | null;
  /** 画像の出典 */
  credit: string | null;
  /** 利用許諾の状態 */
  license: '未確認' | '許諾済み' | '自作' | 'メーカー提供';
}

export type LinkKind = 'settei' | 'reset' | 'advantage';

/** 外部攻略リンク。該当記事URLが無ければ url: null（未登録） */
export interface ExternalLink {
  kind: LinkKind;
  site: string | null;
  url: string | null;
  referencedAt?: string;
}

export interface Machine {
  /** 正式名称・型式・バージョンを区別する一意ID */
  machineId: string;
  officialName: string;
  /** 一覧で使う短い名前 */
  shortName: string;
  /** 型式名（不明なら null） */
  modelCode: string | null;
  version: string;
  aliases: string[];
  machineType: MachineType;
  manufacturer: string | null;
  image: MachineImage;
  /** 代替表示用の色相 (0-360) */
  hue: number;
  /** 当たりまでを数える単位の既定値。狙い目ルールに単位があればそちらを優先 */
  counterUnit: Unit;
  entryRules: EntryRule[];
  ceilingRules: CeilingRules;
  quitRules: QuitRule[];
  precursorRules: PrecursorRule | null;
  zoneRules: ZoneRule[];
  skipRules: SkipRules | null;
  /** AT駆け抜け時の恩恵。情報が無い機種は null（画面に出さない） */
  kakenukeRules: KakenukeRule | null;
  morningRules: MorningRules;
  advantageousSectionRules: AdvantageousSectionRules;
  sourceLinks: ExternalLink[];
  verifiedAt: string | null;
  verificationStatus: VerificationStatus;
}

/* ---------- 店舗（N. 構造のみ） ---------- */

export interface Store {
  storeId: string;
  name: string;
  area: string | null;
  updatedAt: string;
}

export interface StoreInstallation {
  storeId: string;
  machineId: string;
  /** 設置台数 */
  count: number | null;
  /** 台番号 */
  unitNumbers: string[];
  updatedAt: string;
}

/* ---------- 期待値ランキング（空き台の登録） ---------- */

export type ResetState = 'リセット' | '据え置き' | '不明';

export interface SlotEntry {
  id: string;
  machineId: string;
  /** 天井側の現在値（AT・ボーナス間のG数など） */
  current: number;
  unit: Unit;
  /** CZ側の現在値（CZ間の液晶G数など）。CZの仕組みが無い機種・不明なら null */
  czCurrent: number | null;
  skipCount: number | null;
  resetState: ResetState;
  storeName: string | null;
  unitNumber: string | null;
  /** 期待値（円）。根拠がなければ null = 未算出 */
  ev: number | null;
  evCondition: EvCondition | null;
  /** 消化見込み時間（分）。時給換算に使う */
  estimatedMinutes: number | null;
  /** STEP1 のサンプル行 */
  isSample: boolean;
}
