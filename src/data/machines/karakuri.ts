import type { Machine } from '../../types/machine';
import { SAMPLE_EV_CONDITION as EV, detect, naText, num, sourcedNum, src, text } from '../helpers';

/**
 * 天井（通常・朝一・CZ）とスルー天井は攻略サイト2つで照合した値（2026-10-17）。
 * それ以外（狙い目・期待値・やめどき等）はまだ STEP1 の表示サンプル（架空）。
 */
const CH_kr = src('ちょんぼりすた', 'https://chonborista.com/slot/sankyo-slot/187795/');
const AL_kr = src('アルテマ', 'https://altema.jp/pachimo/lkarakuritenjo');
export const karakuri: Machine = {
  machineId: 'slot.smart.karakuri-circus.v1',
  officialName: 'Lからくりサーカス',
  shortName: 'からくりサーカス',
  modelCode: null,
  version: '1',
  aliases: ['からくり', 'カラクリ', 'からくりサーカス', 'Lからくり'],
  machineType: 'pachislot',
  manufacturer: null,
  image: { src: null, credit: null, license: '未確認' },
  hue: 150,
  counterUnit: 'G',
  entryRules: [
    {
      id: 'normal',
      aim: '天井',
      condition: '通常',
      unit: 'G',
      minLine: 300,
      recommended: { min: 300, max: 450 },
      ev: { min: 1500, max: null, condition: EV },
      status: 'sample',
      sources: [],
    },
    {
      id: 'cz',
      aim: 'CZ',
      condition: '通常',
      unit: '液晶G',
      minLine: 150,
      recommended: { min: 150, max: 250 },
      ev: null,
      status: 'sample',
      sources: [],
    },
  ],
  ceilingRules: {
    normal: sourcedNum(2500, 'G', [CH_kr, AL_kr], 'AT間の実ゲーム数'),
    morning: sourcedNum(null, 'G', [CH_kr, AL_kr], 'リセット時の天井短縮なし', 'na'),
    cz: sourcedNum(1200, '液晶G', [CH_kr, AL_kr], '液晶表示のG数（ゲーム数加算あり）'),
    czMorning: sourcedNum(null, '液晶G', [CH_kr, AL_kr], 'リセット時のCZ天井短縮なし', 'na'),
  },
  quitRules: [
    { id: 'after-at', situation: 'AT後', checkCount: 50, unit: 'G', action: 'ゾーン抜けまで', status: 'sample', sources: [] },
  ],
  precursorRules: {
    onset: { min: 5, max: 20, unit: 'G' },
    checkCount: 20,
    checkUnit: 'G',
    endCondition: null,
    status: 'sample',
    sources: [],
  },
  zoneRules: [{ id: 'z1', label: 'ゾーン', min: 200, max: 250, unit: 'G', status: 'sample', sources: [] }],
  skipRules: {
    definition: 'AT間のCZ「機械仕掛けの神」の失敗回数（幕間チャンスは数えない）',
    ceiling: sourcedNum(4, '回', [CH_kr, AL_kr], '4スルー後、次のCZでAT。サイトで4回/5回の書き方が食い違うため確認待ち', 'needsReview'),
    aimFrom: num(3, '回'),
  },
  // AT駆け抜けの恩恵：ちょんぼりすたに記載なし（2026-10-17確認）
  kakenukeRules: null,
  morningRules: {
    entry: null,
    resetBenefit: naText(),
    carryOver: text('ステージで示唆'),
    gakkun: detect('ガックン', '電源ON時のリール挙動', '示唆'),
    initialState: detect('液晶', '朝の背景ステージ', '示唆'),
    otherDetections: [],
    limits: text('判別不可の店舗あり'),
  },
  advantageousSectionRules: {
    regulatoryNetBaseline: num(2400, '枚'),
    mechanism: 'none',
    cutConditions: [],
    benefit: naText(),
    detection: naText(),
  },
  // 外部攻略リンク（該当記事・該当見出しへ直接）。1種類に複数サイト可。設定推測の中身はアプリに持たない
  sourceLinks: [
    { kind: 'settei', site: 'ななプレス', url: 'https://nana-press.com/kaiseki/machine/571/15690/', referencedAt: '2026-10-17' },
    { kind: 'settei', site: 'ちょんぼりすた', url: 'https://chonborista.com/slot/sankyo-slot/187795/#index-12', referencedAt: '2026-10-17' },
    { kind: 'settei', site: 'アルテマ', url: 'https://altema.jp/pachimo/lkarakurisettei', referencedAt: '2026-10-17' },
    { kind: 'reset', site: 'ななプレス', url: 'https://nana-press.com/kaiseki/machine/571/15693/', referencedAt: '2026-10-17' },
    { kind: 'reset', site: 'ちょんぼりすた', url: 'https://chonborista.com/slot/sankyo-slot/187795/#index-10', referencedAt: '2026-10-17' },
    { kind: 'reset', site: 'アルテマ', url: 'https://pachimo.altema.jp/lkarakuriasa', referencedAt: '2026-10-17' },
    { kind: 'advantage', site: 'ななプレス', url: 'https://nana-press.com/kaiseki/machine/571/20324/', referencedAt: '2026-10-17' },
    { kind: 'advantage', site: 'ちょんぼりすた', url: 'https://chonborista.com/slot/sankyo-slot/187795/#index-11', referencedAt: '2026-10-17' },
  ],
  verifiedAt: null,
  verificationStatus: 'sample',
};
