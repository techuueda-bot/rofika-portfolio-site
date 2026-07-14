# RO FIKA — Renewal

架空の小さな夏のカフェ「RO FIKA」のサイト。
「窓辺の光」をモーションの主役にした、ショーケース仕様の1ページ構成。

## Live Site

https://techuueda-bot.github.io/rofika-portfolio-site/

## コンセプト

**「光を、動かす。」**
淡い生成り×深緑×余白の世界観に、光そのものをスクロールで移ろわせる演出を加えている。
FIKA TIMEセクションでは、スクロールに合わせて光の色温度が午後(白金)→夕方(琥珀)へ変化し、時計が 1:00 PM → 5:10 PM へ進む。

## 構成(幕割り)

1. ローディング — 窓に光が満ちて開演(5秒タイムアウト保険付き)
2. ヒーロー — 全面タイポ+背面にWebGLの木漏れ日
3. Concept — 文字点灯(スクロール同期で1文字ずつ照らされる)
4. Menu — 左sticky見出し+光マーカーのホバー
5. FIKA TIME — ★最大の見せ場。光の移ろい+時計
6. Gallery — 横スクロールギャラリー(pin+scrub)
7. Info — 回転テキストリング+Instagram導線

## 技術

- HTML / CSS / JavaScript(ビルド不要の静的サイト)
- CDN: GSAP 3.12.5 + ScrollTrigger / Three.js r128 / Lenis 1.1.13 / Google Fonts
  **→ オフラインでは動きません。**
- WebGL非対応環境は `body.no-webgl` でCSSグラデーションに自動フォールバック
- reduced-motion環境では「アニメーションを停止する」ボタンを表示(押すと静的表示に切替)

## どこを触れば何が変わるか

| 変えたいもの | 場所 |
|---|---|
| 色(生成り・深緑・光の色) | `assets/css/style.css` の `:root`(先頭のトークン) |
| メニューの品目・価格 | `index.html` の `<!-- 3. Menu -->` セクション |
| 営業時間などの店舗情報 | `index.html` の `<!-- 6. Info -->` セクション |
| FIKA TIMEの時刻範囲 | `assets/js/showcase.js` の `START` / `END` |
| 光の強さ・色 | `assets/js/showcase.js` の fragmentShader 内 `noon` / `dusk` / `alpha` |
| 文字点灯のコピー | `index.html` の `data-illuminate` 要素(`<br>`区切りで行になる) |
| グレインの強さ | `assets/css/style.css` の `.grain { opacity }` |
| ローディングの雰囲気 | `.loader` 一式(CSS)と `initLoader()`(main.js) |

## ローカル確認

```bash
npx http-server . -p 8823
# → http://localhost:8823
```

## 市場検証と更新方針

20歳前後の女性を主対象に、RO FIKAの売りを「ひとりの午後を45分だけ整える、窓辺のFika習慣」と定義しました。主役商品、価格、来店前の情報、Instagramへの導線まで含む判断根拠は [strategy.md](strategy.md) にまとめています。

サイトには、以下の季節メニュー画像を追加しています。

- `assets/img/menu/light-set-v2.webp` — 光のセットの主役写真
- `assets/img/menu/cold-brew-tea.webp` — 水出しのお茶の写真
- `assets/img/menu/blueberry-crumble.webp` — ブルーベリークランブルの写真
- `assets/img/menu/butter-scone.webp` — バタースコーンの写真
- `assets/img/menu/lemon-iced-coffee.webp`
- `assets/img/menu/berry-milk-soda.webp`
- `assets/img/menu/lemon-cardamom-cake.webp`

「光のセット」の枠は、商品の選択画面ではなく、セットの完成形と内容を伝える案内です。スマホでも横スクロールは使わず、`Drink` と `Bake` の2枚を少し重ねた静的な構成で、対象メニューへの導線を一つだけ置いています。全6品の写真・説明は、その下の通常メニューで確認できます。

## 品質メモ

- 写真は2倍解像度相当で書き出し済み
- 文字コードは全ファイルUTF-8(BOMなし)
- GitHub Pagesでは `.nojekyll` により、静的HTML/CSS/JSをそのまま公開
