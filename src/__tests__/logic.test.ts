import { MACHINES, machineById } from '../data/machines';
import { tokyoGhoul } from '../data/machines/tokyoGhoul';
import { searchMachines } from '../lib/search';
import { counterKey, counterName, distanceTo, hasAim, judge } from '../lib/judge';
import { fmtCheckCount, fmtEvRange, fmtRange, numText } from '../lib/format';
import { remainingNet } from '../lib/advantage';
import { rankSlots } from '../lib/ranking';
import { SAMPLE_SLOTS } from '../data/sampleSlots';
import { SAMPLE_EV_CONDITION } from '../data/helpers';
import { dataWarnings, schemaErrors } from '../lib/validate';
import { num } from '../data/helpers';
import type { Machine } from '../types/machine';

const clone = (m: Machine): Machine => structuredClone(m);

describe('機種検索', () => {
  it('正式名称で検索', () => {
    expect(searchMachines(MACHINES, 'スマスロ 北斗の拳').map((m) => m.shortName)).toEqual(['北斗']);
  });
  it('別名・ひらがな・カタカナ・空白の違いを吸収', () => {
    expect(searchMachines(MACHINES, 'もんきー')[0]?.shortName).toBe('モンキーV');
    expect(searchMachines(MACHINES, 'からくり')[0]?.shortName).toBe('からくりサーカス');
    expect(searchMachines(MACHINES, 'バルブレイブ')[0]?.shortName).toBe('ヴァルヴレイヴ');
    expect(searchMachines(MACHINES, ' 喰種 ')[0]?.shortName).toBe('東京喰種');
  });
  it('空文字は全件、該当なしは0件', () => {
    expect(searchMachines(MACHINES, '')).toHaveLength(5);
    expect(searchMachines(MACHINES, 'ジャグラー')).toHaveLength(0);
  });
});

describe('通常天井と朝一天井の区別', () => {
  it('リセット時だけ朝一天井・朝イチ狙い目を使う', () => {
    const r = judge(tokyoGhoul, 100, true, 'リセット');
    expect(r.morningApplied).toBe(true);
    expect(r.ceiling?.value).toBe(650);
    expect(r.state).toBe('go');
  });
  it('朝イチでも不明・据え置きはリセット扱いしない', () => {
    for (const s of ['不明', '据え置き'] as const) {
      const r = judge(tokyoGhoul, 100, true, s);
      expect(r.morningApplied).toBe(false);
      expect(r.ceiling?.value).toBe(999);
      expect(r.state).toBe('skip');
    }
  });
  it('判定区分', () => {
    expect(judge(tokyoGhoul, 600, false, '不明').state).toBe('go');
    expect(judge(tokyoGhoul, 480, false, '不明').state).toBe('near');
    expect(judge(tokyoGhoul, 700, false, '不明').state).toBe('prio');
    expect(judge(tokyoGhoul, 100, false, '不明').state).toBe('skip');
  });
  it('狙い目が未確認なら判定しない', () => {
    const m = clone(tokyoGhoul);
    m.entryRules[0]!.status = 'unverified';
    expect(judge(m, 900, false, '不明').state).toBe('unknown');
  });
});

describe('機種ごとの数え方の単位', () => {
  it('東京喰種は喰、北斗はあべし、それ以外はG', () => {
    expect(judge(tokyoGhoul, 600, false, '不明').unit).toBe('喰');
    expect(judge(machineById('slot.smart.hokuto-no-ken.v1')!, 600, false, '不明').unit).toBe('あべし');
    expect(judge(machineById('slot.smart.valvrave.v1')!, 600, false, '不明').unit).toBe('G');
  });
  it('CZ狙いはCZの単位（東京喰種のCZはG）', () => {
    expect(judge(tokyoGhoul, 100, false, '不明', 'CZ').unit).toBe('G');
  });
  it('呼び名: G→ゲーム数、それ以外は単位そのまま', () => {
    expect(counterName('G')).toBe('ゲーム数');
    expect(counterName('喰')).toBe('喰');
    expect(counterName('あべし')).toBe('あべし');
  });
  it('単位が違う天井とは距離を計算しない', () => {
    expect(distanceTo(num(999, 'G'), 500, 'あべし')).toBeNull();
    expect(distanceTo(num(999, 'あべし'), 500, 'あべし')).toBe(499);
  });
});

