# RO FIKA

RO FIKA is a fictional one-page brand site for a summer cafe.

## Live Site

https://techuueda-bot.github.io/rofika-portfolio-site/

## Overview

RO FIKAは、架空カフェを題材にした1ページ構成のブランドサイトです。
夏の午後に少し立ち止まるような、軽くて余白のあるカフェ体験をWeb上で表現することを目的に制作しました。

## Portfolio Copy

余白と小窓モチーフで設計した、軽やかなFIKAサイト

## Concept

A small pause in a summer afternoon.

夏の午後、
冷たいドリンクと焼き菓子をそばに置いて、
少しだけ呼吸をゆるめるためのFIKA。

## Purpose

店舗情報やメニューを並べるだけではなく、余白、英字タイポグラフィ、小窓モチーフ、淡い色、軽いスクロール演出を組み合わせて、架空ブランドの空気感を設計することを目的にしました。

## Features

- 小窓モチーフによる「窓辺の光」の表現
- ミルクホワイト、淡いブルー、薄いレモン、ベージュを中心にした配色
- 大きな英字タイポグラフィと短い日本語コピーの組み合わせ
- Menuを商品一覧ではなく、カフェ体験を補強する編集面として設計
- FIKA Timeで「飲む、食べる、眺める、少し休む」という時間の流れを表現
- Galleryは写真差し替え前提の軽い骨組みとして設計

## Sections

1. Hero
2. Concept + Window Scene
3. Menu
4. FIKA Time
5. Gallery
6. Footer

## Implementation

- HTML / CSS / JavaScript
- 1ページ完結の縦スクロール構成
- CSS中心の軽いビジュアル表現
- 重たいライブラリは不使用
- スクロール演出は一部要素に限定
- Galleryは安定性を優先し、`data-drift` の対象から除外
- `prefers-reduced-motion` に対応
- スマホでは文字サイズ、余白、Galleryの2列表示を調整

## Screenshots

### Hero

![RO FIKA Hero](screenshots/rofika-01-hero.png)

### Concept + Window Scene

![Concept Window](screenshots/rofika-02-concept-window.png)

### Menu

![Menu](screenshots/rofika-03-menu.png)

### FIKA Time + Gallery

![FIKA Time and Gallery](screenshots/rofika-04-fika-gallery.png)

### Footer

![Footer](screenshots/rofika-05-footer.png)

### Mobile View

![Mobile Hero](screenshots/rofika-mobile-01-hero.png)

![Mobile Gallery](screenshots/rofika-mobile-02-gallery.png)

## Accessibility and Quality Checks

- `h1` はHeroに1つ
- 各セクションは `h2` で整理
- Menu内は `h3` を使用
- Skip linkあり
- Galleryは後から画像altへ移せる `data-alt` 構造あり
- 横スクロールなし
- Footer最下部までスクロール確認済み
- コンソールエラーなし
- Chromeクラッシュなし
- Gallery内 `data-drift` は0

## Learning

Galleryにも既存のスクロール演出を適用するとブラウザが不安定になる可能性があったため、Galleryは `data-drift` の対象から外しました。
動きを増やすことよりも、安定性と見やすさを優先する判断を大切にしています。

また、参考サイトは見た目をそのまま真似るのではなく、余白、英字タイポグラフィ、スクロールの気持ちよさといった役割として分解し、RO FIKAの表現へ変換しました。

## Future Improvements

- 実写真を追加する
- 写真の色味を低彩度かつ明るめに統一する
- 窓辺、グラス、焼き菓子、手元、夏の光を中心に写真を選ぶ
- Galleryの写真差し替え後、余白と色味を再調整する
