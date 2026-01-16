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

### ページ構成（時系列管理）

```
src/pages/{year}/{month}/
├── _assets/           # 画像、PDF、navigation.json、スタイル
├── _components/       # レイアウト、Header、Footer、見出し等すべて
├── _config/           # 設定ファイル（endpoints.ts等）
└── *.astro            # ページファイル
```

### グローバルリソース（参考・補助用）

| 場所 | 用途 |
|------|------|
| `src/layouts/Layout.astro` | 最小限のベースHTML構造（必要に応じて使用） |
| `src/components/` | 汎用UIパーツ（必要な場合のみ利用可） |
| `src/styles/global.css` | 基本リセット程度（イベント固有スタイルは`_assets/`に配置） |

**注意**: グローバルリソースの使用は任意。イベントごとに独自のレイアウトやスタイルを持つことを推奨。

### パスエイリアス

`@/*` → `./src/*`（tsconfig.jsonで設定）

## コード規約

| 項目 | 言語 |
|------|------|
| コミットメッセージ | 英語 |
| コードコメント | 英語（自明なコメントは不要） |
| コンソール出力 | 英語 |
| チャット・レスポンス | 日本語 |

### スタイリング

- イベント固有のスタイルは`_assets/`または`_components/`内に配置
- コンポーネント内でスコープ付き`<style>`ブロックを使用
- CSSフレームワークは未使用
- `src/styles/global.css`は基本リセット程度（依存しない設計を推奨）

### アイコン

`@iconify-json/mdi`を`astro-icon`経由で使用（例：`mdi:menu`、`mdi:photo-camera`）

## 新規イベント追加手順

1. `src/pages/{year}/{month}/`ディレクトリを作成
2. `_components/`にレイアウト、Header、Footer、見出しコンポーネント等を作成
3. `_assets/`にnavigation.json、画像、イベント固有のスタイルを配置
4. 必要に応じて`_config/`に設定ファイルを追加
5. ページファイル（`.astro`）を作成

**ポイント**: 過去のイベントからコピーして改変するのが効率的。ただし、グローバルリソースへの依存は最小限に抑え、イベント内で完結させる。
