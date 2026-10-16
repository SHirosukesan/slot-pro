import { MACHINES } from './machines';
import { dataWarnings, schemaErrors } from '../lib/validate';

describe('機種データの形式検証', () => {
  it.each(MACHINES.map((m) => [m.machineId, m] as const))('%s はスキーマに合格', (_id, m) => {
    expect(schemaErrors(m)).toEqual([]);
  });
  it('machineId は一意', () => {
    const ids = MACHINES.map((m) => m.machineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('初期実装はパチスロのみ', () => {
    expect(MACHINES.every((m) => m.machineType === 'pachislot')).toBe(true);
  });
  it('サンプルデータに誤入力の警告がない', () => {
    expect(MACHINES.flatMap(dataWarnings)).toEqual([]);
  });
  it('スルーの仕組みがある機種は「何の失敗回数か」を定義している', () => {
    for (const m of MACHINES) if (m.skipRules) expect(m.skipRules.definition.length).toBeGreaterThan(0);
  });
  it('外部リンクはサイトのトップページではなく記事URL', () => {
    for (const m of MACHINES)
      for (const l of m.sourceLinks) if (l.url) expect(new URL(l.url).pathname.split('/').filter(Boolean).length).toBeGreaterThan(1);
  });
  it('外部リンク3種（設定推測・リセット判別・有利区間）が独立して登録されている', () => {
    for (const m of MACHINES) expect(m.sourceLinks.map((l) => l.kind).sort()).toEqual(['advantage', 'reset', 'settei']);
  });
});
