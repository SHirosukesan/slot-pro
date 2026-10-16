/** 色・角丸・余白は src/styles/tokens.css の変数で一括調整 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        raised: 'rgb(var(--c-raised) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        fg: 'rgb(var(--c-fg) / <alpha-value>)',
        sub: 'rgb(var(--c-sub) / <alpha-value>)',
        dim: 'rgb(var(--c-dim) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        'accent-soft': 'rgb(var(--c-accent) / 0.16)',
        go: 'rgb(var(--c-go) / <alpha-value>)',
        near: 'rgb(var(--c-near) / <alpha-value>)',
        prio: 'rgb(var(--c-prio) / <alpha-value>)',
        skip: 'rgb(var(--c-skip) / <alpha-value>)',
        gold: 'rgb(var(--c-gold) / <alpha-value>)',
        silver: 'rgb(var(--c-silver) / <alpha-value>)',
        bronze: 'rgb(var(--c-bronze) / <alpha-value>)',
        ev: 'rgb(var(--c-ev) / <alpha-value>)',
      },
      borderRadius: { card: 'var(--r-card)', pill: '999px' },
      spacing: { card: 'var(--sp-card)', gutter: 'var(--sp-gutter)', thumb: 'var(--thumb)' },
      fontFamily: {
        jp: ['"Noto Sans JP"', '"Hiragino Sans"', '"Yu Gothic"', 'sans-serif'],
        num: ['"Chakra Petch"', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
