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
- **コンポーネント完全独立**: すべてのコンポーネントは各イベントの`_components/`内に定義。共有コンポーネントディレクトリは存在しない

### グローバルリソース

| 場所                       | 用途                                        |
| -------------------------- | ------------------------------------------- |
| `src/layouts/Layout.astro` | 共通HTML構造（全ページで使用）              |
| `src/styles/palette.css`   | カラートークン定義                          |
| `src/styles/global.css`    | テーマ変数・リセットスタイル・`.viewport`   |
| `src/types/`               | 共通型定義（API型等）                       |
| `src/scripts/`             | 共通スクリプト（uploadImages等）            |

### スタイル構成

| ファイル | 役割 |
|---------|------|
| `palette.css` | カラートークン（`--gray-0`〜`--gray-9`, `--blue-2`〜`--blue-8` 等） |
| `global.css` | テーマ変数（`--brand`, `--surface` 等） + リセットスタイル |
| `Layout.astro` | HTML構造のみ（スタイルなし） |
| `variables.css` | テーマ変数の上書き（配色カスタマイズ） |
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

### カラーパレット

`src/styles/palette.css` にプロジェクト共通のカラートークンを定義:

- **Gray**: `--gray-0`(最も明るい) 〜 `--gray-9`(最も暗い) の10段階
- **色**: 各色4段階（`--{color}-2`, `--{color}-4`, `--{color}-6`, `--{color}-8`）
- 色の種類: blue, green, red, orange, violet, pink, indigo

### テーマ変数

`global.css` の `:root` で6つのテーマ変数を定義:

| 変数 | 用途 | デフォルト値 |
|------|------|-------------|
| `--brand` | メインカラー | `var(--blue-6)` |
| `--surface` | 背景色 | `var(--gray-0)` |
| `--text-1` | 本文テキスト | `var(--gray-9)` |
| `--text-2` | サブテキスト | `var(--gray-6)` |
| `--line` | ボーダー・区切り線 | `var(--gray-4)` |
| `--font-serif` | セリフフォント | Times New Roman系 |

- **イベント固有の上書き**: `variables.css`には上書きする変数のみ定義（デフォルトと同じ値は不要）
- **追加の色**: コンポーネント内でパレットの色を直接参照（`var(--green-6)`等）。テーマ変数を増やさない

### アクセシビリティ

- アニメーションには`prefers-reduced-motion`対応を追加する
- CSSアニメーション: `@media (prefers-reduced-motion: reduce)`で無効化
- JSアニメーション: `window.matchMedia("(prefers-reduced-motion: reduce)").matches`でスキップ

### アイコン

`@iconify-json/mdi`を`astro-icon`経由で使用（例：`mdi:menu`、`mdi:photo-camera`）

## 新規イベント追加

`/create-event` skillを使用。

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
// src/types/api.ts - API関連の型定義
export type UploadImagesRequest = {
  path: string;
  images: File[];
};
```
