import { useState } from 'react';
import { ChevronRight, Crown, Info, Settings } from 'lucide-react';
import { machineById } from '../data/machines';
import { SAMPLE_SLOTS } from '../data/sampleSlots';
import { rankSlots, type Excluded, type RankedSlot } from '../lib/ranking';
import { fmtNum, fmtYen } from '../lib/format';
import type { AppState } from '../state/useAppState';
import { Logo, Segmented, Thumb } from '../components/ui';

const CROWN = ['text-gold', 'text-[#c9ccd8]', 'text-[#d79a5c]'];

export function Ranking({ app, onOpen, onSettings }: { app: AppState; onOpen: (id: string) => void; onSettings: () => void }) {
  const [sortBy, setSortBy] = useState<'期待値' | '時給'>('期待値');
  const [showInfo, setShowInfo] = useState(false);
  const { ranked, excluded, hourlyAvailable, sortedBy } = rankSlots(SAMPLE_SLOTS, app.evBase, sortBy === '時給' ? 'hourly' : 'ev');

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between pt-2">
        <Logo />
        <button onClick={onSettings} aria-label="設定" className="size-11 grid place-items-center rounded-full text-sub hover:text-fg">
          <Settings size={26} />
        </button>
      </header>

      <div className="flex items-end justify-between gap-2">
        <h1 className="flex items-center gap-2 text-[30px] font-black leading-tight">
          <Crown size={34} className="text-gold" fill="currentColor" aria-hidden />
          期待値順
        </h1>
        <button onClick={() => setShowInfo((v) => !v)} className="flex items-center gap-1 text-[12px] text-sub pb-1" aria-expanded={showInfo}>
          条件不足の台は順位外 <Info size={15} />
        </button>
      </div>

      {showInfo && (
        <p className="card p-3 text-[13px] text-sub leading-relaxed">
          期待値は同じ計算条件の台だけを比べます。交換率・持ちメダル/現金・やめどき前提が違う台と、根拠のない台は下の「順位外」に分けます。
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 text-[12px]">
        <span className="rounded-pill bg-accent-soft text-accent px-3 py-1 font-bold whitespace-nowrap">
          {app.evBase.exchangeRate}枚・{app.evBase.play}
        </span>
        <span className="rounded-pill bg-white/10 text-sub px-3 py-1 font-bold whitespace-nowrap">表示サンプル</span>
        <div className="ml-auto w-[136px]">
          <Segmented<'期待値' | '時給'> size="sm" label="並び順" value={hourlyAvailable ? sortBy : '期待値'} options={['期待値', '時給']} onChange={setSortBy} />
        </div>
      </div>

      <ol className="flex flex-col gap-2.5">
        {ranked.map((s, i) => (
          <RankRow key={s.id} s={s} rank={i + 1} showHourly={sortedBy === 'hourly'} onOpen={onOpen} />
        ))}
      </ol>

      {excluded.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-[14px] font-bold text-sub mt-1">順位外</h2>
          {excluded.map((e) => (
            <ExcludedRow key={e.slot.id} e={e} onOpen={onOpen} />
          ))}
        </section>
      )}

      <p className="text-[12px] text-dim">台・期待値はすべて架空のサンプルです。STEP 4 で空き台の登録と期待値データ連携を実装します。</p>
    </div>
  );
}

function RankRow({ s, rank, showHourly, onOpen }: { s: RankedSlot; rank: number; showHourly: boolean; onOpen: (id: string) => void }) {
  const m = machineById(s.machineId);
  if (!m) return null;
  const top = rank <= 3;
  return (
    <li>
      <button onClick={() => onOpen(m.machineId)} className="card w-full flex items-center gap-3 p-3 text-left hover:border-accent/50">
        <div className="w-9 shrink-0 flex flex-col items-center">
          {top && <Crown size={22} className={CROWN[rank - 1]} fill="currentColor" aria-hidden />}
          <span className={`num text-[26px] font-extrabold italic leading-none ${top ? CROWN[rank - 1] : 'text-sub'}`}>{rank}</span>
        </div>
        <Thumb m={m} size="64px" rounded={10} />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[16px] leading-tight">{m.shortName}</div>
          <div className="text-[11px] text-sub">現在</div>
          <div className="num text-[22px] font-extrabold leading-none">
            {fmtNum(s.current)}
            <span className="text-[14px] ml-0.5">{s.unit}</span>
          </div>
          <div className="text-[11px] text-dim mt-1 leading-snug">
            {[s.skipCount != null ? `スルー${s.skipCount}回` : null, s.resetState, s.storeName, s.unitNumber ? `${s.unitNumber}番` : null].filter(Boolean).join('・')}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[11px] text-sub">{showHourly ? '時給' : '期待値'}</div>
          <div className="num text-[24px] font-extrabold text-go leading-tight">
            {showHourly ? fmtYen(s.hourly ?? 0, true) : fmtYen(s.ev ?? 0, true)}
          </div>
          <div className="num text-[11px] text-dim">{showHourly ? fmtYen(s.ev ?? 0, true) : s.hourly != null ? `時給 ${fmtYen(s.hourly)}` : ''}</div>
        </div>
        <ChevronRight size={20} className="text-dim shrink-0" aria-hidden />
      </button>
    </li>
  );
}

function ExcludedRow({ e, onOpen }: { e: Excluded; onOpen: (id: string) => void }) {
  const m = machineById(e.slot.machineId);
  if (!m) return null;
  return (
    <button onClick={() => onOpen(m.machineId)} className="card w-full flex items-center gap-3 p-2.5 text-left opacity-80">
      <Thumb m={m} size="44px" rounded={8} />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[15px] truncate">{m.shortName}</div>
        <div className="num text-[13px] text-sub">
          {fmtNum(e.slot.current)}
          {e.slot.unit}
        </div>
      </div>
      <div className="text-right">
        <div className="text-[12px] font-bold text-near">{e.reason}</div>
        <div className="num text-[13px] text-sub">
          {e.reason === '未算出' ? '未算出' : `${fmtYen(e.slot.ev ?? 0, true)}（${e.slot.evCondition?.play}）`}
        </div>
      </div>
    </button>
  );
}
