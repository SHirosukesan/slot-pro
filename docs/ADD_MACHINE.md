# 機種の追加手順

1. `src/data/machines/` に新しいファイルを作る（既存ファイルをコピー）。
2. `machineId` を決める。形式: `種別.系統.機種名.バージョン`（例 `slot.smart.tokyo-ghoul.v1`）。
   同じ機種の別バージョン・別型式は別IDにする。
3. 値を入れる。各項目は **数値・単位・状態・出典** を別々に持つ。
   - 出典が確認できない値は `value: null` + `status: 'unverified'`（画面に「未確認」）
   - 仕組みが無いものは `status: 'na'`（画面に「なし」）
   - スルーの仕組みが無ければ `skipRules: null`（画面に出ない）
   - やめどきの確認G数は必須。不要なら `0`、不明なら `null`
   - 狙い目は `minLine`（最低ライン）と `recommended`（推奨範囲）を分ける
   - 狙い目には `aim: '天井' | 'CZ'` を付ける。CZ狙いがある機種は `ceilingRules.cz`（CZ天井）と、あれば `czMorning`（朝一CZ天井）も入れる
   - 朝イチの狙い目は `condition: '朝イチ'` で登録する（天井・CZそれぞれ）
   - 期待値は根拠がなければ `ev: null`（「未算出」）
   - 有利区間は `regulatoryNetBaseline`（規定上の基準）と `cutConditions`（機種固有）を分ける。差枚と獲得枚数は `kind` で区別
4. `src/data/machines/index.ts` の `MACHINES` に追加。
5. 画像があれば `public/machines/<machineId>.webp` に置き、`image.src` と出典・許諾状態を記入。
6. `npm run validate:data` と `npm test` を通す。
