/** 色・角丸・余白は src/styles/tokens.css の変数で一括調整 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        raised: 'var(--c-raised)',
        line: 'var(--c-line)',
        fg: 'var(--c-fg)',
        sub: 'var(--c-sub)',
        dim: 'var(--c-dim)',
        accent: 'var(--c-accent)',
        'accent-soft': 'var(--c-accent-soft)',
        go: 'var(--c-go)',
        near: 'var(--c-near)',
        prio: 'var(--c-prio)',
        skip: 'var(--c-skip)',
        gold: 'var(--c-gold)',
      },
      borderRadius: { card: 'var(--r-card)', pill: '999px' },
      spacing: { card: 'var(--sp-card)', gutter: 'var(--sp-gutter)', thumb: 'var(--thumb)' },
      fontFamily: {
        jp: ['"Noto Sans JP"', '"Hiragino Sans"', '"Yu Gothic"', 'sans-serif'],
        num: ['Outfit', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
