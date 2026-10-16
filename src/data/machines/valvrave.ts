import type { Machine } from '../../types/machine';
import { SAMPLE_EV_CONDITION as EV, detect, num, sourcedNum, src, text } from '../helpers';

/**
 * 天井（通常・朝一・CZ）とスルー天井は攻略サイト2つで照合した値（2026-10-17）。
 * それ以外（狙い目・期待値・やめどき等）はまだ STEP1 の表示サンプル（架空）。
 */
const CH_vv = src('ちょんぼりすた', 'https://chonborista.com/slot/sankyo-slot/174976/');
const AL_vv = src('アルテマ', 'https://altema.jp/pachimo/valvravetenjo');
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
      aim: '天井',
      condition: '通常',
      unit: 'G',
      minLine: 250,
      recommended: { min: 250, max: 400 },
      ev: { min: 1000, max: 3000, condition: EV },
      status: 'sample',
      sources: [],
    },
    {
      id: 'cz',
      aim: 'CZ',
      condition: '通常',
      unit: '液晶G',
      minLine: 200,
      recommended: { min: 200, max: 300 },
      ev: { min: 800, max: 2000, condition: EV },
      status: 'sample',
      sources: [],
    },
    {
      id: 'cz-morning',
      aim: 'CZ',
      condition: '朝イチ',
      unit: '液晶G',
      minLine: 0,
      recommended: { min: 0, max: 150 },
      ev: { min: 300, max: 900, condition: EV },
      status: 'sample',
      sources: [],
    },
  ],
  ceilingRules: {
    normal: sourcedNum(1500, 'G', [CH_vv, AL_vv], 'AT・ボーナス間の実ゲーム数。恩恵はボーナス（AT確定ではない）。+α'),
    morning: sourcedNum(null, 'G', [CH_vv, AL_vv], 'リセット時の天井短縮なし', 'na'),
    cz: sourcedNum(1000, '液晶G', [CH_vv, AL_vv], '液晶表示のG数。モードで短い。+α'),
    czMorning: sourcedNum(null, '液晶G', [CH_vv, AL_vv], 'リセット時のCZ天井短縮なし', 'na'),
  },
  quitRules: [
    { id: 'after-at', situation: 'AT後', checkCount: 0, unit: 'G', action: '即ヤメ', status: 'sample', sources: [] },
  ],
  precursorRules: null,
  zoneRules: [],
  skipRules: {
    definition: 'AT間のCZ連続失敗回数',
    ceiling: sourcedNum(7, '回', [CH_vv, AL_vv], '7連続失敗で次のCZが成功（ボーナス）'),
    aimFrom: num(4, '回'),
  },
  morningRules: {
    entry: {
      id: 'morning',
      aim: '天井',
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
  // 外部攻略リンク（該当記事・該当見出しへ直接）。1種類に複数サイト可。設定推測の中身はアプリに持たない
  sourceLinks: [
    { kind: 'settei', site: 'ななプレス', url: 'https://nana-press.com/kaiseki/machine/463/12899/', referencedAt: '2026-10-17' },
    { kind: 'settei', site: 'ちょんぼりすた', url: 'https://chonborista.com/slot/sankyo-slot/174976/#index-13', referencedAt: '2026-10-17' },
    { kind: 'settei', site: 'アルテマ', url: 'https://altema.jp/pachimo/kakumeikivalvravesisa', referencedAt: '2026-10-17' },
    { kind: 'reset', site: 'ななプレス', url: 'https://nana-press.com/kaiseki/machine/463/12539/', referencedAt: '2026-10-17' },
    { kind: 'reset', site: 'ちょんぼりすた', url: 'https://chonborista.com/slot/sankyo-slot/174976/#index-11', referencedAt: '2026-10-17' },
    { kind: 'reset', site: 'アルテマ', url: 'https://altema.jp/pachimo/valvravereset', referencedAt: '2026-10-17' },
    { kind: 'advantage', site: 'ななプレス', url: 'https://nana-press.com/kaiseki/machine/463/25459/', referencedAt: '2026-10-17' },
    { kind: 'advantage', site: 'ちょんぼりすた', url: 'https://chonborista.com/slot/sankyo-slot/174976/#index-12', referencedAt: '2026-10-17' },
    { kind: 'advantage', site: 'アルテマ', url: 'https://altema.jp/pachimo/kakumeikivalvraveyuurikukan', referencedAt: '2026-10-17' },
  ],
  verifiedAt: null,
  verificationStatus: 'sample',
};
