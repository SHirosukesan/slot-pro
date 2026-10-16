import { useContext, useState, type ReactNode } from 'react';
import {
  BarChart3,
  Camera,
  ChevronLeft,
  ExternalLink,
  FileText,
  Flag,
  Heart,
  Pencil,
  RotateCcw,
  Search,
  Sun,
  Target,
  Repeat,
} from 'lucide-react';
import type { ExternalLink as XLink, Machine, ResetState } from '../types/machine';
import { judge } from '../lib/judge';
import { fileToThumb, isImageFile } from '../lib/image';
import { remainingNet } from '../lib/advantage';
import { fmtCheckCount, fmtEvRange, fmtNum, fmtRange, missingText, numText } from '../lib/format';
import { DETAIL_ORDER, type DetailKey } from '../config/ui';
import type { AppState } from '../state/useAppState';
import { MachineArt, hasArt } from '../components/art';
import { UserImageContext, Logo, NumberSheet, Segmented, StatePill, StatusTag, stateText } from '../components/ui';

const RESETS: readonly ResetState[] = ['リセット', '据え置き', '不明'];


export function MachineDetail({ m, app, morning, onBack }: { m: Machine; app: AppState; morning: boolean; onBack: () => void }) {
  const [sheet, setSheet] = useState<'count' | 'net' | null>(null);
  const reset = app.resets[m.machineId] ?? '不明';
  const cur = app.counters[m.machineId] ?? null;
  const j = judge(m, cur, morning, reset);
  const fav = app.favorites.includes(m.machineId);
  const rule = j.rule;
  const adv = m.advantageousSectionRules;
  const net = app.nets[m.machineId] ?? null;
  const startKnown = app.netStartKnown[m.machineId] ?? false;
  const remain = remainingNet(adv, net, startKnown);

  /** リセット関連（朝一天井・リセット恩恵・判別）は「据え置き」の時は出さない。リセット・不明なら出す */
  const resetInfo = reset !== '据え置き';

  /** 項目ごとの部品。データが無い機種では null を返して非表示 */
  const blocks: Record<DetailKey, ReactNode> = {
    aim: null, // aim と ev は下の大カードで一緒に表示
    ev: null,
    ceilingNormal: <Tile key="cn" label="通常天井" value={numText(m.ceilingRules.normal)} />,
    ceilingMorning: resetInfo ? <Tile key="cm" label="朝一天井" value={numText(m.ceilingRules.morning)} tone="text-near" /> : null,
    quit:
      m.quitRules.length > 0 ? (
        <Tile
          key="q"
          label={`やめどき（${m.quitRules[0]!.situation}）`}
          value={fmtCheckCount(m.quitRules[0]!.checkCount, m.quitRules[0]!.unit)}
          tone="text-go"
          sub={m.quitRules[0]!.action}
        />
      ) : null,
    precursor: m.precursorRules ? (
      <Tile
        key="p"
        label="前兆確認"
        value={m.precursorRules.checkCount == null ? '未確認' : `${fmtNum(m.precursorRules.checkCount)}${m.precursorRules.checkUnit}`}
        tone="text-accent"
        sub={[
          m.precursorRules.onset ? `目安 ${fmtRange(m.precursorRules.onset.min, m.precursorRules.onset.max, m.precursorRules.onset.unit)}` : null,
          m.precursorRules.endCondition,
        ]
          .filter(Boolean)
          .join(' / ')}
      />
    ) : null,
    zone:
      m.zoneRules.length > 0 ? (
        <Tile key="z" label={m.zoneRules[0]!.label} value={m.zoneRules.map((z) => fmtRange(z.min, z.max, z.unit)).join(' / ')} />
      ) : null,
    skipCeiling: m.skipRules ? <Tile key="sc" label="スルー天井" value={numText(m.skipRules.ceiling)} sub={m.skipRules.definition} /> : null,
    skipAim: m.skipRules ? <Tile key="sa" label="スルー狙い目" value={m.skipRules.aimFrom.value == null ? '未確認' : `${m.skipRules.aimFrom.value}${m.skipRules.aimFrom.unit}〜`} tone="text-go" /> : null,
    resetBenefit: null,
    resetDetect: null,
    advantage: null,
  };
  const tiles = DETAIL_ORDER.map((k) => blocks[k]).filter(Boolean);
  const show = (k: DetailKey) => DETAIL_ORDER.includes(k);

  return (
    <div className="flex flex-col gap-3 pb-2">
      {/* ヒーロー */}
      <div className="relative -mx-gutter overflow-hidden">
        {/* 色だけを敷く背景（ぼかし） */}
        <div className="absolute inset-0 scale-150 blur-2xl opacity-60" aria-hidden>
          <HeroArt m={m} />
        </div>
        {/* 右側に画像。左へ向けて溶かす */}
        <div
          className="absolute inset-y-0 right-0 w-[68%]"
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, #000 38%)', maskImage: 'linear-gradient(to right, transparent, #000 38%)' }}
          aria-hidden
        >
          <HeroArt m={m} />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgb(var(--c-bg) / .35), transparent 35%, transparent 65%, rgb(var(--c-bg)))' }} aria-hidden />
        <div className="relative px-gutter pt-2 pb-4 min-h-[210px] flex flex-col">
          <div className="flex items-center justify-between">
            <button onClick={onBack} aria-label="戻る" className="size-11 -ml-2 grid place-items-center text-fg">
              <ChevronLeft size={30} />
            </button>
            <Logo className="text-[22px]" />
            <button onClick={() => app.toggleFavorite(m.machineId)} aria-pressed={fav} aria-label={fav ? 'お気に入り解除' : 'お気に入り登録'} className="size-11 -mr-2 grid place-items-center">
              <Heart size={26} className={fav ? 'text-prio' : 'text-fg'} fill={fav ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="flex items-end gap-3 mt-auto pt-6">
            <div className="flex-1 min-w-0">
              <h1 className={`${m.shortName.length > 6 ? 'text-[26px]' : 'text-[32px]'} font-black leading-tight tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,.8)]`}>{m.shortName}</h1>
              <p className="text-[14px] text-fg/80">{m.officialName}</p>
            </div>
            <ImagePicker m={m} app={app} />
          </div>
        </div>
      </div>

      {/* 現在のゲーム数 */}
      <section className="card p-card">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[14px] text-sub">現在の{m.counterUnit === 'G' ? 'ゲーム数' : m.counterUnit}</span>
          <StatePill state={j.state} label={j.state === 'go' ? '今打てる' : j.label} big />
        </div>
        <button onClick={() => setSheet('count')} className="flex items-baseline gap-1 group" aria-label="現在値を入力">
          <span className={`num font-extrabold leading-none ${cur == null ? 'text-dim' : stateText(j.state)}`} style={{ fontSize: 'var(--fs-detail-big)' }}>
            {cur == null ? '---' : fmtNum(cur)}
          </span>
          <span className={`num text-[28px] font-bold ${cur == null ? 'text-dim' : stateText(j.state)}`}>{m.counterUnit}</span>
          <Pencil size={16} className="ml-1 text-dim group-hover:text-sub self-center" aria-hidden />
        </button>
        <div className="flex items-center gap-1.5 mt-1.5 text-[16px]">
          <Target size={20} className="text-prio" aria-hidden />
          <span>
            {j.morningApplied ? '朝イチ狙い目' : '狙い目'}{' '}
            <b className="num">{rule?.minLine != null ? `${fmtNum(rule.minLine)}${rule.unit}〜` : '未確認'}</b>
          </span>
        </div>
      </section>

      {/* 狙い目・期待値（最優先） */}
      {(show('aim') || show('ev')) && (
        <section className="card p-card">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[14px] text-sub">{j.morningApplied ? '朝イチ 推奨範囲' : '推奨範囲'}</span>
            <span className="num text-[30px] font-extrabold text-go leading-none">
              {rule?.recommended ? (fmtRange(rule.recommended.min, rule.recommended.max, rule.unit) ?? '未確認') : '未確認'}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2 mt-2.5">
            <span className="text-[14px] text-sub">期待値</span>
            <span className="num text-[24px] font-extrabold leading-none">{fmtEvRange(rule?.ev ?? null)}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-dim">
            {rule?.target && <span>確認対象：{rule.target}</span>}
            {rule?.ev && (
              <span>
                前提：{rule.ev.condition.exchangeRate}枚・{rule.ev.condition.play}
              </span>
            )}
            {rule && <StatusTag status={rule.status} />}
          </div>
        </section>
      )}

      {/* 数値タイル */}
      {tiles.length > 0 && <div className="grid grid-cols-2 gap-2.5">{tiles}</div>}

      {/* 朝イチ */}
      {(show('resetBenefit') || show('resetDetect')) && (
        <section className="card overflow-hidden">
          <div className="p-card flex items-center gap-3">
            <Sun size={20} className="text-near shrink-0" aria-hidden />
            <span className="font-bold shrink-0">朝イチ</span>
            <div className="flex-1">
              <Segmented<ResetState> size="sm" label="リセット状態" value={reset} options={RESETS} onChange={(r) => app.setReset(m.machineId, r)} />
            </div>
          </div>
          <dl className="border-t border-line divide-y divide-line text-[15px]">
            {resetInfo && show('resetBenefit') && <Row icon={<RotateCcw size={18} />} k="リセット恩恵" v={m.morningRules.resetBenefit.text ?? missingText(m.morningRules.resetBenefit.status)} />}
            {resetInfo && show('resetDetect') && (
              <Row
                icon={<Search size={18} />}
                k={m.morningRules.gakkun.label}
                v={m.morningRules.gakkun.status === 'na' ? 'なし' : `${m.morningRules.gakkun.certainty}`}
                tone={m.morningRules.gakkun.certainty === '確定' ? 'text-go' : 'text-near'}
              />
            )}
            {resetInfo && show('resetDetect') && m.morningRules.initialState && (
              <Row icon={<Search size={18} />} k={m.morningRules.initialState.label} v={m.morningRules.initialState.certainty} tone="text-near" />
            )}
            {resetInfo &&
              show('resetDetect') &&
              m.morningRules.otherDetections.map((d) => <Row key={d.label} icon={<Search size={18} />} k={d.label} v={d.certainty} tone="text-near" />)}
            <Row icon={<Flag size={18} />} k="宵越し" v={m.morningRules.carryOver.text ?? missingText(m.morningRules.carryOver.status)} />
 {resetInfo && m.morningRules.limits.text && <Row icon={<Flag size={18} />} k="判別の限界" v={m.morningRules.limits.text} />}
          </dl>
          {reset === '不明' && morning && (
            <p className="px-card pb-3 text-[12px] text-dim">「リセット」を選ぶと朝イチ狙い目・朝一天井で判定します。示唆・推測だけでリセット確定にはしません。</p>
          )}
        </section>
      )}

      {/* 有利区間（必須） */}
      {show('advantage') && (
        <section className="card p-card">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="flex items-center gap-2 font-bold text-[16px]">
              <Repeat size={18} className="text-accent" aria-hidden />
              有利区間
            </h2>
            <StatusTag status={adv.cutConditions[0]?.status ?? adv.benefit.status} />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="tile p-3">
              <div className="text-[12px] text-accent/90">差枚の基準</div>
              <div className="num text-[22px] font-extrabold mt-0.5">
                {adv.regulatoryNetBaseline.value == null ? '未確認' : `+${fmtNum(adv.regulatoryNetBaseline.value)}枚`}
              </div>
              <div className="text-[11px] text-dim">規定上の基準</div>
            </div>
            <div className="tile p-3">
              <div className="text-[12px] text-accent/90">切断条件</div>
              {adv.mechanism === 'none' ? (
                <div className="text-[20px] font-bold mt-0.5">なし</div>
              ) : adv.cutConditions.length === 0 ? (
                <div className="text-[20px] font-bold mt-0.5 text-sub">未確認</div>
              ) : (
                adv.cutConditions.map((c) => (
                  <div key={c.id}>
                    <div className="num text-[22px] font-extrabold mt-0.5 text-accent">
                      {c.value == null ? <span className="text-sub text-[20px]">未確認</span> : `+${fmtNum(c.value)}${c.unit}`}
                    </div>
                    <div className="text-[11px] text-dim">{c.kind}（{c.label}）</div>
                  </div>
                ))
              )}
            </div>
          </div>
          <dl className="mt-2 divide-y divide-line text-[15px]">
            <div className="flex justify-between py-2.5">
              <dt className="text-sub">切断恩恵</dt>
              <dd className="font-bold">{adv.benefit.text ?? missingText(adv.benefit.status)}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-sub">切断判別</dt>
              <dd className="font-bold">{adv.detection.text ?? missingText(adv.detection.status)}</dd>
            </div>
            {adv.mechanism !== 'none' && (
              <>
                <div className="flex justify-between items-center py-2">
                  <dt className="text-sub">現在の区間差枚</dt>
                  <dd>
                    <button onClick={() => setSheet('net')} className="num font-bold text-[18px] inline-flex items-center gap-1">
                      {net == null ? <span className="text-dim">入力</span> : `${net >= 0 ? '+' : ''}${fmtNum(net)}枚`}
                      <Pencil size={14} className="text-dim" aria-hidden />
                    </button>
                  </dd>
                </div>
                <div className="flex justify-between items-center py-2">
                  <dt className="text-sub">区間開始点</dt>
                  <dd>
                    <button
                      onClick={() => app.setStartKnown(m.machineId, !startKnown)}
                      aria-pressed={startKnown}
                      className={`rounded-pill px-3 py-1 text-[13px] font-bold border ${startKnown ? 'border-go text-go' : 'border-line text-sub'}`}
                    >
                      {startKnown ? 'わかる' : '不明'}
                    </button>
                  </dd>
                </div>
                <div className="flex justify-between items-baseline py-2.5">
                  <dt className="text-sub">切断まで残り</dt>
                  <dd className="text-right">
                    {remain.kind === 'ok' ? (
                      <span className="num text-[24px] font-extrabold text-accent">{fmtNum(remain.remaining)}枚</span>
                    ) : (
                      <span className="text-[13px] text-dim">
                        {
                          {
                            none: 'なし',
                            unconfirmed: '切断条件が未確認のため計算しない',
                            notNet: '差枚の条件ではないため計算しない',
                            noStart: '区間開始点が不明のため計算しない',
                            noInput: '区間差枚を入力',
                          }[remain.kind]
                        }
                      </span>
                    )}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </section>
      )}

      {/* 外部リンク */}
      <h2 className="text-[16px] font-bold mt-1">詳しく見る</h2>
      <div className="flex flex-col gap-2">
        {(['settei', 'reset', 'advantage'] as const).map((k) => (
          <LinkGroup key={k} kind={k} links={m.sourceLinks.filter((l) => l.kind === k && l.url)} />
        ))}
      </div>

      <p className="text-[12px] text-dim leading-relaxed mt-1">
        {m.verificationStatus === 'sample'
          ? '数値はすべて架空の表示サンプルです。実機の解析値ではありません。STEP 2 で出典を確認して差し替えます。'
          : `確認日：${m.verifiedAt ?? '未確認'}`}
      </p>

      <NumberSheet
        open={sheet === 'count'}
        onClose={() => setSheet(null)}
        title={`現在の${m.counterUnit}数`}
        unit={m.counterUnit}
        value={cur}
        onSave={(v) => app.setCounter(m.machineId, v)}
      />
      <NumberSheet
        open={sheet === 'net'}
        onClose={() => setSheet(null)}
        title="現在の区間差枚"
        unit="枚"
        value={net}
        allowNegative
        onSave={(v) => app.setNet(m.machineId, v)}
      />
    </div>
  );
}

/** ヒーロー背景。端末の画像 → テーマ画像の順に、横長に切り抜いて敷く */
function HeroArt({ m }: { m: Machine }) {
  const userImages = useContext(UserImageContext);
  const src = userImages[m.machineId] ?? m.image.src;
  if (src) return <img src={src} alt="" className="size-full object-cover object-[center_25%]" />;
  if (hasArt(m.machineId)) return <MachineArt machineId={m.machineId} label="" />;
  return <div className="size-full" style={{ background: `linear-gradient(120deg, hsl(${m.hue} 60% 22%), rgb(var(--c-bg)))` }} />;
}

function ImagePicker({ m, app }: { m: Machine; app: AppState }) {
  const [error, setError] = useState<string | null>(null);
  const has = app.images[m.machineId] != null;
  const inputId = `image-${m.machineId}`;
  return (
    <div className="flex flex-col items-end gap-1 shrink-0">
      <label
        htmlFor={inputId}
        className="cursor-pointer inline-flex items-center gap-1.5 rounded-pill bg-black/55 backdrop-blur px-3 py-1.5 text-[12px] font-bold text-white ring-1 ring-white/15"
        aria-label={`${m.shortName}の画像を${has ? '変更' : '設定'}`}
      >
        <Camera size={15} aria-hidden />
        {has ? '画像を変更' : '画像を設定'}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (!f) return;
          if (!isImageFile(f)) return setError('画像ファイルを選んでください');
          try {
            app.setImage(m.machineId, await fileToThumb(f));
            setError(null);
          } catch (err) {
            setError(err instanceof Error ? err.message : '画像を設定できませんでした');
          }
        }}
      />
      {has && (
        <button onClick={() => app.setImage(m.machineId, null)} className="text-[11px] text-fg/80 underline">
          画像を外す
        </button>
      )}
      {error && <span className="text-[11px] text-prio max-w-[110px] text-center">{error}</span>}
    </div>
  );
}

