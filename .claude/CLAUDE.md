# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

Astroベースの静的Webサイト。イベント情報、スケジュール、写真アルバム、会場案内などを提供。Cloudflare Pagesでホスティングされ、mainブランチへのpushで自動デプロイ。

## コマンド

```bash
pnpm run dev          # 開発サーバー起動（localhost:4321）
pnpm run build        # 型チェック + 本番ビルド
pnpm run preview      # ビルド結果のプレビュー
pnpm run check        # Biomeでリント・フォーマットチェック
pnpm run check:write  # Biomeで自動修正
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
| `src/types/`               | 共通型定義（LinkTag等）                                |
| `src/scripts/`             | 共通スクリプト（uploadImages等）                       |

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
- CSS変数にはフォールバック値を設定する（例：`var(--color-primary, #3b82f6)`）

### アクセシビリティ

- アニメーションには`prefers-reduced-motion`対応を追加する
- CSSアニメーション: `@media (prefers-reduced-motion: reduce)`で無効化
- JSアニメーション: `window.matchMedia("(prefers-reduced-motion: reduce)").matches`でスキップ

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

## 実装パターン

### 共通スクリプトとイベント固有設定

共通スクリプト（`src/scripts/`）はイベント固有の設定に依存しない。設定値は呼び出し元から引数で渡す。

```typescript
// src/scripts/uploadImages.ts - エンドポイントを引数で受け取る
export const uploadImages = async (data: UploadImagesRequest, endpoint: string) => { ... }

// イベント側で呼び出し時にエンドポイントを渡す
import { ENDPOINT_UPLOAD_IMAGES } from "../_config/endpoints";
const resp = await uploadImages(data, ENDPOINT_UPLOAD_IMAGES);
```

### 共通型定義

Layoutで使用する型など、複数ファイルで共有する型は`src/types/`に定義する。

```typescript
// src/types/layout.ts
export type LinkTag = {
  rel: string;
  href: string;
  type?: string;
  sizes?: string;
  crossorigin?: string;
};

// 各Layoutでインポート
import type { LinkTag } from "@/types/layout";
```