describe('天井狙いとCZ狙い', () => {
  it('CZ狙いはCZの狙い目・CZ天井で判定し、残りGを出す', () => {
    const r = judge(tokyoGhoul, 200, false, '不明', 'CZ');
    expect(r.rule?.aim).toBe('CZ');
    expect(r.ceiling?.value).toBe(300);
    expect(r.distance).toBe(100);
    expect(r.state).toBe('go');
  });
  it('朝イチ・リセットのCZ狙いは朝一CZ天井まで', () => {
    const r = judge(tokyoGhoul, 40, true, 'リセット', 'CZ');
    expect(r.ceiling?.value).toBe(150);
    expect(r.distance).toBe(110);
  });
  it('朝一CZ天井が無い機種はリセットでも通常のCZ天井', () => {
    const k = machineById('slot.smart.karakuri-circus.v1')!;
    expect(judge(k, 100, true, 'リセット', 'CZ').ceiling?.value).toBe(300);
  });
  it('CZの仕組みが無い機種はCZ狙いの対象外', () => {
    expect(hasAim(machineById('slot.smart.hokuto-no-ken.v1')!, 'CZ')).toBe(false);
    expect(hasAim(tokyoGhoul, 'CZ')).toBe(true);
  });
  it('天井を超えていたら残り0（到達）', () => {
    expect(judge(tokyoGhoul, 1200, false, '不明', '天井').distance).toBe(0);
  });
  it('天井狙いとCZ狙いはG数を別々に保存、朝イチは共通', () => {
    expect(counterKey('a', '天井', false)).toBe('a');
    expect(counterKey('a', 'CZ', false)).toBe('a#cz');
    expect(counterKey('a', 'CZ', true)).toBe('a');
  });
});

describe('単位と表示', () => {
  it('範囲と単位', () => {
    expect(fmtRange(550, 650, 'G')).toBe('550〜650G');
    expect(fmtRange(100, 100, 'あべし')).toBe('100あべし');
    expect(fmtRange(3, null, '回')).toBe('3回〜');
    expect(fmtRange(null, null, 'pt')).toBeNull();
  });
  it('数値のカンマ区切りと単位', () => {
    expect(numText(num(1268, 'G'))).toBe('1,268G');
    expect(numText(num(null, 'G', 'na'))).toBe('なし');
    expect(numText(num(null, 'G', 'unverified'))).toBe('未確認');
  });
  it('期待値レンジは根拠がなければ未算出', () => {
    expect(fmtEvRange({ min: 6000, max: 10000 })).toBe('¥6,000〜¥10,000');
    expect(fmtEvRange(null)).toBe('未算出');
    expect(fmtEvRange({ min: null, max: null })).toBe('未算出');
  });
});

describe('やめどきのG数表示', () => {
  it('+20G / 0G / 未確認', () => {
    expect(fmtCheckCount(20, 'G')).toBe('+20G');
    expect(fmtCheckCount(0, 'G')).toBe('0G');
    expect(fmtCheckCount(null, 'G')).toBe('未確認');
  });
  it('全機種のやめどきに確認G数の項目がある', () => {
    for (const m of MACHINES) for (const q of m.quitRules) expect('checkCount' in q).toBe(true);
  });
});

describe('スルー天井の有無', () => {
  it('仕組みのない機種は null（画面に出さない）', () => {
    expect(machineById('slot.smart.tokyo-ghoul.v1')?.skipRules).toBeNull();
    expect(machineById('slot.smart.monkey-turn-v.v1')?.skipRules?.ceiling.value).toBe(5);
  });
});

