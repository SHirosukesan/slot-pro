import { useCallback, useEffect, useState } from 'react';
import type { EvCondition, ResetState } from '../types/machine';
import { SAMPLE_EV_CONDITION } from '../data/helpers';
import { isNumberRecord, isStringArray, loadJSON, saveJSON } from '../lib/storage';

const isResetRecord = (v: unknown): v is Record<string, ResetState> =>
  typeof v === 'object' && v !== null && !Array.isArray(v) &&
  Object.values(v).every((x) => x === 'リセット' || x === '据え置き' || x === '不明');

const isEvCondition = (v: unknown): v is EvCondition => {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.exchangeRate === 'number' && (o.play === '持ちメダル' || o.play === '現金') &&
    typeof o.quitAssumption === 'string' && typeof o.closingConsidered === 'boolean';
};

const isImageRecord = (v: unknown): v is Record<string, string> =>
  typeof v === 'object' && v !== null && !Array.isArray(v) &&
  Object.values(v).every((x) => typeof x === 'string' && x.startsWith('data:image/'));

const isBoolRecord = (v: unknown): v is Record<string, boolean> =>
  typeof v === 'object' && v !== null && !Array.isArray(v) && Object.values(v).every((x) => typeof x === 'boolean');

/** localStorage と同期する state */
function usePersisted<T>(key: string, fallback: T, guard: (v: unknown) => v is T) {
  const [value, setValue] = useState<T>(() => loadJSON(key, fallback, guard));
  useEffect(() => {
    saveJSON(key, value);
  }, [key, value]);
  return [value, setValue] as const;
}

/** 立ち回りで入力する値（現在G数・お気に入り・リセット状態・区間差枚・基準条件） */
export function useAppState() {
  const [counters, setCounters] = usePersisted<Record<string, number>>('counters', { 'slot.smart.tokyo-ghoul.v1': 680, 'slot.smart.monkey-turn-v.v1': 420, 'slot.smart.hokuto-no-ken.v1': 810 }, isNumberRecord);
  const [favorites, setFavorites] = usePersisted<string[]>('favorites', ['slot.smart.tokyo-ghoul.v1'], isStringArray);
  const [resets, setResets] = usePersisted<Record<string, ResetState>>('resets', {}, isResetRecord);
  const [nets, setNets] = usePersisted<Record<string, number>>('nets', {}, isNumberRecord);
  const [netStartKnown, setNetStartKnown] = usePersisted<Record<string, boolean>>('netStart', {}, isBoolRecord);
  const [evBase, setEvBase] = usePersisted<EvCondition>('evBase', SAMPLE_EV_CONDITION, isEvCondition);

  /** 利用者が設定した機種画像（端末内のみ） */
  const [images, setImages] = usePersisted<Record<string, string>>('images', {}, isImageRecord);
  const setImage = useCallback((id: string, dataUrl: string | null) => {
    setImages((prev) => {
      const next = { ...prev };
      if (dataUrl == null) delete next[id];
      else next[id] = dataUrl;
      return next;
    });
  }, [setImages]);

  const setCounter = useCallback((id: string, v: number | null) => {
    setCounters((prev) => {
      const next = { ...prev };
      if (v == null) delete next[id];
      else next[id] = Math.max(0, Math.round(v));
      return next;
    });
  }, [setCounters]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, [setFavorites]);

  const setReset = useCallback((id: string, r: ResetState) => setResets((p) => ({ ...p, [id]: r })), [setResets]);

  const setNet = useCallback((id: string, v: number | null) => {
    setNets((prev) => {
      const next = { ...prev };
      if (v == null) delete next[id];
      else next[id] = Math.round(v);
      return next;
    });
  }, [setNets]);

  const setStartKnown = useCallback((id: string, b: boolean) => setNetStartKnown((p) => ({ ...p, [id]: b })), [setNetStartKnown]);

  return {
    counters, setCounter,
    favorites, toggleFavorite,
    resets, setReset,
    nets, setNet,
    netStartKnown, setStartKnown,
    evBase, setEvBase,
    images, setImage,
  };
}

export type AppState = ReturnType<typeof useAppState>;
