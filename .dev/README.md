# 開発用メモ（あそび横丁）

公開サイトには関係しない、ゲームを足すときの手順と道具です。

- `spec.md` … 各ゲームの共通仕様（エージェントに渡す）
- `ideas.md` … 作るゲームの候補リスト（作ったら [x]）
- `compose.mjs` … OGP画像(1200×630)とハブ用サムネイル(4:3)を作る Playwright スクリプト

## 1本足す手順
1. `ideas.md` の未着手から1つ選ぶ（ユーザーの希望があればそちら優先）
2. `games/<id>/` を作り、`.git/info/exclude` に一時的に入れておく（作りかけを push しない）
3. エージェントに `spec.md` と題材を渡して作らせる
4. 自分で実際に遊んで確かめる（Playwright。3Dは `--use-gl=angle --use-angle=swiftshader`）
5. `compose.mjs` で ogp.png / thumb.png を作る
   `node .dev/compose.mjs <url> games/<id> "<タイトル>" "<説明<br>2行目>" <背景色> <文字色> <アクセント> "" "" '<操作列JSON>' <サムネの縦位置0-1>`
   （`PHONE=画像` を付けるとその画像を使う。`DPR=1` で等倍撮影）
6. ハブ `index.html` の `GAMES` に1件足し、README の表にも足す
7. ハブのスクリプトを `node --check` で構文チェック（カンマ抜けで一覧が消えた前例あり）
8. exclude から外して commit → push → 本番 https://asobi.enludus.com/ で表示を確認
