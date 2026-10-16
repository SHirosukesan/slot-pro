import type { Machine } from '../types/machine';

/** 全角半角・カタカナひらがな・大文字小文字・空白の違いを吸収 */
export const normalize = (s: string): string =>
  s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/[\s・]/g, '');

export const searchMachines = (machines: Machine[], query: string): Machine[] => {
  const q = normalize(query);
  if (!q) return machines;
  return machines.filter((m) =>
    [m.officialName, m.shortName, ...m.aliases].some((name) => normalize(name).includes(q)),
  );
};
