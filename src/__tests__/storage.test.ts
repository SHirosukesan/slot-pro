import { isNumberRecord, isStringArray, loadJSON, saveJSON } from '../lib/storage';

describe('localStorage 保存と復元', () => {
  beforeEach(() => localStorage.clear());
  it('保存した値を復元', () => {
    saveJSON('counters', { a: 680 });
    expect(loadJSON('counters', {}, isNumberRecord)).toEqual({ a: 680 });
  });
  it('壊れたJSONは初期値に戻す', () => {
    localStorage.setItem('slotpro:v1:favorites', '{broken');
    expect(loadJSON('favorites', ['x'], isStringArray)).toEqual(['x']);
  });
  it('型の違うデータは初期値に戻す', () => {
    localStorage.setItem('slotpro:v1:counters', JSON.stringify({ a: 'abc' }));
    expect(loadJSON('counters', {}, isNumberRecord)).toEqual({});
  });
  it('localStorage が使えなくても落ちない', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(loadJSON('x', 1, (v): v is number => typeof v === 'number')).toBe(1);
    spy.mockRestore();
  });
});
