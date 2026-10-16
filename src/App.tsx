import { useEffect, useState } from 'react';
import type { AimType } from './types/machine';
import { Crown, ListChecks, Settings } from 'lucide-react';
import { machineById } from './data/machines';
import { useAppState } from './state/useAppState';
import { QuickJudge } from './screens/QuickJudge';
import { MachineDetail } from './screens/MachineDetail';
import { Ranking } from './screens/Ranking';
import { SettingsScreen } from './screens/SettingsScreen';
import { UserImageContext } from './components/ui';

type Tab = 'quick' | 'rank' | 'settings';

export default function App() {
  const app = useAppState();
  const [tab, setTab] = useState<Tab>('quick');
  const [mode, setMode] = useState<'狙い目' | '朝イチ'>('狙い目');
  /** 天井狙い / CZ狙い（クイック判定と機種詳細で共通） */
  const [aim, setAim] = useState<AimType>('天井');
  const [detailId, setDetailId] = useState<string | null>(null);
  const detail = detailId ? machineById(detailId) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab, detailId]);

  // ブラウザの戻るで詳細を閉じる
  useEffect(() => {
    const onPop = () => setDetailId(null);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const open = (id: string) => {
    try {
      history.pushState({ detail: id }, '');
    } catch {
      /* プレビュー環境では無視 */
    }
    setDetailId(id);
  };
  const close = () => setDetailId(null);

  const nav: { id: Tab; label: string; Icon: typeof Crown }[] = [
    { id: 'quick', label: 'クイック判定', Icon: ListChecks },
    { id: 'rank', label: '期待値順', Icon: Crown },
    { id: 'settings', label: '設定', Icon: Settings },
  ];

  return (
    <UserImageContext.Provider value={app.images}>
    <div className="min-h-full bg-bg">
      <main
        className="mx-auto w-full max-w-[460px] pb-[96px]"
        style={{ paddingLeft: 'max(var(--sp-gutter), env(safe-area-inset-left, 0px))', paddingRight: 'max(var(--sp-gutter), env(safe-area-inset-right, 0px))', paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        {detail ? (
          <MachineDetail key={detail.machineId} m={detail} app={app} morning={mode === '朝イチ'} aim={aim} onAim={setAim} onBack={close} />
        ) : tab === 'quick' ? (
          <QuickJudge
            app={app}
            mode={mode}
            aim={aim}
            onAim={setAim}
            onMode={(m) => (m === '期待値順' ? setTab('rank') : setMode(m))}
            onOpen={open}
            onSettings={() => setTab('settings')}
          />
        ) : tab === 'rank' ? (
          <Ranking app={app} onOpen={open} onSettings={() => setTab('settings')} />
        ) : (
          <SettingsScreen app={app} onBack={() => setTab('quick')} />
        )}
      </main>

      <nav
        className="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-bg/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="メイン"
      >
        <div className="mx-auto max-w-[460px] grid grid-cols-3">
          {nav.map(({ id, label, Icon }) => {
            const on = tab === id && !detail;
            return (
              <button
                key={id}
                onClick={() => {
                  setDetailId(null);
                  setTab(id);
                }}
                aria-current={on ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[12px] font-bold ${on ? 'text-accent' : 'text-sub'}`}
              >
                <Icon size={26} fill={id === 'rank' && on ? 'currentColor' : 'none'} aria-hidden />
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
    </UserImageContext.Provider>
  );
}
