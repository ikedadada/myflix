# MYFLIX Frontend Plan

## 1. 概要

本ドキュメントは、MYFLIX プロジェクトのフロントエンド (`frontend` ディレクトリ) に関する構成と設計方針を定義する。

Cloudflare Pages 上でのホスティングを前提とし、Vite によるビルド済み SPA を基本とする。サーバ側レンダリングは行わず、クライアントサイドのルーティングを TanStack Router で実装する。

状態管理には TanStack Query と Zustand を採用し、フォームには React Hook Form と Zod を用いる。UI コンポーネントは Tailwind CSS と shadcn/ui を基盤とし、独自コンポーネントについては Storybook によるカタログ化を行う。

認証は自前で実装せず、Cloudflare Zero Trust Access による保護を前提とする。ユーザーは Cloudflare Access により認証されてからフロントエンドに到達するため、SPA 内では「認証済み前提」の UI として設計する。

## 2. 技術スタック

フロントエンドの主要な技術スタックは次の通りとする。

React と TypeScript を用いて SPA を構築する。バンドラ兼開発サーバとして Vite を用いる。ルーティングには TanStack Router を採用し、URL 構造とページコンポーネントを型安全に結びつける。

スタイリングは Tailwind CSS と shadcn/ui を基盤とし、必要に応じて独自のデザインシステムを構築する。状態管理はサーバ由来データを TanStack Query、それ以外のローカル UI 状態を Zustand で扱う。フォームバリデーションは React Hook Form と Zod を組み合わせる。

開発補助として ESLint、Prettier、Vitest などを利用し、Storybook によってコンポーネント単位の開発とドキュメント化を行う。

## 3. ディレクトリ構成

フロントエンドのディレクトリ構成は次のようにする。

```bash
frontend/
  src/
    app/
      router/
        routes.tsx
        route-tree.tsx
      providers/
        AppProviders.tsx
        ThemeProvider.tsx
      layout/
        AppLayout.tsx
      pages/
        home/
          HomePage.tsx
          HomePage.stories.tsx
        library/
          LibraryPage.tsx
          LibraryPage.stories.tsx
        video-detail/
          VideoDetailPage.tsx
          VideoDetailPage.stories.tsx
        playback/
          PlaybackPage.tsx
          PlaybackPage.stories.tsx
        upload/
          UploadPage.tsx
          UploadPage.stories.tsx
        settings/
          SettingsPage.tsx
          SettingsPage.stories.tsx
        error/
          NotFoundPage.tsx
          ErrorPage.tsx
          AccessDeniedPage.tsx

    components/
      features/
        upload/
          components/
          hooks/
          useUploadForm.ts
        library/
          VideoCard.tsx
        auth/
          hooks/
        playback/
          hooks/
        settings/
          hooks/
        videos/
          hooks/
      ui/
        Button.tsx
        Input.tsx
        Select.tsx
        Switch.tsx
        Card.tsx
        Badge.tsx
        Accordion.tsx
        Textarea.tsx
        UserMenu.tsx
        index.ts
      layout/
        PageHeader.tsx
      shadcn/
        ui/
        hooks/

    lib/
      api-client.ts
      format-duration.ts
      format-date.ts
      utils.ts
    types/
      api.ts
      video.ts
      user.ts
      settings.ts
    config.ts

    assets/
      icons/
      images/
      styles/
        globals.css
        tailwind.css

  index.html
  vite.config.ts
  tsconfig.json
  package.json
  .eslintrc.cjs
  .prettierrc
```

components/features 配下には機能単位で再利用可能なコンポーネントと hooks を配置する。components/ui にはアプリ全体で再利用する UI を配置し、shadcn 生成物は components/shadcn に隔離する。pages は app/pages にまとめ、URL と一対一に対応するページコンポーネントを配置する。共通ユーティリティは lib、型は types に集約する。

## 4. ページとルーティング

ルーティングは TanStack Router によって実装する。routes.tsx でルート定義を行い、route-tree.tsx で型安全なルートツリーを生成する。

ページ単位の構成は次のように整理する。

ホームページでは最近アップロードされた動画やおすすめ動画をタイル状に表示し、動画詳細ページへのエントリーポイントとする。

ライブラリページではユーザーがアップロードした動画の一覧を表示し、検索やフィルタリング、ソートを提供する。動画カードは features/video-card を用いて表現し、リスト表示は features/video-list を利用する。

動画詳細ページでは動画のメタデータとサムネイル、再生ボタン、編集ボタンなどを表示する。再生ページではプレイヤーとシークバー、再生位置同期機能を提供する。

アップロードページではアップロードフォームを提供し、タイトルや説明、タグの入力と動画ファイル選択を行う。バックエンドのアップロード API と連携し、進捗表示やエラー表示を行う。

設定ページでは再生関連設定やデフォルトソート条件などを編集できるようにする。

エラーページには 404 用の NotFoundPage と、Cloudflare Access の設定ミスや権限不足などを示す AccessDeniedPage を用意する。

## 5. 状態管理とデータフェッチ

サーバから取得するデータは TanStack Query を用いて管理する。動画一覧、動画詳細、ユーザー設定などをクエリキーで分類し、キャッシュと再フェッチポリシーを定義する。

動画アップロードや設定更新などのミューテーションは useMutation を用いて定義し、成功時には関連クエリのキャッシュを更新または無効化する。

Zustand は再生中動画や一時的な UI 状態など、サーバ同期を前提としないクライアント側の状態を管理する。例えば現在再生中の動画 ID、最後に開いていたタブ、モーダルの開閉状態などを保持する。

