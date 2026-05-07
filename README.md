# Nitonabbc Info

Astroフレームワークを用いたイベント情報Webサイトです。

## プロジェクト概要

- イベント情報、スケジュール、写真アルバム、会場案内などを提供する静的Webサイト
- 各イベントは `src/pages/{year}/{month}/` ディレクトリで独立して管理
- Cloudflare Pagesでホスティング（mainブランチへのpushで自動デプロイ）

## セットアップ

```bash
pnpm install
pnpm run dev    # localhost:4321 で開発サーバー起動
```

## コマンド

```bash
pnpm run dev      # 開発サーバー起動（localhost:4321）
pnpm run build    # 本番ビルド
pnpm run preview  # ビルド結果のプレビュー
pnpm run check    # Biomeリント + 型チェック
pnpm run fix      # Biomeで自動修正
```

## ディレクトリ構成

```
src/
├── layouts/           # ベースレイアウト
├── pages/             # ページ（イベントごとに独立）
│   └── {year}/{month}/
│       ├── _assets/       # 画像・PDFなど
│       ├── _components/   # イベント固有コンポーネント
│       ├── _styles/       # variables.css（配色カスタマイズ）
│       └── index.astro
├── scripts/           # 共通スクリプト
├── styles/            # グローバルCSS（palette.css, global.css）
└── types/             # 型定義
```

## 新規イベント追加

Claude Codeの `/create-event` スキルを使用して対話的に作成します。

## デプロイ

`main` ブランチへのpushでCloudflare Pagesに自動デプロイされます。

## 技術スタック

- [Astro](https://astro.build/)
- [astro-icon](https://github.com/natemoo-re/astro-icon) + [@iconify-json/mdi](https://iconify.design/)
- [Biome](https://biomejs.dev/)
