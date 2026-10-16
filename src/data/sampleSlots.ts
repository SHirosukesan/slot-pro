import type { SlotEntry } from '../types/machine';
import { SAMPLE_EV_CONDITION } from './helpers';

/** 期待値ランキングの表示サンプル（架空）。実際の空き台・期待値ではない */
export const SAMPLE_SLOTS: SlotEntry[] = [
  { id: 's1', machineId: 'slot.smart.tokyo-ghoul.v1', current: 680, unit: 'G', czCurrent: 420, skipCount: null, resetState: '据え置き', storeName: 'サンプル店', unitNumber: '1024', ev: 2300, evCondition: SAMPLE_EV_CONDITION, estimatedMinutes: 40, isSample: true },
  { id: 's2', machineId: 'slot.smart.hokuto-no-ken.v1', current: 810, unit: 'G', czCurrent: null, skipCount: null, resetState: '不明', storeName: 'サンプル店', unitNumber: '2051', ev: 1800, evCondition: SAMPLE_EV_CONDITION, estimatedMinutes: 45, isSample: true },
  { id: 's3', machineId: 'slot.smart.monkey-turn-v.v1', current: 420, unit: 'G', czCurrent: null, skipCount: 3, resetState: '据え置き', storeName: 'サンプル店', unitNumber: '0815', ev: 600, evCondition: SAMPLE_EV_CONDITION, estimatedMinutes: 25, isSample: true },
  { id: 's4', machineId: 'slot.smart.karakuri-circus.v1', current: 310, unit: 'G', czCurrent: 900, skipCount: null, resetState: '不明', storeName: null, unitNumber: null, ev: 400, evCondition: SAMPLE_EV_CONDITION, estimatedMinutes: 30, isSample: true },
  { id: 's5', machineId: 'slot.smart.valvrave.v1', current: 260, unit: 'G', czCurrent: 820, skipCount: 4, resetState: 'リセット', storeName: null, unitNumber: null, ev: 300, evCondition: SAMPLE_EV_CONDITION, estimatedMinutes: 20, isSample: true },
  { id: 's8', machineId: 'slot.smart.karakuri-circus.v1', current: 80, unit: 'G', czCurrent: 100, skipCount: null, resetState: '据え置き', storeName: null, unitNumber: null, ev: -1200, evCondition: SAMPLE_EV_CONDITION, estimatedMinutes: 60, isSample: true },
  // 計算条件が違う行（現金投資）→ 同条件と混ぜて順位付けしない
  { id: 's6', machineId: 'slot.smart.valvrave.v1', current: 350, unit: 'G', czCurrent: 500, skipCount: 2, resetState: '据え置き', storeName: null, unitNumber: null, ev: 900, evCondition: { ...SAMPLE_EV_CONDITION, play: '現金' }, estimatedMinutes: 30, isSample: true },
  // 期待値の根拠なし → 未算出
  { id: 's7', machineId: 'slot.smart.hokuto-no-ken.v1', current: 120, unit: 'G', czCurrent: null, skipCount: null, resetState: '不明', storeName: null, unitNumber: null, ev: null, evCondition: null, estimatedMinutes: null, isSample: true },
];
