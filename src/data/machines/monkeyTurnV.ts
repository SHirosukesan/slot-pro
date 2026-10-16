import type { Machine } from '../../types/machine';
import { SAMPLE_EV_CONDITION as EV, detect, num, sourcedNum, src, text, unverifiedText } from '../helpers';

/**
 * 天井（通常・朝一・CZ）とスルー天井は攻略サイト2つで照合した値（2026-10-17）。
 * それ以外（狙い目・期待値・やめどき等）はまだ STEP1 の表示サンプル（架空）。
 */
const CH_mk = src('ちょんぼりすた', 'https://chonborista.com/slot/yamasa-slot/198173/');
const AL_mk = src('アルテマ', 'https://altema.jp/pachimo/lmonkey');
export const monkeyTurnV: Machine = {
  machineId: 'slot.smart.monkey-turn-v.v1',
  officialName: 'スマスロ モンキーターンV',
  shortName: 'モンキーV',
  modelCode: null,
  version: '1',
  aliases: ['モンキーターン', 'モンキー', 'もんきー', 'モンキーV', 'モンキー5'],
  machineType: 'pachislot',
  manufacturer: null,
  image: { src: null, credit: null, license: '未確認' },
  hue: 214,
  counterUnit: 'G',
  entryRules: [
    {
      id: 'normal',
      aim: '天井',
      condition: '通常',
      unit: 'G',
      minLine: 500,
      recommended: { min: 500, max: 600 },
      ev: { min: 4000, max: 7000, condition: EV },
      status: 'sample',
      sources: [],
    },
  ],
  ceilingRules: {
    normal: sourcedNum(795, 'G', [CH_mk, AL_mk], '+α。ほかに周期天井（最大6周期）あり'),
    morning: sourcedNum(495, 'G', [CH_mk, AL_mk], '設定変更時・青島vs波多野敗北後。周期天井は最大4周期に短縮。+α'),
  },
  quitRules: [
    { id: 'after-at', situation: 'AT後', checkCount: 0, unit: 'G', action: '即ヤメ', status: 'sample', sources: [] },
  ],
  precursorRules: {
    onset: null,
    checkCount: 32,
    checkUnit: 'G',
    endCondition: '前兆ステージ終了まで',
    status: 'sample',
    sources: [],
  },
  zoneRules: [],
  skipRules: {
    definition: '優出モードの失敗回数（優出モード1回＝1周期）',
    ceiling: sourcedNum(5, '回', [CH_mk], '5スルー後、6回目の優出モードでAT。出典1件のため確認待ち'),
    aimFrom: num(3, '回'),
  },
  // AT駆け抜けの恩恵：ちょんぼりすたに記載なし（2026-10-17確認）
  kakenukeRules: null,
  morningRules: {
    entry: null,
    resetBenefit: text('天井短縮'),
    carryOver: unverifiedText(),
    gakkun: detect('ガックン', '電源ON時のリール挙動', '未確認', 'unverified'),
    initialState: null,
    otherDetections: [],
    limits: unverifiedText(),
  },
  advantageousSectionRules: {
    regulatoryNetBaseline: num(2400, '枚'),
    mechanism: 'unknown',
    cutConditions: [],
    benefit: unverifiedText(),
    detection: unverifiedText(),
  },
  // 外部攻略リンク（該当記事・該当見出しへ直接）。1種類に複数サイト可。設定推測の中身はアプリに持たない
  sourceLinks: [
    { kind: 'settei', site: 'ななプレス', url: 'https://nana-press.com/kaiseki/machine/644/18015/', referencedAt: '2026-10-17' },
    { kind: 'settei', site: 'ちょんぼりすた', url: 'https://chonborista.com/slot/yamasa-slot/198173/#index-14', referencedAt: '2026-10-17' },
    { kind: 'settei', site: 'アルテマ', url: 'https://altema.jp/pachimo/lmonkeysisa', referencedAt: '2026-10-17' },
    { kind: 'reset', site: 'ななプレス', url: 'https://nana-press.com/kaiseki/machine/644/18025/', referencedAt: '2026-10-17' },
    { kind: 'reset', site: 'ちょんぼりすた', url: 'https://chonborista.com/slot/yamasa-slot/198173/#index-12', referencedAt: '2026-10-17' },
    { kind: 'reset', site: 'アルテマ', url: 'https://altema.jp/pachimo/lmonkeyasaiti', referencedAt: '2026-10-17' },
    { kind: 'advantage', site: 'ななプレス', url: 'https://nana-press.com/kaiseki/machine/644/18028/', referencedAt: '2026-10-17' },
    { kind: 'advantage', site: 'ちょんぼりすた', url: 'https://chonborista.com/slot/yamasa-slot/198173/#index-13', referencedAt: '2026-10-17' },
    { kind: 'advantage', site: 'アルテマ', url: 'https://altema.jp/pachimo/qa-item/36', referencedAt: '2026-10-17' },
  ],
  verifiedAt: null,
  verificationStatus: 'sample',
};
