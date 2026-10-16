# あそび横丁

ログインなし・インストールなしで、ブラウザですぐ遊べるミニゲーム集です。
ビルド不要の静的サイトで、Cloudflare Pages から配信しています。

- 公開URL: https://asobi.enludus.com/

## ゲーム

| # | ゲーム | 内容 |
|---|---|---|
| 1 | [にぎり積み](games/nigiri/) | 揺れる箸からお寿司を一貫ずつ落として積み上げる物理ゲーム |
| 2 | [連打おみくじ](games/omikuji/) | タップ1回で何回でも引けるおみくじ。運勢9種の図鑑つき |

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
3. ゲーム内の OGP メタタグとシェア用URLを `https://asobi.enludus.com/games/<id>/` にする
4. ハブの `index.html` にある `GAMES` 配列に1件足す

## ローカルで動かす

```sh
python3 -m http.server 8000
# http://localhost:8000/ を開く
```

## 公開（Cloudflare Pages）

`main` に push すると Cloudflare Pages が自動でデプロイします。

初回だけの設定:

1. Cloudflare ダッシュボード → Workers & Pages → Create → Pages → Connect to Git で `naki0227/mini-game` を選ぶ
2. Production branch は `main`、Framework preset は `None`、Build command は空、Build output directory は `/`
3. デプロイ後、プロジェクトの Custom domains で `asobi.enludus.com` を追加（DNS の CNAME は自動で作られる）