const Tile = ({ label, value, sub, tone = 'text-fg' }: { label: string; value: string | null; sub?: string; tone?: string }) => (
  <div className="card p-3.5 min-w-0">
    <div className="text-[13px] text-sub truncate">{label}</div>
    <div className={`num text-[26px] font-extrabold leading-tight mt-0.5 ${value === '未確認' || value === 'なし' ? 'text-sub text-[20px]' : tone}`}>
      {value ?? '未確認'}
    </div>
    {sub && <div className="text-[12px] text-dim mt-0.5 leading-snug">{sub}</div>}
  </div>
);

const Row = ({ icon, k, v, tone = 'text-fg' }: { icon: ReactNode; k: string; v: string; tone?: string }) => (
  <div className="flex items-center gap-3 px-card py-3">
    <span className="text-sub shrink-0" aria-hidden>
      {icon}
    </span>
    <dt className="font-bold shrink-0">{k}</dt>
    <dd className={`ml-auto text-right ${v === '未確認' || v === 'なし' ? 'text-sub' : tone}`}>{v}</dd>
  </div>
);

const LINK_META = {
  settei: { label: '設定推測', Icon: BarChart3 },
  reset: { label: 'リセット判別', Icon: RotateCcw },
  advantage: { label: '有利区間', Icon: FileText },
} as const;

/** 1項目（設定推測など）に複数サイトのリンク。登録が無ければ「リンク未登録」 */
const LinkGroup = ({ kind, links }: { kind: XLink['kind']; links: XLink[] }) => {
  const { label, Icon } = LINK_META[kind];
  if (links.length === 0) {
    return (
      <div className="card flex items-center gap-3 px-card h-[52px] opacity-70" aria-disabled="true" data-testid={`link-${kind}-missing`}>
        <Icon size={20} className="text-dim" aria-hidden />
        <span className="font-bold">{label}</span>
        <span className="ml-auto text-[12px] text-dim">リンク未登録</span>
      </div>
    );
  }
  return (
    <div className="card px-card py-3 flex flex-col gap-2.5" role="group" aria-label={label}>
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-accent" aria-hidden />
        <span className="font-bold">{label}</span>
        <ExternalLink size={16} className="ml-auto text-sub" aria-hidden />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {links.map((l) => (
          <a
            key={l.url}
            href={l.url ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label}（${l.site}）`}
            className="tile flex items-center justify-center h-10 px-1 text-[12px] font-bold text-fg whitespace-nowrap hover:text-accent"
          >
            {l.site}
          </a>
        ))}
      </div>
    </div>
  );
};

