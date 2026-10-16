import type { Machine } from '../../types/machine';
import { SAMPLE_EV_CONDITION as EV, detect, num, text, unverifiedText } from '../helpers';

/** ※数値はすべて STEP1 の表示サンプル（架空）。実機値ではない */
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
    normal: num(795, 'G'),
    morning: num(495, 'G'),
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
    definition: 'CZ失敗回数（サンプル定義）',
    ceiling: num(5, '回'),
    aimFrom: num(3, '回'),
  },
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
  sourceLinks: [
    { kind: 'settei', site: null, url: null },
    { kind: 'reset', site: null, url: null },
    { kind: 'advantage', site: null, url: null },
  ],
  verifiedAt: null,
  verificationStatus: 'sample',
};
