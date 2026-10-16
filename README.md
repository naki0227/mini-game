# あそび横丁

ログインなし・インストールなしで、ブラウザですぐ遊べるミニゲーム集です。
ビルド不要の静的サイトなので、GitHub Pages にそのまま置いて公開できます。

- 公開URL（GitHub Pages 有効化後）: https://naki0227.github.io/mini-game/

## ゲーム

| # | ゲーム | 内容 |
|---|---|---|
| 1 | [にぎり積み](games/nigiri/) | 揺れる箸からお寿司を一貫ずつ落として積み上げる物理ゲーム |

## 構成

```
index.html            ハブ（ゲーム一覧）
games/<id>/index.html 各ゲーム（1ファイル完結）
games/<id>/ogp.png    Xなどでシェアされたときのカード画像（1200×630）
games/<id>/thumb.png  ハブに並べるサムネイル（4:3）
```

## 記録の保存

ハイスコアなどはサーバーに送らず、各ブラウザの `localStorage` に保存しています。
キーはゲームごとに分けます（例: にぎり積みは `nigiri-tsumi:v1`）。
ハブも同じオリジンなので、その記録を読んで「あなたの最高」を表示します。

## ゲームを追加する

1. `games/<id>/index.html` を作る（外部スクリプトは CDN から読み込み、他は1ファイルに収める）
2. `games/<id>/ogp.png`（1200×630）と `thumb.png`（4:3）を置く
3. ゲーム内の OGP メタタグとシェア用URLを `https://naki0227.github.io/mini-game/games/<id>/` にする
4. ハブの `index.html` にある `GAMES` 配列に1件足す

## ローカルで動かす

```sh
python3 -m http.server 8000
# http://localhost:8000/ を開く
```

## 公開（GitHub Pages）

リポジトリの Settings → Pages で、Source を「Deploy from a branch」、Branch を `main` / `(root)` にして保存します。
