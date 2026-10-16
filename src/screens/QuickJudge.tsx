import { useMemo, useState } from 'react';
import { Pencil, Search, Settings, Star, Target } from 'lucide-react';
import type { AimType, Machine, ResetState } from '../types/machine';
import { MACHINES } from '../data/machines';
import { searchMachines } from '../lib/search';
import { counterKey, distanceTo, hasAim, judge, pickCeiling } from '../lib/judge';
import { fmtEvRange, fmtNum, fmtRange, missingText, numText } from '../lib/format';
import { LIST_ITEMS } from '../config/ui';
import type { AppState } from '../state/useAppState';
import { Logo, NumberSheet, Segmented, StatePill, Thumb, stateText } from '../components/ui';

type Mode = '狙い目' | '朝イチ' | '期待値順';
const RESETS: readonly ResetState[] = ['リセット', '据え置き', '不明'];
const AIMS: readonly AimType[] = ['天井', 'CZ'];
const AIM_LABEL: Record<AimType, string> = { 天井: '天井', CZ: 'CZ天井' };

export function QuickJudge({
  app,
  mode,
  aim,
  onAim,
  onMode,
  onOpen,
  onSettings,
}: {
  app: AppState;
  mode: '狙い目' | '朝イチ';
  aim: AimType;
  onAim: (a: AimType) => void;
  onMode: (m: Mode) => void;
  onOpen: (id: string) => void;
  onSettings: () => void;
}) {
  const [query, setQuery] = useState('');
  const [favOnly, setFavOnly] = useState(false);
  const [editing, setEditing] = useState<{ m: Machine; key: string } | null>(null);
  const morning = mode === '朝イチ';

  const list = useMemo(() => {
    const hits = searchMachines(MACHINES, query).filter((m) => (!favOnly || app.favorites.includes(m.machineId)) && hasAim(m, aim));
    // お気に入りを上に
    return [...hits].sort((a, b) => Number(app.favorites.includes(b.machineId)) - Number(app.favorites.includes(a.machineId)));
  }, [query, favOnly, app.favorites, aim]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between pt-2">
        <Logo />
        <button onClick={onSettings} aria-label="設定" className="size-11 grid place-items-center rounded-full text-sub hover:text-fg">
          <Settings size={26} />
        </button>
      </header>

      <div>
        <h1 className="text-[30px] font-black leading-tight tracking-tight">クイック判定</h1>
        <p className="text-sub text-[14px] mt-1">今の状況で狙える台を素早くチェック</p>
      </div>

      <Segmented<Mode> label="表示モード" value={mode} options={['狙い目', '朝イチ', '期待値順']} onChange={onMode} />

      {/* 天井狙い / CZ狙い の切り替え */}
      <div className="flex items-center gap-3 -mt-1">
        <span className="text-[13px] text-sub shrink-0">狙う対象</span>
        <div className="flex-1">
          <Segmented<AimType> size="sm" label="狙う対象" value={aim} options={AIMS} onChange={onAim} />
        </div>
      </div>

      <div className="flex gap-2">
        <label className="card flex-1 flex items-center gap-2 px-3.5 h-12 min-w-0">
          <Search size={20} className="text-dim shrink-0" aria-hidden />
          <input
            id="machine-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="機種名で検索"
            aria-label="機種名で検索"
            className="w-full bg-transparent text-[16px] outline-none placeholder:text-dim"
          />
        </label>
        <button
          onClick={() => setFavOnly((v) => !v)}
          aria-pressed={favOnly}
          aria-label="お気に入りだけ表示"
          className={`card size-12 grid place-items-center shrink-0 ${favOnly ? 'text-gold border-gold/60' : 'text-dim'}`}
        >
          <Star size={20} fill={favOnly ? 'currentColor' : 'none'} />
        </button>
      </div>

      {list.length === 0 && (
        <p className="card p-6 text-center text-sub">
          {favOnly ? 'お気に入りの機種がありません。詳細画面の ♡ で登録できます。' : `「${query}」に一致する機種がありません。`}
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {list.map((m) => {
          const reset = app.resets[m.machineId] ?? '不明';
          const key = counterKey(m.machineId, aim, morning);
          const cur = app.counters[key] ?? null;
          const j = judge(m, cur, morning, reset, aim);
          const fav = app.favorites.includes(m.machineId);
          const ceil = j.ceiling?.value ?? null;
          const showCeiling = j.state === 'prio' && ceil != null;
          const ceilName = `${j.morningApplied ? '朝一' : ''}${AIM_LABEL[aim]}`;
          const aimName = `${j.morningApplied ? '朝イチ' : ''}${aim === 'CZ' ? 'CZ' : ''}狙い目`;
          return (
            <li key={m.machineId} className="card overflow-hidden">
              <div className="flex gap-3 p-card">
                <button onClick={() => onOpen(m.machineId)} aria-label={`${m.shortName}の詳細`} className="flex shrink-0 self-stretch rounded-[14px]">
                  <Thumb m={m} height="100%" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <button onClick={() => onOpen(m.machineId)} className="text-left min-w-0 flex items-center gap-1.5">
                      <span className={`${m.shortName.length > 6 ? 'text-[16px]' : 'text-[18px]'} font-bold leading-tight line-clamp-2`}>{m.shortName}</span>
                      {fav && <Star size={14} className="text-gold shrink-0" fill="currentColor" aria-label="お気に入り" />}
                    </button>
                    <StatePill state={j.state} label={j.label} />
                  </div>

                  <button
                    onClick={() => setEditing({ m, key })}
                    className="group flex items-baseline gap-1 mt-0.5"
                    aria-label={`${m.shortName}の現在${aim === 'CZ' && !morning ? 'CZ' : ''}${m.counterUnit}数を入力`}
                  >
                    <span className={`num font-extrabold leading-none ${cur == null ? 'text-dim' : stateText(j.state)}`} style={{ fontSize: 'var(--fs-big)' }}>
                      {cur == null ? '---' : fmtNum(cur)}
                    </span>
                    <span className={`num text-[22px] font-bold ${cur == null ? 'text-dim' : stateText(j.state)}`}>{m.counterUnit}</span>
                    <Pencil size={15} className="ml-1 text-dim group-hover:text-sub self-center" aria-hidden />
                  </button>

                  <div className="mt-1.5 flex flex-col gap-0.5 text-[14px]">
                    {LIST_ITEMS.aim && (
                      <div className="flex items-center gap-1.5">
                        <Target size={16} className={showCeiling ? 'text-prio' : 'text-prio/80'} aria-hidden />
                        {showCeiling ? (
                          <span className="font-bold text-prio">
                            {ceilName} <span className="num">{fmtNum(ceil)}{j.ceiling?.unit}</span>
                          </span>
                        ) : (
                          <span className="text-fg/90">
                            {aimName}{' '}
                            <span className="num font-bold">
                              {j.rule?.minLine != null ? `${fmtNum(j.rule.minLine)}${j.rule.unit}〜` : '未確認'}
                            </span>
                          </span>
                        )}
                      </div>
                    )}
                    {LIST_ITEMS.range && (
                      <div className="text-sub">
                        推奨範囲{' '}
                        <span className="num font-bold text-go">
                          {(j.rule?.recommended && fmtRange(j.rule.recommended.min, j.rule.recommended.max, j.rule.unit)) ?? '未確認'}
                        </span>
                      </div>
                    )}
                    {LIST_ITEMS.ev && (
                      <div className="text-sub">
                        期待値 <span className="num font-bold text-go/90">{fmtEvRange(j.rule?.ev ?? null)}</span>
                      </div>
                    )}
                    {j.distance != null && (
                      <div className="text-sub">
                        {ceilName}まで{' '}
                        <span className={`num font-bold ${j.distance === 0 ? 'text-prio' : 'text-fg'}`}>
                          {j.distance === 0 ? '到達' : `あと${fmtNum(j.distance)}${j.ceiling?.unit ?? ''}`}
                        </span>
                      </div>
                    )}
                    {LIST_ITEMS.ceiling && (
                      <div className="text-sub">
                        天井 {numText(m.ceilingRules.normal)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {morning && (
                <div className="border-t border-line px-card py-2.5 flex items-center gap-3">
                  <span className="text-[13px] text-sub shrink-0">状態</span>
                  <div className="flex-1">
                    <Segmented<ResetState> size="sm" label={`${m.shortName}のリセット状態`} value={reset} options={RESETS} onChange={(r) => app.setReset(m.machineId, r)} />
                  </div>
                </div>
              )}
              {morning && (
                <div className="px-card pb-2.5 -mt-0.5 text-[12px] text-sub flex flex-wrap gap-x-3">
                  {reset === '据え置き' ? (
                    <span>
                      宵越し <b className="text-fg/90">{m.morningRules.carryOver.text ?? missingText(m.morningRules.carryOver.status)}</b>
                    </span>
                  ) : (
                    <>
                      <span>
                        朝一天井 <b className="num text-near">{numText(m.ceilingRules.morning)}</b>
                      </span>
                      {m.ceilingRules.cz && <MorningCz m={m} reset={reset} current={app.counters[m.machineId] ?? null} />}
                      <span>
                        リセット恩恵 <b className="text-fg/90">{m.morningRules.resetBenefit.text ?? missingText(m.morningRules.resetBenefit.status)}</b>
                      </span>
                    </>
                  )}
                  {reset === '不明' && <span className="text-dim">※リセット時のみ朝イチ狙い目で判定</span>}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[13px] text-sub pb-1">
        <Legend cls="bg-go" label="打てる" />
        <Legend cls="bg-near" label="あと少し" />
        <Legend cls="bg-prio" label="優先" />
        <Legend cls="bg-skip" label="見送り" />
      </div>

      <NumberSheet
        open={editing != null}
        onClose={() => setEditing(null)}
        title={editing ? `${editing.m.shortName} 現在の${editing.key.endsWith('#cz') ? 'CZ' : ''}${editing.m.counterUnit}数` : ''}
        unit={editing?.m.counterUnit ?? 'G'}
        value={editing ? (app.counters[editing.key] ?? null) : null}
        onSave={(v) => editing && app.setCounter(editing.key, v)}
      />
    </div>
  );
}

/** 朝イチ：CZまでの距離（リセットなら朝一CZ天井、それ以外は通常のCZ天井） */
function MorningCz({ m, reset, current }: { m: Machine; reset: ResetState; current: number | null }) {
  const morningApplied = reset === 'リセット';
  const c = pickCeiling(m, 'CZ', morningApplied);
  const d = distanceTo(c, current);
  const name = morningApplied && c === m.ceilingRules.czMorning ? '朝一CZ天井' : 'CZ天井';
  return (
    <span>
      {name} <b className="num text-accent">{c ? numText(c) : '未確認'}</b>
      {d != null && <b className={`num ml-1 ${d === 0 ? 'text-prio' : 'text-fg'}`}>（{d === 0 ? '到達' : `あと${fmtNum(d)}G`}）</b>}
    </span>
  );
}

const Legend = ({ cls, label }: { cls: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className={`size-3 rounded-full ${cls}`} aria-hidden /> = {label}
  </span>
);
