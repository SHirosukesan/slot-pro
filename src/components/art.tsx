import type { ReactNode } from 'react';

/**
 * 機種ごとのテーマ画像（オリジナルのイラスト。作品のキャラクターは描かない）。
 * 利用者が自分の画像を設定していない時に使う。
 * 新しい機種は ART に1つ足すだけ。無い機種は頭文字の代替表示になる。
 * viewBox は 120x120。ヒーロー背景では slice で横長に切り抜いて使う。
 */

const Ghoul = () => (
  <>
    <defs>
      <radialGradient id="gh-bg" cx="70%" cy="25%" r="90%">
        <stop offset="0" stopColor="#5a0c18" />
        <stop offset=".55" stopColor="#1a0509" />
        <stop offset="1" stopColor="#070205" />
      </radialGradient>
      <radialGradient id="gh-moon" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#ff4d5e" />
        <stop offset=".7" stopColor="#c3142c" />
        <stop offset="1" stopColor="#c3142c" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="gh-t" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#3a0710" />
        <stop offset="1" stopColor="#ff2d47" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" fill="url(#gh-bg)" />
    <circle cx="84" cy="30" r="26" fill="url(#gh-moon)" opacity=".9" />
    <circle cx="84" cy="30" r="17" fill="#ff5b6b" opacity=".85" />
    {/* ビル街 */}
    <path d="M0 120V86h10V74h9v12h7V64h11v22h6V78h10v42zM60 120V70h12v-8h8v58zM82 120V82h9V58h12v24h7v38z" fill="#06020a" />
    {[16, 30, 66, 96].map((x, i) => (
      <rect key={i} x={x} y={92 + (i % 2) * 6} width="2" height="3" fill="#ff3e55" opacity=".7" />
    ))}
    {/* 赤い触手のような流線 */}
    <path d="M-6 112C22 96 26 62 54 46S98 30 126 6" stroke="url(#gh-t)" strokeWidth="7" fill="none" strokeLinecap="round" />
    <path d="M-6 122C30 108 44 82 70 70S108 62 126 40" stroke="url(#gh-t)" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".85" />
    <path d="M10 126C30 100 30 80 40 62" stroke="#ff2d47" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".6" />
    {[[20, 30], [44, 18], [100, 66], [62, 26], [30, 52]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={1.4 + (i % 2)} fill="#ff4d5e" opacity=".75" />
    ))}
  </>
);

const Monkey = () => (
  <>
    <defs>
      <linearGradient id="mk-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b2a66" />
        <stop offset=".55" stopColor="#1756b8" />
        <stop offset="1" stopColor="#0a1e48" />
      </linearGradient>
      <linearGradient id="mk-boat" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#e8eef9" />
        <stop offset="1" stopColor="#ffffff" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" fill="url(#mk-sky)" />
    {/* スピード線 */}
    {[18, 30, 42, 54].map((y, i) => (
      <rect key={i} x={-10 + i * 14} y={y} width={70 - i * 8} height="1.6" rx=".8" fill="#9cc4ff" opacity={0.35 - i * 0.05} />
    ))}
    {/* 波 */}
    <path d="M0 78c14-6 22 4 36-2s22-8 36-2 26 6 48-2v48H0z" fill="#0e3a86" />
    <path d="M0 90c16-5 26 5 40 0s24-7 40-1 24 4 40-2v35H0z" fill="#0a2b66" />
    <path d="M0 104c18-4 28 4 44 0s26-5 42 0 22 3 34-1v17H0z" fill="#071d47" />
    {/* ボート */}
    <g transform="rotate(-10 70 74)">
      <path d="M36 76h62l10-8H48z" fill="url(#mk-boat)" />
      <path d="M36 76h62l-6 6H44z" fill="#d81f3a" />
      <path d="M62 68l8-8h14l-2 8z" fill="#ffd23f" />
    </g>
    {/* 水しぶき */}
    <path d="M30 84c-8-2-16-1-26 4 10-8 20-12 30-11z" fill="#ffffff" opacity=".85" />
    <path d="M26 90c-10 0-18 3-26 8 8-9 18-12 28-11z" fill="#cfe3ff" opacity=".7" />
    {[[18, 78], [12, 82], [24, 74], [8, 88]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={1.2 + (i % 2) * 0.6} fill="#fff" opacity=".8" />
    ))}
  </>
);

const Hokuto = () => {
  // 北斗七星（おおぐま座のひしゃく）
  const stars = [
    [20, 40],
    [34, 34],
    [47, 38],
    [58, 47],
    [76, 44],
    [82, 62],
    [62, 64],
  ];
  return (
    <>
      <defs>
        <linearGradient id="hk-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120806" />
          <stop offset=".6" stopColor="#4a1606" />
          <stop offset="1" stopColor="#b8410c" />
        </linearGradient>
        <radialGradient id="hk-star">
          <stop offset="0" stopColor="#fff6d8" />
          <stop offset=".4" stopColor="#ffc24a" />
          <stop offset="1" stopColor="#ffc24a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="120" height="120" fill="url(#hk-bg)" />
      <polyline points={stars.map((s) => s.join(',')).join(' ')} fill="none" stroke="#ffcf6b" strokeWidth=".8" opacity=".55" />
      <line x1="58" y1="47" x2="62" y2="64" stroke="#ffcf6b" strokeWidth=".8" opacity=".55" />
      {stars.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="7" fill="url(#hk-star)" />
          <circle cx={x} cy={y} r="1.8" fill="#fffaf0" />
        </g>
      ))}
      {/* 闘気のような炎 */}
      <path d="M0 120V96c8 4 10-10 18-6s6-14 14-10 4-12 12-6 8 16 14 6 10 12 16 4 6-14 14-8 8 14 14 6 10 6 18 0v38z" fill="#ff6a1a" opacity=".55" />
      <path d="M0 120v-14c10 4 14-6 22-2s10-8 18-2 10 8 18 0 12 6 20 0 12 4 20-2 14 4 22 0v20z" fill="#ffb03a" opacity=".55" />
      {/* 地割れ */}
      <path d="M0 116l20-4 10 3 18-6 14 5 20-4 14 3 24-2" stroke="#1a0603" strokeWidth="2" fill="none" />
    </>
  );
};

