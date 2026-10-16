import type { Machine } from '../../types/machine';
import { SAMPLE_EV_CONDITION as EV, detect, num, text } from '../helpers';

/** ※数値はすべて STEP1 の表示サンプル（架空）。実機値ではない */
export const hokuto: Machine = {
  machineId: 'slot.smart.hokuto-no-ken.v1',
  officialName: 'スマスロ 北斗の拳',
  shortName: '北斗',
  modelCode: null,
  version: '1',
  aliases: ['北斗', 'ほくと', '北斗の拳', 'スマスロ北斗'],
  machineType: 'pachislot',
  manufacturer: null,
  image: { src: null, credit: null, license: '未確認' },
  hue: 28,
  counterUnit: 'G',
  entryRules: [
    {
      id: 'normal',
      condition: '通常',
      unit: 'G',
      minLine: 600,
      recommended: { min: 600, max: 800 },
      ev: { min: 3000, max: 9000, condition: EV },
      status: 'sample',
      sources: [],
    },
  ],
  ceilingRules: {
    normal: num(1268, 'G'),
    morning: num(null, 'G', 'unverified'),
    benefit: text('ボーナス当選'),
  },
  quitRules: [
    { id: 'after-bb', situation: 'BB後', checkCount: null, unit: 'G', action: '前兆確認', status: 'unverified', sources: [] },
  ],
  precursorRules: null,
  zoneRules: [],
  skipRules: null,
  morningRules: {
    entry: null,
    resetBenefit: text('なし', 'sample'),
    carryOver: text('天井G数は引き継ぎ'),
    gakkun: detect('ガックン', '電源ON時のリール挙動', '推測'),
    initialState: null,
    otherDetections: [],
    limits: text('判別不可の店舗あり'),
  },
  advantageousSectionRules: {
    regulatoryNetBaseline: num(2400, '枚'),
    mechanism: 'exists',
    cutConditions: [
      { id: 'net', kind: '差枚', value: null, unit: '枚', label: '区間差枚', status: 'unverified', sources: [] },
    ],
    benefit: text('ボーナス期待度アップ'),
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
