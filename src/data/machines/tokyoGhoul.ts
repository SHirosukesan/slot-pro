import type { Machine } from '../../types/machine';
import { SAMPLE_EV_CONDITION as EV, detect, num, text } from '../helpers';

/** ※数値はすべて STEP1 の表示サンプル（架空）。実機値ではない */
export const tokyoGhoul: Machine = {
  machineId: 'slot.smart.tokyo-ghoul.v1',
  officialName: 'スマスロ 東京喰種',
  shortName: '東京喰種',
  modelCode: null,
  version: '1',
  aliases: ['東京喰種', 'とうきょうぐーる', 'グール', '喰種', 'L東京喰種'],
  machineType: 'pachislot',
  manufacturer: null,
  image: { src: null, credit: null, license: '未確認' },
  hue: 352,
  counterUnit: 'G',
  entryRules: [
    {
      id: 'normal',
      condition: '通常',
      unit: 'G',
      minLine: 550,
      recommended: { min: 550, max: 650 },
      ev: { min: 6000, max: 10000, condition: EV },
      target: '液晶G数',
      status: 'sample',
      sources: [],
    },
  ],
  ceilingRules: {
    normal: num(999, 'G'),
    morning: num(650, 'G'),
    benefit: text('AT当選'),
  },
  quitRules: [
    { id: 'after-at', situation: 'AT後', checkCount: 20, unit: 'G', action: '前兆なければヤメ', status: 'sample', sources: [] },
  ],
  precursorRules: {
    onset: { min: 100, max: 250, unit: 'G' },
    checkCount: 20,
    checkUnit: 'G',
    endCondition: 'ざわついたら前兆終了まで',
    status: 'sample',
    sources: [],
  },
  zoneRules: [
    { id: 'z1', label: 'ざわつき', min: 100, max: 100, unit: 'G', status: 'sample', sources: [] },
    { id: 'z2', label: 'ざわつき', min: 250, max: 250, unit: 'G', status: 'sample', sources: [] },
  ],
  skipRules: null,
  morningRules: {
    entry: {
      id: 'morning',
      condition: '朝イチ',
      unit: 'G',
      minLine: 0,
      recommended: { min: 0, max: 200 },
      ev: null,
      status: 'sample',
      sources: [],
    },
    resetBenefit: text('天井短縮'),
    carryOver: text('前兆中のヤメは宵越し'),
    gakkun: detect('ガックン', '電源ON時のリール挙動', '示唆'),
    initialState: detect('液晶', '朝の背景ステージ', '推測'),
    otherDetections: [],
    limits: text('店舗の対策で判別不可の場合あり'),
  },
  advantageousSectionRules: {
    regulatoryNetBaseline: num(2400, '枚'),
    mechanism: 'exists',
    cutConditions: [
      { id: 'net', kind: '差枚', value: 1000, unit: '枚', label: '区間差枚', status: 'sample', sources: [] },
    ],
    benefit: text('上位AT'),
    detection: text('液晶の示唆'),
  },
  sourceLinks: [
    { kind: 'settei', site: null, url: null },
    { kind: 'reset', site: null, url: null },
    { kind: 'advantage', site: null, url: null },
  ],
  verifiedAt: null,
  verificationStatus: 'sample',
};
