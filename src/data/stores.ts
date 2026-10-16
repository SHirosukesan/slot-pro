import type { Store, StoreInstallation } from '../types/machine';

/**
 * 店舗データ（STEP1 は構造のみ）。
 * 機種マスター(MACHINES)とは分離し、machineId で紐付ける。
 * 将来: CSV一括登録・店舗ごとのお気に入り・設置台数・台番号。
 */
export const STORES: Store[] = [];
export const INSTALLATIONS: StoreInstallation[] = [];

export const machinesInStore = (storeId: string, installs: StoreInstallation[] = INSTALLATIONS): string[] =>
  installs.filter((i) => i.storeId === storeId).map((i) => i.machineId);
