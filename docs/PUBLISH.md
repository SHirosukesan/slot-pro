# 公開手順

## GitHub Pages（設定済み）
1. `main` に push すると CI（型チェック・Lint・データ検証・テスト・ビルド）が動く。
2. CI が成功した時だけ `.github/workflows/deploy.yml` が GitHub Pages に公開する。データ検証に失敗したら公開しない。
3. 初回だけ GitHub で有効化が必要：リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にする。
4. 公開先：`https://shirosukesan.github.io/slot-pro/`
5. 非公開リポジトリで Pages を使うには GitHub の有料プラン（Pro 等）が必要。無料プランなら公開リポジトリにするか、別の公開先（Cloudflare Pages / Netlify）を使う。

## スマホに入れる（PWA）
- iPhone：Safari で開く → 共有 →「ホーム画面に追加」
- Android：Chrome で開く → メニュー →「アプリをインストール」/「ホーム画面に追加」

## 公開前の確認
- 機種画像の利用許諾（利用者が端末で設定した画像はサーバーに上がらない）
- 外部リンク先
- 秘密情報が含まれていないこと（`VITE_` 変数はビルド後に公開される）
