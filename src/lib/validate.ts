import type { Machine } from '../types/machine';
import { machineSchema } from '../data/schema';

export interface DataWarning {
  machineId: string;
  field: string;
  message: string;
}

/** 形式エラー（CIで失敗させる） */
export const schemaErrors = (m: unknown): string[] => {
  const r = machineSchema.safeParse(m);
  return r.success ? [] : r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
};

/**
 * 誤入力が疑われる値の警告。値を書き換えることはしない（確認を促すだけ）。
 */
export const dataWarnings = (m: Machine): DataWarning[] => {
  const w: DataWarning[] = [];
  const add = (field: string, message: string) => w.push({ machineId: m.machineId, field, message });
  const normal = m.ceilingRules.normal.value;
  const morning = m.ceilingRules.morning.value;

  // 実機には 2,500G 天井（からくりサーカスのAT間）もあるので、桁違いを疑うのは 3,000G 以上
  if (normal != null && m.ceilingRules.normal.unit === 'G' && normal >= 3000) add('ceilingRules.normal', `通常天井 ${normal}G は桁の誤入力の可能性`);
  if (normal != null && morning != null && morning > normal) add('ceilingRules.morning', '朝一天井が通常天井より深い');
  for (const r of [...m.entryRules, ...(m.morningRules.entry ? [m.morningRules.entry] : [])]) {
    if (r.minLine != null && normal != null && r.unit === m.ceilingRules.normal.unit && r.minLine > normal) add(`entry.${r.id}`, '狙い目が天井より深い');
    if (r.recommended?.min != null && r.minLine != null && r.recommended.min < r.minLine) add(`entry.${r.id}`, '推奨範囲が最低ラインより浅い');
    if (r.ev?.min != null && r.ev.max != null && r.ev.min > r.ev.max) add(`entry.${r.id}.ev`, '期待値の最小と最大が逆');
  }
  const all = [m.ceilingRules.normal, m.ceilingRules.morning, ...m.entryRules, ...m.quitRules, ...m.advantageousSectionRules.cutConditions];
  for (const v of all) {
    if (v.status === 'verified' && v.sources.length < 2) w.push({ machineId: m.machineId, field: 'status', message: '確認済みなのに出典が2件未満' });
    if (v.status === 'single' && v.sources.length < 1) w.push({ machineId: m.machineId, field: 'status', message: '単一ソースなのに出典がない' });
  }
  return w;
};