describe('有利区間', () => {
  const adv = tokyoGhoul.advantageousSectionRules;
  it('規定上の基準と機種固有の切断条件は別', () => {
    expect(adv.regulatoryNetBaseline.value).toBe(2400);
    expect(adv.cutConditions[0]?.value).toBe(1000);
  });
  it('機種固有の差枚条件で残り差枚を計算（+2,400では計算しない）', () => {
    expect(remainingNet(adv, 300, true)).toEqual({ kind: 'ok', remaining: 700, target: 1000 });
  });
  it('区間開始点が不明なら計算しない', () => {
    expect(remainingNet(adv, 300, false).kind).toBe('noStart');
  });
  it('切断条件が未確認なら計算しない', () => {
    expect(remainingNet(machineById('slot.smart.hokuto-no-ken.v1')!.advantageousSectionRules, 300, true).kind).toBe('unconfirmed');
    expect(remainingNet(machineById('slot.smart.monkey-turn-v.v1')!.advantageousSectionRules, 300, true).kind).toBe('unconfirmed');
  });
  it('獲得枚数の条件を差枚と混同しない', () => {
    expect(remainingNet(machineById('slot.smart.valvrave.v1')!.advantageousSectionRules, 300, true).kind).toBe('notNet');
  });
  it('仕組みがない機種は「なし」', () => {
    expect(remainingNet(machineById('slot.smart.karakuri-circus.v1')!.advantageousSectionRules, 300, true).kind).toBe('none');
  });
});

describe('期待値ランキング', () => {
  it('期待値の高い順', () => {
    const { ranked } = rankSlots(SAMPLE_SLOTS, SAMPLE_EV_CONDITION);
    expect(ranked.map((r) => r.ev)).toEqual([2300, 1800, 600, 400, 300, -1200]);
  });
  it('計算条件が違う行と未算出の行は順位外', () => {
    const { excluded } = rankSlots(SAMPLE_SLOTS, SAMPLE_EV_CONDITION);
    expect(excluded.map((e) => [e.slot.id, e.reason])).toEqual([
      ['s6', '条件不一致'],
      ['s7', '未算出'],
    ]);
  });
  it('時給順', () => {
    const { ranked, sortedBy } = rankSlots(SAMPLE_SLOTS, SAMPLE_EV_CONDITION, 'hourly');
    expect(sortedBy).toBe('hourly');
    expect(ranked[0]?.hourly).toBe(3450);
  });
  it('消化時間が欠けていれば時給順にしない', () => {
    const slots = SAMPLE_SLOTS.map((s) => (s.id === 's1' ? { ...s, estimatedMinutes: null } : s));
    expect(rankSlots(slots, SAMPLE_EV_CONDITION, 'hourly').sortedBy).toBe('ev');
  });
  it('基準を現金にすると現金の行だけが順位対象', () => {
    const { ranked } = rankSlots(SAMPLE_SLOTS, { ...SAMPLE_EV_CONDITION, play: '現金' });
    expect(ranked.map((r) => r.id)).toEqual(['s6']);
  });
});

describe('データ検証', () => {
  it('9999G のような値は警告するが書き換えない', () => {
    const m = clone(machineById('slot.smart.valvrave.v1')!);
    m.ceilingRules.normal.value = 9999;
    expect(dataWarnings(m).some((w) => w.field === 'ceilingRules.normal')).toBe(true);
    expect(m.ceilingRules.normal.value).toBe(9999);
  });
  it('不正な形式はスキーマエラー', () => {
    const bad = { ...clone(tokyoGhoul), machineType: 'slot' };
    expect(schemaErrors(bad).length).toBeGreaterThan(0);
  });
  it('確認済みなのに出典が足りないと警告', () => {
    const m = clone(tokyoGhoul);
    m.ceilingRules.normal.status = 'verified';
    expect(dataWarnings(m).some((w) => w.message.includes('出典'))).toBe(true);
  });
  it('出典URLにトップページ以外の形式不正URLは不可', () => {
    const m = clone(tokyoGhoul);
    m.sourceLinks[0] = { kind: 'settei', site: 'x', url: 'not-a-url' };
    expect(schemaErrors(m).length).toBeGreaterThan(0);
  });
});
