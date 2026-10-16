import type { Machine } from '../../types/machine';
import { SAMPLE_EV_CONDITION as EV, detect, num, text } from '../helpers';

/** ※数値はすべて STEP1 の表示サンプル（架空）。実機値ではない */
export const valvrave: Machine = {
  machineId: 'slot.smart.valvrave.v1',
  officialName: 'スマスロ 革命機ヴァルヴレイヴ',
  shortName: 'ヴァルヴレイヴ',
  modelCode: null,
  version: '1',
  aliases: ['ヴァルヴレイヴ', 'バルブレイブ', 'ヴヴヴ', 'ゔぁるゔれいゔ', '革命機'],
  machineType: 'pachislot',
  manufacturer: null,
  image: { src: null, credit: null, license: '未確認' },
  hue: 120,
  counterUnit: 'G',
  entryRules: [
    {
      id: 'normal',
      condition: '通常',
      unit: 'G',
      minLine: 250,
      recommended: { min: 250, max: 400 },
      ev: { min: 1000, max: 3000, condition: EV },
      status: 'sample',
      sources: [],
    },
  ],
  ceilingRules: {
    normal: num(1000, 'G'),
    morning: num(600, 'G'),
  },
  quitRules: [
    { id: 'after-at', situation: 'AT後', checkCount: 0, unit: 'G', action: '即ヤメ', status: 'sample', sources: [] },
  ],
  precursorRules: null,
  zoneRules: [],
  skipRules: {
    definition: 'CZ失敗回数（サンプル定義）',
    ceiling: num(6, '回'),
    aimFrom: num(4, '回'),
  },
  morningRules: {
    entry: {
      id: 'morning',
      condition: '朝イチ',
      unit: 'G',
      minLine: 0,
      recommended: { min: 0, max: 300 },
      ev: { min: 500, max: 1500, condition: EV },
      status: 'sample',
      sources: [],
    },
    resetBenefit: text('天井短縮'),
    carryOver: text('CZ失敗回数は引き継ぎ'),
    gakkun: detect('ガックン', '電源ON時のリール挙動', '示唆'),
    initialState: null,
    otherDetections: [detect('ランプ', '筐体ランプの色', '推測')],
    limits: text('判別不可の店舗あり'),
  },
  advantageousSectionRules: {
    regulatoryNetBaseline: num(2400, '枚'),
    mechanism: 'exists',
    cutConditions: [
      { id: 'get', kind: '獲得枚数', value: 1500, unit: '枚', label: 'AT獲得', status: 'sample', sources: [] },
    ],
    benefit: text('CZ当選'),
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
