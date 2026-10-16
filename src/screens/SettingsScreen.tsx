import { useState } from 'react';
import { AlertTriangle, ChevronLeft, Database, Smartphone, Trash2 } from 'lucide-react';
import { MACHINES } from '../data/machines';
import { dataWarnings } from '../lib/validate';
import { STATUS_LABEL } from '../lib/format';
import { clearAll } from '../lib/storage';
import { EXCHANGE_RATES } from '../config/ui';
import type { AppState } from '../state/useAppState';
import { Segmented, Thumb } from '../components/ui';

export function SettingsScreen({ app, onBack }: { app: AppState; onBack: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const warnings = MACHINES.flatMap(dataWarnings);
  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center gap-1 pt-2">
        <button onClick={onBack} aria-label="戻る" className="size-11 -ml-2 grid place-items-center">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-[24px] font-black">設定</h1>
      </header>

      <section className="card p-card flex flex-col gap-3">
        <h2 className="font-bold">期待値の比較条件</h2>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-sub w-16 shrink-0">交換率</span>
          <div className="flex-1">
            <Segmented<string>
              size="sm"
              label="交換率"
              value={`${app.evBase.exchangeRate}枚`}
              options={EXCHANGE_RATES.map((r) => `${r}枚`)}
              onChange={(v) => app.setEvBase({ ...app.evBase, exchangeRate: parseFloat(v) })}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-sub w-16 shrink-0">投資</span>
          <div className="flex-1">
            <Segmented<'持ちメダル' | '現金'> size="sm" label="投資方法" value={app.evBase.play} options={['持ちメダル', '現金']} onChange={(v) => app.setEvBase({ ...app.evBase, play: v })} />
          </div>
        </div>
        <p className="text-[12px] text-dim">この条件と違う期待値は、期待値順で「順位外」になります。</p>
      </section>

      <section className="card p-card">
        <h2 className="font-bold flex items-center gap-2 mb-2">
          <Database size={18} className="text-accent" /> 機種データ（{MACHINES.length}機種）
        </h2>
        <ul className="divide-y divide-line">
          {MACHINES.map((m) => (
            <li key={m.machineId} className="flex items-center gap-3 py-2">
              <Thumb m={m} size="36px" rounded={8} />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold truncate">{m.officialName}</div>
                <div className="text-[11px] text-dim truncate">{m.machineId}・画像 {m.image.src ? m.image.license : '未登録'}</div>
              </div>
              <span className="text-[11px] text-sub">{STATUS_LABEL[m.verificationStatus]}</span>
            </li>
          ))}
        </ul>
        {warnings.length > 0 && (
          <div className="mt-2 rounded-[12px] bg-near/10 p-3 text-[12px] text-near">
            {warnings.map((w, i) => (
              <div key={i} className="flex gap-1.5">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" /> {w.machineId}：{w.message}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card p-card text-[13px] text-sub leading-relaxed">
        <h2 className="font-bold text-fg flex items-center gap-2 mb-1.5">
          <Smartphone size={18} className="text-accent" /> ホーム画面に追加
        </h2>
        <p>iPhone：Safari の共有ボタン →「ホーム画面に追加」</p>
        <p>Android：Chrome のメニュー →「アプリをインストール」</p>
        <p>PC：Chrome・Edge のアドレスバー右のインストールボタン</p>
        <p className="text-dim mt-1">機種情報はオフラインでも表示できます。外部攻略サイトは通信が必要です。</p>
      </section>

      <section className="card p-card">
        {confirming ? (
          <div className="flex flex-col gap-2">
            <p className="text-[14px]">入力した G数・お気に入り・リセット状態をすべて消します。</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setConfirming(false)} className="rounded-[12px] border border-line py-3 font-bold text-sub">やめる</button>
              <button
                onClick={() => {
                  clearAll();
                  location.reload();
                }}
                className="rounded-[12px] bg-prio py-3 font-bold text-white"
              >
                消す
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)} className="flex items-center gap-2 text-prio font-bold">
            <Trash2 size={18} /> 入力データを消す
          </button>
        )}
      </section>

      <p className="text-center text-[11px] text-dim">SLOT PRO v0.1.0（STEP 1 試作）</p>
    </div>
  );
}