const Gear = ({ cx, cy, r, teeth, fill }: { cx: number; cy: number; r: number; teeth: number; fill: string }) => (
  <g fill={fill}>
    {Array.from({ length: teeth }, (_, i) => (
      <rect key={i} x={cx - r * 0.16} y={cy - r - r * 0.22} width={r * 0.32} height={r * 0.4} rx="1" transform={`rotate(${(360 / teeth) * i} ${cx} ${cy})`} />
    ))}
    <circle cx={cx} cy={cy} r={r} />
    <circle cx={cx} cy={cy} r={r * 0.38} fill="#120a1c" />
  </g>
);

const Karakuri = () => (
  <>
    <defs>
      <linearGradient id="kr-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2a0f3d" />
        <stop offset=".6" stopColor="#120a1c" />
        <stop offset="1" stopColor="#06231a" />
      </linearGradient>
      <linearGradient id="kr-beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff3b0" stopOpacity=".55" />
        <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" fill="url(#kr-bg)" />
    {/* スポットライト */}
    <path d="M60 0L30 120h60z" fill="url(#kr-beam)" />
    {/* サーカステント */}
    <g>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M60 18L${22 + i * 9.5} 70h9.5z`} fill={i % 2 ? '#f1e6cf' : '#c8202f'} />
      ))}
      <path d="M22 70h76v6H22z" fill="#8a1220" />
      <path d="M60 8v10" stroke="#e8c45a" strokeWidth="1.6" />
      <path d="M60 8l9 3-9 3z" fill="#e8c45a" />
    </g>
    {/* 歯車 */}
    <Gear cx={24} cy={98} r={14} teeth={10} fill="#2fbf7a" />
    <Gear cx={50} cy={108} r={9} teeth={8} fill="#1f8f5a" />
    <Gear cx={98} cy={96} r={16} teeth={12} fill="#9a5cff" />
  </>
);

const Valvrave = () => (
  <>
    <defs>
      <radialGradient id="vv-bg" cx="50%" cy="55%" r="75%">
        <stop offset="0" stopColor="#0f2a1a" />
        <stop offset=".6" stopColor="#081108" />
        <stop offset="1" stopColor="#030604" />
      </radialGradient>
      <radialGradient id="vv-core">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".35" stopColor="#ff4fd8" />
        <stop offset="1" stopColor="#ff4fd8" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="120" height="120" fill="url(#vv-bg)" />
    {/* 六角グリッド */}
    <g stroke="#2dff8a" strokeWidth=".5" fill="none" opacity=".18">
      {Array.from({ length: 6 }, (_, r) =>
        Array.from({ length: 6 }, (_, c) => {
          const x = c * 22 + (r % 2) * 11;
          const y = r * 19;
          return <path key={`${r}-${c}`} d={`M${x} ${y - 11}l9.5 5.5v11L${x} ${y + 11}l-9.5-5.5v-11z`} />;
        }),
      )}
    </g>
    {/* 光の翼 */}
    <path d="M60 64L8 22l18 34-20 6 26 6-16 26z" fill="#2dff8a" opacity=".85" />
    <path d="M60 64l52-42-18 34 20 6-26 6 16 26z" fill="#2dff8a" opacity=".85" />
    <path d="M60 64L20 34l12 26-14 6 18 2z" fill="#0b2a16" />
    <path d="M60 64l40-30-12 26 14 6-18 2z" fill="#0b2a16" />
    <path d="M60 64L14 26M60 64l46-38" stroke="#ff4fd8" strokeWidth="1.2" />
    {/* コア */}
    <circle cx="60" cy="64" r="18" fill="url(#vv-core)" />
    <path d="M60 50l8 14-8 14-8-14z" fill="#fff" opacity=".9" />
  </>
);

export const ART: Record<string, () => ReactNode> = {
  'slot.smart.tokyo-ghoul.v1': Ghoul,
  'slot.smart.monkey-turn-v.v1': Monkey,
  'slot.smart.hokuto-no-ken.v1': Hokuto,
  'slot.smart.karakuri-circus.v1': Karakuri,
  'slot.smart.valvrave.v1': Valvrave,
};

export const hasArt = (machineId: string): boolean => machineId in ART;

/** テーマ画像。uid は同じページ内で gradient の id がぶつからないようにするための接尾辞 */
export function MachineArt({ machineId, label }: { machineId: string; label: string }) {
  const Art = ART[machineId];
  if (!Art) return null;
  return (
    <svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" role="img" aria-label={label} className="block">
      <Art />
    </svg>
  );
}
