# Nitonabbc Info

このリポジトリは、Astroフレームワークを用いて構築されたWebサイトのソースコードです。

## 🚀 プロジェクト概要

- イベントや活動情報、会場案内、スケジュール、写真アルバムなどを提供する静的Webサイトです。
- ページは `src/pages/year/month/` のように、年と月ごとにディレクトリ分けして整理されています。
- 画像やPDFなどの静的アセットは `src/assets/` および `public/` 配下に配置されています。
- 再利用可能なUIコンポーネントは `src/components/` 配下にまとめられています。

## 📁 ディレクトリ構成

```
/
├── public/                # 静的ファイル（favicon、画像など）
├── src/
│   ├── assets/            # 画像・スクリプト等
│   ├── components/        # Astroコンポーネント
│   ├── constants/         # 定数
│   ├── layouts/           # レイアウトコンポーネント
│   ├── pages/             # 各ページ（年・月ごとに整理）
│   ├── scripts/           # 補助スクリプト
│   ├── styles/            # グローバルCSS
│   └── types/             # 型定義
```

## 🧑‍💻 開発・ビルド方法

1. 依存パッケージのインストール

   ```sh
   npm install
   ```

2. 開発サーバーの起動

   ```sh
   npm run dev
   # http://localhost:4321 で確認できます
   ```

3. 本番ビルド

   ```sh
   npm run build
   # dist/ に静的ファイルが出力されます
   ```

4. ビルドのプレビュー

   ```sh
   npm run preview
   ```

## 主要コマンド一覧

| コマンド        | 説明                               |
| --------------- | ---------------------------------- |
| npm install     | 依存パッケージのインストール       |
| npm run dev     | 開発サーバー起動（localhost:4321） |
| npm run build   | 本番用静的ファイルのビルド         |
| npm run preview | ビルド結果のローカルプレビュー     |

## 依存技術

- [Astro](https://astro.build/)
- [iconify-json](https://iconify.design/)

## デプロイ

本サイトは Cloudflare Pages でホスティングされています。
GitHub リポジトリと Cloudflare Pages を連携しており、main ブランチへの push をトリガーに自動でビルド・デプロイが実行されます。
