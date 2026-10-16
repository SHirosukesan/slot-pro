import { useState } from 'react';
import { ChevronDown, Crown, Info, Settings } from 'lucide-react';
import { machineById } from '../data/machines';
import { SAMPLE_SLOTS } from '../data/sampleSlots';
import { SAMPLE_EV_CONDITION } from '../data/helpers';
import { RANKING_TOP } from '../config/ui';
import { rankSlots, type Excluded, type RankedSlot } from '../lib/ranking';
import { fmtNum } from '../lib/format';
import type { AppState } from '../state/useAppState';
import { Logo, Segmented, Thumb } from '../components/ui';

/** 1〜3位の王冠：金・銀・銅 */
const CROWN = ['text-gold', 'text-silver', 'text-bronze'];

export function Ranking({ app, onOpen, onSettings }: { app: AppState; onOpen: (id: string) => void; onSettings: () => void }) {
  const [sortBy, setSortBy] = useState<'期待値' | '時給'>('期待値');
  const [showInfo, setShowInfo] = useState(false);
  const [showExcluded, setShowExcluded] = useState(false);
  const { ranked, excluded, hourlyAvailable, sortedBy } = rankSlots(SAMPLE_SLOTS, app.evBase, sortBy === '時給' ? 'hourly' : 'ev');
  const showHourly = sortedBy === 'hourly';
  // 上位は大きなカード、それ以降は1行で順番だけ
  const top = ranked.slice(0, RANKING_TOP);
  const rest = ranked.slice(RANKING_TOP);

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

      {ranked.length === 0 ? (
        <div className="card p-5 text-center flex flex-col items-center gap-3">
          <p className="text-[14px] text-sub">
            {app.evBase.exchangeRate}枚・{app.evBase.play} で計算された期待値がありません。
          </p>
          <button
            onClick={() => app.setEvBase(SAMPLE_EV_CONDITION)}
            className="rounded-pill bg-accent px-4 py-2 text-[14px] font-bold text-white"
          >
            {SAMPLE_EV_CONDITION.exchangeRate}枚・{SAMPLE_EV_CONDITION.play} に戻す
          </button>
        </div>
      ) : (
        <ol className="flex flex-col gap-2.5" aria-label="ランキング">
          {top.map((s, i) => (
            <RankRow key={s.id} s={s} rank={i + 1} showHourly={showHourly} onOpen={onOpen} />
          ))}
        </ol>
      )}

      {rest.length > 0 && (
        <ol className="card divide-y divide-line" start={RANKING_TOP + 1} aria-label={`${RANKING_TOP + 1}位以下`}>
          {rest.map((s, i) => (
            <CompactRow key={s.id} s={s} rank={RANKING_TOP + 1 + i} showHourly={showHourly} onOpen={onOpen} />
          ))}
        </ol>
      )}

      {excluded.length > 0 && (
        <section className="card">
          <button
            onClick={() => setShowExcluded((v) => !v)}
            aria-expanded={showExcluded}
            className="w-full flex items-center justify-between px-card py-3 text-[14px] font-bold text-sub"
          >
            順位外 {excluded.length}台
            <ChevronDown size={18} className={`transition-transform ${showExcluded ? 'rotate-180' : ''}`} aria-hidden />
          </button>
          {showExcluded && (
            <div className="divide-y divide-line border-t border-line">
              {excluded.map((e) => (
                <ExcludedRow key={e.slot.id} e={e} onOpen={onOpen} />
              ))}
            </div>
          )}
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
      <button onClick={() => onOpen(m.machineId)} className="card w-full flex items-center gap-2.5 p-2.5 text-left hover:border-accent/50">
        <div className="w-7 shrink-0 flex flex-col items-center">
          {top && <Crown size={22} className={CROWN[rank - 1]} fill="currentColor" aria-hidden />}
          <span className={`num text-[26px] font-extrabold italic leading-none ${top ? CROWN[rank - 1] : 'text-sub'}`}>{rank}</span>
        </div>
        <Thumb m={m} size="56px" rounded={10} />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[16px] leading-tight truncate">{m.shortName}</div>
          <div className="text-[11px] text-sub">現在</div>
          <div className="num text-[22px] font-extrabold leading-none">
            {fmtNum(s.current)}
            <span className="text-[14px] ml-0.5">{s.unit}</span>
          </div>
          <div className="text-[11px] text-dim mt-1 truncate">
            {[s.skipCount != null ? `スルー${s.skipCount}回` : null, s.resetState, s.storeName, s.unitNumber ? `${s.unitNumber}番` : null].filter(Boolean).join('・')}
          </div>
        </div>
        <div className="shrink-0 self-stretch flex flex-col justify-center items-end border-l border-line pl-2.5">
          <div className="text-[12px] text-sub">{showHourly ? '時給' : '期待値'}</div>
          <YenBig value={showHourly ? (s.hourly ?? 0) : (s.ev ?? 0)} />
          <div className="num text-[11px] text-dim mt-0.5">
            {showHourly ? `期待値 ${signedYen(s.ev ?? 0)}` : s.hourly != null ? `時給 ${signedYen(s.hourly)}` : ''}
          </div>
        </div>
      </button>
    </li>
  );
}

function CompactRow({ s, rank, showHourly, onOpen }: { s: RankedSlot; rank: number; showHourly: boolean; onOpen: (id: string) => void }) {
  const m = machineById(s.machineId);
  if (!m) return null;
  const v = showHourly ? (s.hourly ?? 0) : (s.ev ?? 0);
  return (
    <li>
      <button onClick={() => onOpen(m.machineId)} className="w-full flex items-center gap-3 px-card py-2.5 text-left">
        <span className="num w-6 text-center text-[18px] font-extrabold italic text-dim">{rank}</span>
        <Thumb m={m} size="36px" rounded={8} />
        <span className="flex-1 min-w-0">
          <span className="block text-[15px] font-bold truncate">{m.shortName}</span>
          <span className="num block text-[12px] text-sub">
            {fmtNum(s.current)}
            {s.unit}
          </span>
        </span>
        <span className={`num text-[18px] font-extrabold whitespace-nowrap ${evTone(v)}`} data-testid="ev-value">
          {signedYen(v)}
        </span>
      </button>
    </li>
  );
}

function ExcludedRow({ e, onOpen }: { e: Excluded; onOpen: (id: string) => void }) {
  const m = machineById(e.slot.machineId);
  if (!m) return null;
  return (
    <button onClick={() => onOpen(m.machineId)} className="w-full flex items-center gap-3 px-card py-2.5 text-left">
      <Thumb m={m} size="36px" rounded={8} />
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
          {e.reason === '未算出' ? (
            '未算出'
          ) : (
            <span className={`font-bold ${evTone(e.slot.ev ?? 0)}`} data-testid="ev-excluded">
              {signedYen(e.slot.ev ?? 0)}（{e.slot.evCondition?.play}）
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/** プラスは期待値グリーン、マイナスは赤 */
const evTone = (n: number) => (n < 0 ? 'text-prio' : n > 0 ? 'text-ev' : 'text-sub');

/** 「+2,300円」「−1,200円」 */
const signedYen = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : '±'}${fmtNum(Math.abs(n))}円`;

function YenBig({ value }: { value: number }) {
  const tone = evTone(value);
  return (
    <div className={`num font-extrabold leading-none whitespace-nowrap ${tone}`} data-testid="ev-value">
      <span className="text-[26px]">
        {value > 0 ? '+' : value < 0 ? '−' : '±'}
        {fmtNum(Math.abs(value))}
      </span>
      <span className="text-[14px] ml-0.5">円</span>
    </div>
  );
}
