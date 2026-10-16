# 公開手順（STEP 6 で確定）

1. `main` への push で GitHub Actions が型チェック・Lint・データ検証・テスト・ビルドを実行。1 つでも失敗したら公開しない。
2. 公開先候補: GitHub Pages / Cloudflare Pages / Netlify（静的ホスティング、バックエンド不要）。
3. 公開前に確認: 機種画像の利用許諾、外部リンク先、秘密情報が含まれていないこと（`VITE_` 変数はビルド後に公開される）。
4. Service Worker は `autoUpdate`。新しいバージョンは次回起動時に反映。
