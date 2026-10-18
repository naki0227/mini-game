# あそび横丁 ゲーム共通仕様（エージェント向け作業メモ）

リポジトリ: /home/user/mini-game （静的サイト。https://asobi.enludus.com/ で Cloudflare Pages 配信）
参考実装（最初に必ず全部読んで構成・書き方を揃える）:
- /home/user/mini-game/games/nigiri/index.html （物理・Matter.js）
- /home/user/mini-game/games/oyu/index.html （長押し・Canvas）

## 必須
- 1ファイル完結: games/<id>/index.html のみ作る。<!doctype html><html lang="ja"> から書く完全なHTML。
  外部スクリプトは cdnjs.cloudflare.com の固定バージョンのみ（必要なときだけ）。フォントは Google Fonts。
  画像は使わず Canvas か CSS/インラインSVG で描く。
- <head> に参考実装と同じ形で title / description / og:type / og:title / og:description /
  og:url=https://asobi.enludus.com/games/<id>/ / og:image=https://asobi.enludus.com/games/<id>/ogp.png /
  twitter:card=summary_large_image / 絵文字favicon(data URI SVG) を入れる。
- スマホ縦持ち最優先（360〜430px幅）。PCでも遊べる（マウス・キーボード）。横スクロール禁止。
  touch-action: none、テキスト選択無効、safe-area-inset を考慮。
- 記録は localStorage のみ。キーは "<id>:v1"、値はJSON。読み書きは必ず try/catch。消えても動くこと。
- 結果画面に: スコア / 自己ベスト / 「新記録」バッジ / もう一回 / Xでシェア / 結果をコピー / 「← ほかのゲームを見る」(href="../../")。
  Xシェアは参考実装と同じく https://x.com/intent/post?text=..&url=..&hashtags=.. を <a target="_blank" rel="noopener"> の href に。
  gameUrl() も参考実装と同じロジック。シェア文は「絵文字1つ + ゲーム名 + 具体的な結果」。
- 「ワンポチで何回でも」: 結果が出たら画面のどこをタップしても / スペース・Enterでも即リトライ（ボタンやリンクの上を除く。
  結果表示直後0.4秒は誤タップ防止で無視）。ロードや演出で待たせない。
- タイトル画面は最初から「遊べる状態に見える」こと（背景にゲーム画面）。1タップで開始。
- 見た目: 題材に根ざした独自の世界観（配色・形）。フォントはシリーズ共通（Dela Gothic One + Zen Kaku Gothic New）。
  単一テーマでよいが背景色は明示。紫グラデ・ネオン・絵文字の多用など AI っぽい定番は避ける。
- 効果音は WebAudio で軽く（ユーザー操作後に開始）。prefers-reduced-motion で画面揺れ等を抑える。

## 確認（必須）
- Playwright で実際に操作してテスト:
  import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'; executablePath: '/opt/pw-browsers/chromium'
  ローカル配信は `cd /home/user/mini-game && python3 -m http.server <指定ポート>` を run_in_background で。
  終了時は `kill <PID>` で止める（pkill -f は自分のシェルごと殺すので使わない）。
- 400x800 で タイトル→プレイ→結果→即リトライ、pageerror なし、localStorage に記録、横スクロールなし を確認。
  スクリーンショットを撮って見た目を自分で確認し、おかしければ直す。人間が遊んで「ちょうどいい難しさ」になるよう、
  最初の1〜2回は誰でも成功でき、だんだん難しくなるカーブにする。
- スクショ・作業ファイルはリポジトリ外（/tmp/claude-0/-home-user/2e5218c4-2073-5378-aa3a-5d44fc1c3052/scratchpad/<id>/）。
- git commit / push はしない。games/<id>/index.html 以外は触らない。

## 最後に報告（短く）
1. ハブ用: タイトル / のれん文字（4〜5要素の配列）/ 一行説明（30字以内）/ localStorage JSON の形と、
   ハブの「あなたの最高」用の関数 `best: d => ... ? \`<b>..</b> ..\` : null` の実際のコード
2. 遊び方とスコアの仕組み
3. テストで確認したこと・できなかったこと
4. OGP撮影手順: 400x760 の画面で、Playwright の mouse.click / mouse.down / mouse.move / mouse.up / wait の
   具体的な座標とミリ秒の列で、見栄えのいい瞬間になる操作（そのまま再生できる形）

## 追加ルール: プレイ中もいつでもハブに戻れるボタン（全ゲーム共通・必須）
次の部品をそのまま入れること（見た目と挙動をシリーズで統一）。位置は既定で左下。HUDや操作ボタンと重なるなら、
重ならない角に `style` で移す（top/right など）。ゲームの入力に食われないこと（押してもゲームが反応しない）。
```html
<a class="hub-back" id="hubBack" href="/" aria-label="あそび横丁（ゲーム一覧）にもどる">← 横丁</a>
```
```css
.hub-back {
  position: fixed; z-index: 60;
  left: calc(env(safe-area-inset-left, 0px) + 10px); bottom: calc(env(safe-area-inset-bottom, 0px) + 10px);
  font: 700 12px/1 "Zen Kaku Gothic New", "Hiragino Sans", "Yu Gothic", sans-serif; letter-spacing: .04em;
  padding: 7px 11px; border-radius: 99px; text-decoration: none;
  background: rgba(20, 18, 24, .55); color: #fff; -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);
}
.hub-back:focus-visible { outline: 3px solid #e0a43a; outline-offset: 2px; }
```
```js
// ゲームの入力（画面タップ・ドラッグ）に伝わらないようにする
for (const ev of ['pointerdown', 'touchstart', 'mousedown']) document.getElementById('hubBack').addEventListener(ev, e => e.stopPropagation(), { passive: true });
```

## 追加ルール（2026-10-18〜 定期追加ぶん）
- **ハイスコアを目指せる形に限る**。次のどちらか:
  - ミスしなかったら続く（連続・何段・何個・何m）→ 失敗した時点で終わり、記録は最高連続
  - 1回勝負でどれだけ飛ばせたか（距離・高さ・回数）→ 記録は最高記録
- **基本は3D**（three.js@0.160.0 を cdn.jsdelivr.net から ES module。物理が要るなら @dimforge/rapier3d-compat@0.12.0）。
  2Dの方が明らかに気持ちいい題材だけ2Dでよい。参考: games/catch（3D物理）、games/takoyaki（3D）。
- 当たり判定・成功判定は物理の結果で決める（「点が通ったら成功」のようなズルはしない）。
- 1投目・1回目は誰でもそこそこ成功し、だんだん難しくなるカーブ。ボットや物理シミュレーションで成功率を測って報告する。
- 耳に痛い高音（2kHz以上のノイズや高い音の連打）は使わない。
- スマホで重くならないこと（影は控えめ、ポリゴン少なめ）。
