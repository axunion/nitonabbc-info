# Nitonabbc Info

Astroフレームワークを用いた静的イベント情報サイトです。

## 概要

イベント情報・スケジュール・会場案内などを提供します。各イベントは `src/pages/{year}/{month}/` 配下の独立したディレクトリで管理され、イベント間で互いに影響しない構成になっています。Cloudflare Pages でホスティングし、`main` ブランチへの push で自動デプロイされます。

## 技術スタック

- [Astro](https://astro.build/) 6.x
- [astro-icon](https://github.com/natemoo-re/astro-icon) + [@iconify-json/mdi](https://iconify.design/)
- [Biome](https://biomejs.dev/)（lint / format）
- [lefthook](https://github.com/evilmartians/lefthook)（pre-commit）

## 動作要件

- Node.js 24.16.0 以上
- pnpm 11.2.2 以上

## セットアップ

```bash
pnpm install        # lefthook の pre-commit フックも自動でインストールされます
```

バックエンドと連携するページを開発する場合は、プロジェクトルートに `.env` を作成して[環境変数](#環境変数)を設定してください。

```bash
pnpm run dev        # localhost:4321 で開発サーバー起動
```

開発サーバー起動中は `http://localhost:4321/` に全ページのリンク一覧が表示されます（本番には含まれません）。

## コマンド

```bash
pnpm run dev        # 開発サーバー起動（localhost:4321）
pnpm run build      # 本番ビルド
pnpm run preview    # ビルド結果のプレビュー
pnpm run check      # Biome リント + 型チェック
pnpm run fix        # Biome で自動修正
pnpm run astro      # Astro CLI への直接呼び出し
```

## ディレクトリ構成

```
src/
├── components/        # 共有の薄いラッパーのみ（例: MapFrame）
├── dev/               # 開発時のみ有効なページインデックス
├── layouts/           # 共通レイアウト（Layout.astro）
├── pages/             # ページ（イベントごとに独立）
│   ├── 404.html
│   └── {year}/{month}/
│       ├── _assets/       # 画像・PDF など（このイベント専用）
│       ├── _components/   # イベント固有コンポーネント
│       ├── _config/       # エンドポイントなどイベント固有設定
│       ├── _scripts/      # イベント固有スクリプト
│       ├── _styles/       # variables.css（テーマ変数の上書き）
│       └── index.astro
├── scripts/           # 共有スクリプト（uploadImages, fetchFileList, sanitizeFileName）
├── styles/            # グローバル CSS（palette.css, global.css）
└── types/             # 共有型定義
```

`_` で始まるディレクトリは Astro のルーティング対象外です。

## アーキテクチャ: ページ独立の方針

このプロジェクトの中心となる設計方針は **「イベントページ同士が互いに影響しない」** ことです。

- **イベントごとに完結する**: そのイベントで使うコンポーネント・アセット・設定・スクリプト・スタイルはすべて `src/pages/{year}/{month}/` 配下に閉じ込める
- **共有はレイアウトとパレットのみ**: `Layout.astro`, `palette.css`, `global.css` だけが全イベント共通の基盤。これらへの変更は全イベントに波及するため慎重に行う
- **`src/components/` は最小限**: イベント間で確実に分岐しない薄いラッパー（`MapFrame` など）に限る。迷ったらページローカルに置く
- **`src/scripts/` はイベント設定に依存しない**: エンドポイント URL などイベント固有の値は、各イベントの `_config/` から引数として渡す
- **配色は `_styles/variables.css` の上書きで**: デフォルトのテーマ変数（`--brand`, `--surface` など）と異なる値のみを上書きする。新たなテーマ変数は追加しない

この方針により、新しいイベントを追加・修正しても過去イベントのページに影響しません。

以下のいずれかが発生した場合に、この方針の見直しを検討する：

- イベント数が 15〜20 を超え、`/create-event` の雛形だけでは追いつかなくなった
- 同一コンポーネントを 3 イベント以上で「全く同じまま」修正する事案が繰り返し発生した
- 異なる Astro バージョンや異なるデプロイターゲットを必要とするイベントが現れた
- 定型告知ページ（構造が一定）が四半期に複数生まれるようになった

詳細な CSS / アクセシビリティ規約は `CLAUDE.md` および `.claude/rules/` を参照してください。

## 環境変数

プロジェクトルートに `.env` を作成して設定します。`PUBLIC_` プレフィックスにより、Astro の仕様でクライアントにも公開されます。

| 変数名 | 必須 | 用途 | 例 |
| --- | --- | --- | --- |
| `PUBLIC_MEDIA_PATH` | はい | メディアファイル配信ベース URL | `https://media.example.com/` |
| `PUBLIC_MEDIA_API` | はい | メディア API ベース URL | `https://api.example.com/media/` |

- いずれも有効な URL である必要があります。`_config/endpoints.ts` のロード時にバリデーションされ、不正値ならビルドが失敗します
- バックエンド連携のないイベントだけを扱う場合は未設定でも構いません
- **本番デプロイ時**: Cloudflare Pages のプロジェクト設定（Settings → Environment variables）に同名で登録してください

## 新規イベントの追加

Claude Code の `/create-event` スキルを使用して対話的に作成します。

## デプロイ

`main` ブランチへの push で Cloudflare Pages に自動ビルド・デプロイされます。

- ビルドコマンド: `pnpm run build`
- 出力ディレクトリ: `dist/`
- 環境変数は Cloudflare Pages のプロジェクト設定に登録してください（上記「環境変数」参照）

## 開発時の補助

pre-commit フック（lefthook）により、ステージングされたファイルに対して Biome の自動修正と `astro check` が実行されます。手動で実行する場合は `pnpm run check` / `pnpm run fix` を使用してください。
