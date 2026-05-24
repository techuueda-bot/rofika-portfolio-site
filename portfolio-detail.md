# RO FIKA

![RO FIKA Hero](screenshots/rofika-01-hero.png)

## Overview

RO FIKAは、夏の午後に少し立ち止まるような時間をテーマにした、架空カフェの1ページブランドサイトです。

店舗情報を並べるだけではなく、「その場所に流れていそうな空気」をWeb上で表現することを意識して制作しました。

## Concept

冷たいドリンク、焼き菓子、窓辺の光、淡い色、英字タイポグラフィを組み合わせ、夏の午後に少し呼吸をゆるめるようなFIKAの時間を表現しています。

RO FIKAでは、カフェを実用的な情報の集まりとしてではなく、立ち止まるための静かな体験として設計しました。

## Design

HeroではRO FIKAの英字を大きく配置し、第一印象として軽やかなブランド感を作っています。Conceptでは小窓モチーフを使い、夏の光や風が通るような印象を加えました。

余白、小窓モチーフ、淡いブルーやレモン色、英字タイポグラフィの強弱によって、明るく涼しい空気感を作っています。

![Concept Window](screenshots/rofika-02-concept-window.png)

## Sections

Heroは、RO FIKAの第一印象を伝えるセクションです。大きな英字と小窓ビジュアルで、架空ブランドの明るさと涼しさを見せています。

Conceptは、短いコピーとWindow Sceneで世界観を伝えるセクションです。窓辺の光や風の気配を、写真ではなく淡い色面と線で表現しています。

Menuは、単なる商品一覧ではなく、冷たい飲みものと焼き菓子がある午後の時間を想像できる編集面として設計しました。

![Menu](screenshots/rofika-03-menu.png)

FIKA Timeでは、drink / taste / look outside / stay という短い言葉で、カフェで過ごす行為をシンプルに表現しました。

Galleryは、現時点では写真差し替え前提の軽い骨組みとして制作しています。写真がない段階で作り込みすぎるとプレースホルダー感が強くなるため、淡い色面や余白で「午後の断片」を感じられる程度に抑えました。

![FIKA Time and Gallery](screenshots/rofika-04-fika-gallery.png)

Footerは、架空ブランドとしての余韻を残す締めのセクションです。

![Footer](screenshots/rofika-05-footer.png)

## Reference

参考にしたサイトからは、見た目をそのまま真似るのではなく、役割を抽出しています。

せきがはら人間村からは、余白と短い言葉で世界観を作る力を参考にしました。

BLUE NOTE PLACEからは、英字タイポグラフィと体験としての飲食設計を参考にしました。

Chevron Coffeeからは、写真・文字・余白がなめらかにつながるスクロール感を参考にしました。

## Implementation

HTML / CSS / JavaScriptで実装した、1ページ構成の静的サイトです。

CSS中心で淡い色面、小窓モチーフ、細い線、グラデーションを作り、重たいライブラリは追加していません。

スクロール演出は一部の要素に限定し、Hero / Concept / Menu / FIKA Timeに軽く適用しています。

Galleryにスクロール演出をかけるとブラウザが不安定になる可能性があったため、Galleryはdata-driftの対象から外しています。動きを増やすことよりも、安定性と見やすさを優先しました。

レスポンシブ対応では、スマホでも文字がはみ出さないようにサイズと余白を調整し、Galleryは2列で表示しています。

## Responsive View

![Mobile Hero](screenshots/rofika-mobile-01-hero.png)

![Mobile Gallery](screenshots/rofika-mobile-02-gallery.png)

## Learning

この作品では、架空ブランドのコンセプト設計、余白を活かした画面構成、英字と日本語のバランス、スマホでも破綻しない1ページサイト設計を見せることを目的にしています。

制作を通して、動きを増やせばよいわけではなく、安定性と見やすさを優先する判断も大切だと学びました。

また、参考サイトは見た目を真似るのではなく、役割として分解することで、自分の表現に変換しやすくなると感じました。
