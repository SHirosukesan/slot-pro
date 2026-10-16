import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, Clock3, Flame, HelpCircle, Minus, X } from 'lucide-react';
import type { Machine, VerificationStatus } from '../types/machine';
import type { JudgeState } from '../lib/judge';
import { STATUS_LABEL } from '../lib/format';
import { STEP_BUTTONS } from '../config/ui';
import { MachineArt, hasArt } from './art';

export const Logo = ({ className = '' }: { className?: string }) => (
  <span className={`logo text-[26px] leading-none ${className}`} aria-label="SLOT PRO">
    <span className="text-fg">SLOT</span> <span className="text-accent">PRO</span>
  </span>
);

/** 利用者が端末で設定した画像（machineId → data URL）。データ側の image.src より優先 */
export const UserImageContext = createContext<Record<string, string>>({});

/**
 * 機種画像。優先順: 端末で設定した画像 → データの image.src → テーマ画像 → 頭文字の代替表示。
 * 枠線は内側に重ねるので、どの画像でも外寸は size×size で揃う。
 */
export const Thumb = ({ m, size = 'var(--thumb)', height, rounded = 14, bare = false }: { m: Machine; size?: string; height?: string; rounded?: number; bare?: boolean }) => {
  const [broken, setBroken] = useState(false);
  const userImages = useContext(UserImageContext);
  const src = userImages[m.machineId] ?? m.image.src;
  // height を渡すと縦に伸ばせる（カードの高さに合わせる時は '100%'）
  const box = { width: size, height: height ?? size, borderRadius: rounded, flex: 'none' } as const;
  const ring = bare ? null : <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" style={{ borderRadius: rounded }} aria-hidden />;

  let body: ReactNode;
  if (src && !broken) {
    body = <img src={src} alt={m.shortName} className="block size-full object-cover" onError={() => setBroken(true)} />;
  } else if (hasArt(m.machineId)) {
    body = (
      <span data-testid="thumb-art" className="block size-full">
        <MachineArt machineId={m.machineId} label={m.shortName} />
      </span>
    );
  } else {
    const h = m.hue;
    body = (
      <span
        role="img"
        aria-label={`${m.shortName}（画像未登録）`}
        data-testid="thumb-fallback"
        className="grid size-full place-items-center"
        style={{ background: `radial-gradient(120% 90% at 20% 10%, hsl(${h} 70% 42%) 0%, hsl(${h} 60% 18%) 55%, #0d0e13 100%)` }}
      >
        <span className="font-jp font-black text-white/95 drop-shadow" style={{ fontSize: `calc(${size} * 0.42)` }}>
          {m.shortName.slice(0, 1)}
        </span>
      </span>
    );
  }
  return (
    <span className="relative block overflow-hidden bg-raised" style={box}>
      {body}
      {ring}
    </span>
  );
};

const STATE_STYLE: Record<JudgeState, { cls: string; Icon: typeof Check }> = {
  go: { cls: 'text-go border-go', Icon: Check },
  near: { cls: 'text-near border-near', Icon: Clock3 },
  prio: { cls: 'text-prio border-prio', Icon: Flame },
  skip: { cls: 'text-skip border-skip', Icon: Minus },
  unknown: { cls: 'text-dim border-dim', Icon: HelpCircle },
};

export const stateText = (s: JudgeState) =>
  ({ go: 'text-go', near: 'text-near', prio: 'text-prio', skip: 'text-sub', unknown: 'text-sub' })[s];

/** 判定ピル（色＋アイコン＋文言で判別） */
export const StatePill = ({ state, label, big = false }: { state: JudgeState; label: string; big?: boolean }) => {
  const { cls, Icon } = STATE_STYLE[state];
  return (
    <span className={`inline-flex items-center gap-1 rounded-pill border-2 font-bold whitespace-nowrap ${cls} ${big ? 'px-4 py-1.5 text-[17px]' : 'px-3 py-0.5 text-[14px]'}`}>
      <Icon size={big ? 18 : 15} strokeWidth={3} aria-hidden />
      {label}
    </span>
  );
};

const STATUS_CLS: Record<VerificationStatus, string> = {
  verified: 'text-go bg-go/10',
  single: 'text-accent bg-accent-soft',
  needsReview: 'text-near bg-near/10',
  unverified: 'text-sub bg-white/5',
  na: 'text-dim bg-white/5',
  sample: 'text-sub bg-white/10',
};

export const StatusTag = ({ status }: { status: VerificationStatus }) => (
  <span className={`inline-block rounded-pill px-2 py-0.5 text-[11px] font-bold ${STATUS_CLS[status]}`}>{STATUS_LABEL[status]}</span>
);

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  size = 'md',
  label,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  size?: 'md' | 'sm';
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className={`grid card p-1 ${size === 'md' ? 'gap-1' : 'gap-0.5'}`} style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((o) => {
        const on = o === value;
        return (
          <button
            key={o}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o)}
            className={`rounded-[12px] font-bold transition-colors ${size === 'md' ? 'py-2.5 text-[16px]' : 'py-1.5 text-[13px]'} ${on ? 'bg-accent text-white shadow-[0_4px_18px_-6px_rgb(var(--c-accent))]' : 'text-sub hover:text-fg'}`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export const Sheet = ({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="sheet-in w-full max-w-[460px] bg-surface border-t border-line rounded-t-[24px] px-gutter pt-4"
        style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[17px] font-bold">{title}</h2>
          <button onClick={onClose} aria-label="閉じる" className="size-10 grid place-items-center rounded-full bg-raised text-sub">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

/** 現在値の入力シート。数字キーボード＋ワンタップ加減算 */
export const NumberSheet = ({
  open,
  onClose,
  title,
  unit,
  value,
  onSave,
  allowNegative = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  unit: string;
  value: number | null;
  onSave: (v: number | null) => void;
  allowNegative?: boolean;
}) => {
  const [draft, setDraft] = useState(value == null ? '' : String(value));
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      setDraft(value == null ? '' : String(value));
      setTimeout(() => ref.current?.select(), 60);
    }
  }, [open, value]);
  const n = draft === '' || draft === '-' ? null : Number(draft);
  const bump = (d: number) => {
    const next = (n ?? 0) + d;
    setDraft(String(allowNegative ? next : Math.max(0, next)));
  };
  const save = () => {
    onSave(n != null && Number.isFinite(n) ? n : null);
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="tile flex items-baseline justify-center gap-1 py-3">
          <input
            id="number-sheet-input"
            ref={ref}
            inputMode={allowNegative ? 'text' : 'numeric'}
            pattern={allowNegative ? '-?[0-9]*' : '[0-9]*'}
            value={draft}
            onChange={(e) => setDraft(e.target.value.replace(allowNegative ? /[^\d-]/g : /\D/g, ''))}
            placeholder="0"
            aria-label={title}
            className="num w-[6ch] bg-transparent text-center text-[56px] font-extrabold text-fg outline-none placeholder:text-dim"
          />
          <span className="num text-[24px] font-bold text-sub">{unit}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-3">
          {STEP_BUTTONS.map((d) => (
            <button type="button" key={d} onClick={() => bump(d)} className="num tile py-3 text-[17px] font-bold text-fg active:bg-line">
              {d > 0 ? `+${d}` : d}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-[1fr_2fr] gap-2 mt-3">
          <button type="button" onClick={() => setDraft('')} className="rounded-[14px] border border-line py-3.5 font-bold text-sub">
            クリア
          </button>
          <button type="submit" className="rounded-[14px] bg-accent py-3.5 font-bold text-white text-[17px]">
            決定
          </button>
        </div>
      </form>
    </Sheet>
  );
};
