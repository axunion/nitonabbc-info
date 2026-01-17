# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

Astroベースの静的Webサイト。イベント情報、スケジュール、写真アルバム、会場案内などを提供。Cloudflare Pagesでホスティングされ、mainブランチへのpushで自動デプロイ。

## コマンド

```bash
npm run dev          # 開発サーバー起動（localhost:4321）
npm run build        # 型チェック + 本番ビルド
npm run preview      # ビルド結果のプレビュー
npm run lint         # ESLint実行
npm run lint:fix     # ESLint自動修正
npm run format       # Prettier整形
npm run format:check # 整形チェック
```

## アーキテクチャ

### 設計原則：イベントディレクトリの独立性

**各イベントディレクトリ（`src/pages/{year}/{month}/`）は完全に独立した単位として扱う。**

- レイアウト、スタイル、コンポーネントはイベントごとに個別に定義する
- 他のイベントディレクトリのコードに依存しない
- 共通化よりも各イベントの独自性・柔軟性を優先する
- 過去のイベントを参考にしてよいが、コピーして独自に改変する

### イベントディレクトリ構成

```
src/pages/{year}/{month}/
├── _assets/           # 画像、PDF、navigation.json
├── _components/       # Layout.astro、Header、Footer、見出し等
├── _config/           # 設定ファイル（endpoints.ts等）
├── _scripts/          # イベント固有のTypeScript/JavaScript
├── _styles/
│   └── variables.css  # イベント固有のCSS変数（配色定義）
└── *.astro            # ページファイル
```

### グローバルリソース（共有利用可）

| 場所                       | 用途                                                   |
| -------------------------- | ------------------------------------------------------ |
| `src/layouts/Layout.astro` | ベースHTML構造（イベント固有Layoutがない場合に使用可） |
| `src/components/`          | 汎用UIパーツ（ButtonLink, MapFrame, TimeTable等）      |
| `src/styles/global.css`    | 基本リセット・CSS変数デフォルト値                      |

**使い分け**:

- グローバルコンポーネントは`@/components/`からインポートして使用可能
- イベント固有のレイアウト・スタイルを使いたい場合は`_components/Layout.astro`と`_styles/variables.css`を作成
- グローバルコンポーネントの配色はCSS変数で定義されており、イベント固有の`variables.css`で上書き可能

### テンプレート

新規イベント作成用のテンプレートが用意されています。

```
src/templates/event/
├── _assets/.gitkeep
├── _components/
│   └── Layout.astro      # テンプレートレイアウト
├── _scripts/.gitkeep
├── _styles/
│   └── variables.css     # CSS変数テンプレート（配色カスタマイズ用）
└── index.astro           # サンプルページ
```

### パスエイリアス

`@/*` → `./src/*`（tsconfig.jsonで設定）

## コード規約

| 項目                 | 言語                         |
| -------------------- | ---------------------------- |
| コミットメッセージ   | 英語                         |
| コードコメント       | 英語（自明なコメントは不要） |
| コンソール出力       | 英語                         |
| チャット・レスポンス | 日本語                       |

### スタイリング

- イベント固有の配色は`_styles/variables.css`で定義
- コンポーネント内でスコープ付き`<style>`ブロックを使用
- CSSフレームワークは未使用
- グローバルコンポーネントはCSS変数を使用しており、イベント側で上書き可能

### アイコン

`@iconify-json/mdi`を`astro-icon`経由で使用（例：`mdi:menu`、`mdi:photo-camera`）

## 新規イベント追加手順

1. `src/templates/event/`を`src/pages/{year}/{month}/`にコピー
2. `_styles/variables.css`でイベントの配色をカスタマイズ
3. `_components/Layout.astro`を必要に応じて調整
4. `_assets/`に画像、PDF、navigation.json等を配置
5. `index.astro`を編集してイベント内容を作成
6. 必要に応じて追加のページやコンポーネントを作成

**インポートパターン**:

```astro
---
// イベント固有のレイアウト
import Layout from "./_components/Layout.astro";

// グローバルコンポーネント（必要に応じて使用）
import ButtonLink from "@/components/ButtonLink.astro";
import MapFrame from "@/components/MapFrame.astro";
---
```

**ポイント**: テンプレートまたは過去のイベントからコピーして改変するのが効率的。グローバルコンポーネントは併用可能だが、レイアウトとスタイルはイベント固有のものを使用する。
