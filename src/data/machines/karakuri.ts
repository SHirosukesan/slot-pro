import type { Machine } from '../../types/machine';
import { SAMPLE_EV_CONDITION as EV, detect, naText, num, text } from '../helpers';

/** ※数値はすべて STEP1 の表示サンプル（架空）。実機値ではない */
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
      condition: '通常',
      unit: 'G',
      minLine: 300,
      recommended: { min: 300, max: 450 },
      ev: { min: 1500, max: null, condition: EV },
      status: 'sample',
      sources: [],
    },
  ],
  ceilingRules: {
    normal: num(800, 'G'),
    morning: num(null, 'G', 'na'),
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
  skipRules: null,
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
