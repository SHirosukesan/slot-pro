import type { Machine } from '../../types/machine';
import { tokyoGhoul } from './tokyoGhoul';
import { monkeyTurnV } from './monkeyTurnV';
import { hokuto } from './hokuto';
import { karakuri } from './karakuri';
import { valvrave } from './valvrave';

/** 機種マスター。機種を追加するときはファイルを作ってここに1行足す（docs/ADD_MACHINE.md） */
export const MACHINES: Machine[] = [tokyoGhoul, monkeyTurnV, hokuto, karakuri, valvrave];

export const machineById = (id: string): Machine | undefined => MACHINES.find((m) => m.machineId === id);
