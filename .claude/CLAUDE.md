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

### 設計原則

- **共通Layout + イベント固有スタイル**: 全ページで共通の`Layout.astro`を使用し、イベント固有の配色は`variables.css`で定義
- **コンポーネントの独立性**: イベント固有のコンポーネント（Header、Footer等）は各イベントディレクトリ内で定義

### イベントディレクトリ構成

必要なディレクトリ・ファイルのみ作成する。

```
src/pages/{year}/{month}/
├── _assets/           # 画像、PDF、navigation.json（必要な場合）
├── _components/       # Header、Footer、見出し等（必要な場合）
├── _config/           # 設定ファイル（必要な場合）
├── _scripts/          # イベント固有スクリプト（必要な場合）
├── _styles/
│   └── variables.css  # CSS変数の上書き（テーマ変更時のみ）
└── *.astro            # ページファイル
```

### グローバルリソース

| 場所                       | 用途                                             |
| -------------------------- | ------------------------------------------------ |
| `src/layouts/Layout.astro` | 共通HTML構造（全ページで使用）                   |
| `src/components/`          | 汎用UIパーツ（ButtonLink, MapFrame, TimeTable等）|
| `src/styles/global.css`    | ベーススタイル・CSS変数デフォルト値・`.viewport` |
| `src/types/`               | 共通型定義（LinkTag等）                          |
| `src/scripts/`             | 共通スクリプト（uploadImages等）                 |

### スタイル構成

| ファイル | 役割 |
|---------|------|
| `global.css` | ベーススタイル（タグ + `.viewport`クラス） |
| `Layout.astro` | HTML構造のみ（スタイルなし） |
| `variables.css` | CSS変数の上書き（配色カスタマイズ） |
| ページの`<style is:global>` | `.viewport`スタイルの上書き（暗い背景など） |

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

### CSS変数

- **デフォルト値**: `global.css`の`:root`で全変数を定義
- **イベント固有の上書き**: `variables.css`には上書きする変数のみ定義（デフォルトと同じ値は不要）
- **フォールバック**: `global.css`で定義済みの変数にはフォールバック不要（`var(--color-primary)`）

### アクセシビリティ

- アニメーションには`prefers-reduced-motion`対応を追加する
- CSSアニメーション: `@media (prefers-reduced-motion: reduce)`で無効化
- JSアニメーション: `window.matchMedia("(prefers-reduced-motion: reduce)").matches`でスキップ

### アイコン

`@iconify-json/mdi`を`astro-icon`経由で使用（例：`mdi:menu`、`mdi:photo-camera`）

## 新規イベント追加手順

1. 過去のイベント（`src/pages/2024/09/`等）を参考に`src/pages/{year}/{month}/index.astro`を作成
2. 必要に応じてディレクトリを追加:
   - `_assets/`: 画像、PDF等
   - `_components/`: イベント固有コンポーネント
   - `_styles/variables.css`: テーマをカスタマイズする場合のみ

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

複数ファイルで共有する型は`src/types/`に定義する。

```typescript
// src/types/layout.ts
export type LinkTag = {
  rel: string;
  href: string;
  type?: string;
  sizes?: string;
  crossorigin?: string;
};

// Layout.astroでインポート
import type { LinkTag } from "@/types/layout";
```
