/**
 * localStorage の安全な読み書き。
 * 破損データ・プライベートブラウズ・容量超過でもアプリが止まらないようにする。
 */
const PREFIX = 'slotpro:v1:';

export const loadJSON = <T>(key: string, fallback: T, isValid: (v: unknown) => v is T): T => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export const saveJSON = (key: string, value: unknown): boolean => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const clearAll = (): void => {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* 何もしない */
  }
};

export const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');
export const isNumberRecord = (v: unknown): v is Record<string, number> =>
  typeof v === 'object' && v !== null && !Array.isArray(v) && Object.values(v).every((x) => typeof x === 'number' && Number.isFinite(x));
