# Nitonabbc Info

Astroフレームワークを用いたイベント情報Webサイトです。

## プロジェクト概要

- イベント情報、スケジュール、写真アルバム、会場案内などを提供する静的Webサイト
- 各イベントは `src/pages/{year}/{month}/` ディレクトリで独立して管理
- Cloudflare Pagesでホスティング（mainブランチへのpushで自動デプロイ）

## ディレクトリ構成

```
src/
├── components/        # 汎用UIコンポーネント
├── layouts/           # ベースレイアウト
├── pages/             # ページ（イベントごとに独立）
│   └── {year}/{month}/
│       ├── _assets/       # 画像、PDF等
│       ├── _components/   # イベント固有コンポーネント
│       ├── _config/       # 設定ファイル
│       ├── _scripts/      # イベント固有スクリプト
│       ├── _styles/       # CSS変数（配色定義）
│       └── *.astro        # ページファイル
├── scripts/           # 共通スクリプト
├── styles/            # グローバルCSS
├── templates/         # 新規イベント用テンプレート
└── types/             # 型定義
```

## コマンド

```bash
pnpm install         # 依存パッケージのインストール
pnpm run dev         # 開発サーバー起動（localhost:4321）
pnpm run build       # 型チェック + 本番ビルド
pnpm run preview     # ビルド結果のプレビュー
pnpm run check       # Biomeでリント・フォーマットチェック
pnpm run check:write # Biomeで自動修正
```

## 新規イベント追加

1. `src/templates/event/` を `src/pages/{year}/{month}/` にコピー
2. `_styles/variables.css` でイベントの配色をカスタマイズ
3. `_components/Layout.astro` を必要に応じて調整
4. `_assets/` に画像、PDF等を配置
5. ページを作成・編集

## 技術スタック

- [Astro](https://astro.build/)
- [astro-icon](https://github.com/natemoo-re/astro-icon) + [@iconify-json/mdi](https://iconify.design/)