フォーム処理は React Hook Form と Zod を組み合わせて行う。フォームスキーマを Zod で定義し、入力値の型とバリデーションルールを一元管理する。

## 6. 認証と Cloudflare Access 連携

認証は Cloudflare Zero Trust Access に委譲する。ユーザーは Cloudflare Access によって外部 IdP で認証され、その結果としてブラウザからのリクエストには認証済みコンテキストが付与される。

フロントエンドから見た認証の前提は次の通りである。

アプリの公開 URL 全体またはアプリ用のパスプレフィックスを Cloudflare Access で保護する。ユーザーは保護された URL にアクセスすると Cloudflare Access のログイン画面にリダイレクトされる。認証が完了した後に SPA の index.html が返却される。

SPA 内からは、自分が認証済みであるかどうかを直接判断せず、バックエンド API が返すレスポンスによって権限情報を把握する。useAuthUser フックは backend のユーザー情報エンドポイントを叩き、その結果に基づいて表示内容を切り替える。

ログインボタンやログアウトボタンは基本的に不要であり、必要な場合でも Cloudflare Access のログイン URL やログアウト URL へのリンクを表示する程度にとどめる。ログインフローやトークン管理はフロントエンドで実装しない。

バックエンドとの通信において、追加の認証ヘッダをフロントエンドで付与する必要はなく、標準的な fetch で十分とする。Workers 側では Cloudflare Access の JWT を検証してユーザーを特定する。

## 7. UI コンポーネント設計

UI コンポーネントは次のような方針で設計する。

components/ui には Button や Input、Card など汎用的なコンポーネントを配置する。これらは shadcn 生成物をラップするか、Tailwind ベースで独自に実装する。components/features 配下には特定のドメイン機能に密接に関係するコンポーネントを配置する。shadcn の生成物は components/shadcn に隔離し、直接編集しない。

app/pages 配下のコンポーネントは、画面全体のレイアウトと components/features および components/ui の組み立てに専念させる。ビジネスロジックは極力 feature hooks 側に寄せる。

Netflix の UI を参考にしつつ、MYFLIX としての一貫したデザイン言語を Tailwind のユーティリティクラスと shadcn/ui のトークン設定で表現する。

## 8. Storybook

Storybook を利用してコンポーネントカタログを管理する。shared/ui と features 配下の独自コンポーネントには原則 Story を用意する。

Storybook 上では、コンポーネントのバリエーションや状態を確認できるようにする。動画カードやリストなどはダミーデータを用いて見た目とインタラクションを確認する。アクセシビリティチェックやスナップショットテストの導入は余力に応じて実施する。

shadcn/ui から生成されるコンポーネントについては、必要に応じてラッパーコンポーネントに Story を追加する。

## 9. エラーハンドリングとローディング

API エラーやネットワークエラーは共通のエラーハンドリング戦略に従う。TanStack Query の onError や error プロパティを活用し、ページ単位でエラーメッセージやリトライボタンを表示する。

ローディング状態については Skeleton コンポーネントや Spinner コンポーネントを用いて段階的に表示する。動画一覧では Skeleton を、詳細やフォームではスピナーを用いるなど、コンテンツに応じて最適な表現を選択する。

認証関連のエラーについては、バックエンド API から権限不足に相当するステータスが返された場合に AccessDeniedPage へ誘導する。

## 10. ローカル開発と環境設定

ローカル開発では Vite の開発サーバを利用する。API ベース URL は dev 環境の Cloudflare Workers エンドポイントを指すように env.ts で定義する。TanStack Router のベースパスやクエリキーなども env.ts を通じて設定する。

MYFLIX ではいわゆる local 専用バックエンドを持たず、開発用の単一 dev 環境を利用する。ローカルから開発する場合も、Cloudflare Access による認証が必要となる。必要に応じて dev 用の Access ポリシーで開発者アカウントを許可する。

docker-compose は Vite 開発サーバと wrangler dev の起動をまとめる補助として利用する。Cloudflare の R2 や D1 をローカルに模倣することは行わないため、フロントエンド側では通常の dev サーバ構成とほぼ同様の運用でよい。

## 11. ビルドとデプロイ

ビルドは Vite の build コマンドを利用する。エントリポイントは src/main.tsx とし、index.html を起点にバンドルを生成する。Tailwind CSS のパージ設定を有効にし、不要なスタイルを除去する。

生成された静的ファイル一式を Cloudflare Pages に配置する。任意のパスが index.html にフォールバックするよう、Pages 側のルーティング設定を行う。API ベース URL や Cloudflare Workers のエンドポイントは、Pages の環境変数を通じて注入し、env.ts でアプリ内部の設定表現に変換する。

dev と prod の Pages プロジェクトまたはブランチを分離し、それぞれの環境変数を適切に設定する。

## 12. 今後の拡張

バックエンド側で動画トランスコードやサムネイル生成、プレイリスト機能などが追加された場合、フロントエンドでは該当機能を features と pages のいずれかまたは両方を追加することで拡張する。

HLS ベースのプレイヤーやキーボードショートカット対応、ウォッチリストやタグ管理などの機能は、features 配下に専用のコンポーネント群を追加し、ページ側で組み立てる方針とする。

多言語対応が必要になった場合は、文言を順次抽出し、軽量な i18n ライブラリを導入して言語切り替えを実現する。デザインシステムについては Tailwind のトークンや shadcn/ui のテーマ機能を活用し、Storybook 上でコンポーネント群を整理しながら進化させる。

以上の方針に基づき、frontend ディレクトリの実装を進める。
