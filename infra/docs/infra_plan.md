# MYFLIX Infra Plan

## 1. 概要

本ドキュメントは、MYFLIX プロジェクトのインフラ構成および IaC 方針を定義する。  
インフラは Cloudflare を中心に構成し、Terraform によってコードとして管理する。

本計画では次の前提を置く。  
1) 環境は prod と dev の二つのみを持つ。いわゆる local 専用インフラは構成しない。  
2) 認証は Cloudflare Zero Trust Access（Cloudflare Access）を利用し、アプリケーション側は JWT 検証のみを行う。  
3) docker-compose はローカルの開発サーバ起動補助に限定し、インフラリソースは Terraform から作成する。

## 2. 全体構成

インフラの主要コンポーネントは次の通りである。

Cloudflare Pages  
Cloudflare Workers  
Cloudflare R2  
Cloudflare D1  
Cloudflare KV  
Cloudflare Zero Trust Access（アプリケーション保護用）  
DNS（任意のカスタムドメイン）

prod と dev それぞれに対して、上記のうち必要なリソースを用意し、Terraform によって一貫して管理する。

## 3. Terraform 構成

Terraform による IaC 管理のため、リポジトリ内に infra ディレクトリを設ける。構成例は次の通りとする。

```bash
infra/
  terraform/
    envs/
      dev/
        main.tf
        variables.tf
        outputs.tf
        backend.tf
      prod/
        main.tf
        variables.tf
        outputs.tf
        backend.tf
    modules/
      cloudflare_pages/
        main.tf
        variables.tf
        outputs.tf
      cloudflare_workers/
        main.tf
        variables.tf
        outputs.tf
      cloudflare_r2/
        main.tf
        variables.tf
        outputs.tf
      cloudflare_d1/
        main.tf
        variables.tf
        outputs.tf
      cloudflare_access/
        main.tf
        variables.tf
        outputs.tf
      dns/
        main.tf
        variables.tf
        outputs.tf
```

envs 下に dev と prod の環境定義を置き、modules 下にリソース種別ごとのモジュールを置く。  
envs/dev と envs/prod から同じ modules 群を呼び出し、環境ごとの差分は変数で制御する。

Terraform の state はリモートバックエンド（例えば Terraform Cloud または別途用意したストレージ）に保存し、ローカルファイルのままにはしない。

## 4. 環境ごとのリソース構成

prod および dev 環境は、基本的に同種のリソース構成を持つ。個々の詳細値（ドメイン名、容量、レートリミットなど）は異なる可能性があるが、論理構造は合わせる。

それぞれの環境で用意する主なリソースは次の通りである。

Cloudflare Pages プロジェクト  
Cloudflare Workers サービス（API 用）  
Cloudflare R2 バケット（動画オブジェクト保管用）  
Cloudflare D1 データベース（メタデータ用）  
Cloudflare Access アプリケーションとポリシー  
DNS レコード（A / CNAME / TXT 等）

dev 環境は開発および検証用途であり、ローカル開発からも常に dev 環境に対して接続する。local 専用の DB やストレージは作らない。

## 5. Cloudflare Pages

Cloudflare Pages はビルド済みフロントエンド（Vite による SPA）をホストする。  
dev と prod について、次のいずれかのパターンを採用する。

1) Pages プロジェクトを二つ持つパターン  
   MYFLIX_DEV と MYFLIX_PROD などのようにプロジェクトを分け、それぞれに Git ブランチやビルド設定を紐づける。

2) 単一 Pages プロジェクトに複数ブランチを紐付けるパターン  
   main ブランチを prod、develop などのブランチを dev として扱う。

どちらのパターンを選択するかは、初期セットアップ時に決定し、Terraform 側のリソース設計に反映する。

Pages には API ベース URL や環境モードなどの環境変数を設定し、フロントエンドの env.ts から参照できるようにする。

## 6. Cloudflare Workers

Cloudflare Workers はバックエンド API を提供する。Hono で実装されたアプリケーションを Workers 上にデプロイする。

Workers には次のような設定を行う。

Bindings  
R2 バケットバインディング（動画オブジェクト用）  
D1 データベースバインディング（メタデータ用）  
環境変数（LLM API キーなど）

Routing  
API 用のパスプレフィックスを設定する。  
Pages と Workers を統合する場合は、Pages の Functions または Workers Routes を利用して `/api/*` を Workers に向ける。

dev と prod でそれぞれ Workers サービスを作成し、環境変数や Bindings の接続先を適切に切り替える。

wrangler.toml 側からも同じ設定を参照するが、最終的なリソースの作成や更新は Terraform が担い、wrangler はデプロイ時に既存のリソースを利用する形とする。

## 7. Cloudflare R2

Cloudflare R2 は動画オブジェクトの保管に利用する。  
環境ごとに 1 バケット以上を用意する。シンプルにするため、初期段階では dev 用と prod 用にそれぞれ 1 バケットのみ定義し、バケット名で環境を識別する。

バケットポリシーとしては、原則 Workers 経由でのみアクセスさせる。外部公開 URL は必要になった場合にのみ設定する。

ライフサイクルルールについては、個人利用かつストレージコストを抑えたい場合に検討する。例えば、一定期間アクセスのないオブジェクトを低頻度ストレージ扱いに変更するなどのポリシーを後から追加する。

Terraform の R2 モジュールでは、バケットの作成とポリシーの設定のみを行い、アプリケーションレベルのキーや署名付き URL の制御は Workers 側に委ねる。

## 8. Cloudflare D1

Cloudflare D1 はメタデータやユーザー情報などの構造化データを保存する RDB として利用する。

dev と prod それぞれに D1 データベースを 1 つずつ用意し、スキーマ定義とマイグレーションはアプリケーション側（backend）の migrations ディレクトリで管理する。

Terraform 側では D1 データベースリソースと接続用バインディングを作成し、実際のテーブル作成やスキーマ変更はアプリケーションのマイグレーションツールを通じて行う。

dev 環境の D1 は破壊的変更が入りうるため、再作成しやすいように設計する。例えば、Terraform から D1 を削除して再作成し、マイグレーションを打ち直す手順を整備する。

## 9. Cloudflare Access（Zero Trust）

認証は Cloudflare Zero Trust Access を利用する。  
アプリケーションにアクセスする前段で Cloudflare Access が外部 IdP と連携してユーザーを認証し、認証済みユーザーに対して署名付き JWT を発行する。

Workers には `Cf-Access-Jwt-Assertion` ヘッダとして JWT が渡される。Workers 側はこの JWT を検証してユーザー情報を取得し、アプリケーション内の認可処理を行う。

Terraform の cloudflare_access モジュールでは次のようなリソースを管理する。

Access アプリケーション（dev / prod 別）  
Access ポリシー（許可するメールドメイン、グループなど）  
必要であればサービス トークン（機械ユーザ用）  
関連する IdP 設定（Terraform から管理するか、初期は Cloudflare コンソールで設定するかは検討）

dev 環境では開発者のアカウントを許可するポリシーを設定し、prod 環境では利用者向けのポリシーを設定する。dev 環境を緩めにしすぎると意図しないアクセスが発生しうるため、最低限のアクセス制御は維持する。

## 10. DNS 設定

DNS については、任意のカスタムドメインを利用する前提で設計する。例として myflix.example.com を prod 用、myflix-dev.example.com を dev 用といった構成を取る。

Terraform の dns モジュールでは次のような設定を行う。

A / CNAME レコードで Cloudflare Pages / Workers にドメインを紐づける。  
TXT レコードやその他の検証レコードが必要な場合は合わせて定義する。  
dev / prod のサブドメインを分離し、誤って prod に対して開発を行わないようにする。

DNS 管理も Cloudflare 上で完結させ、外部 DNS プロバイダを利用しない構成を基本とする。

## 11. CI / CD とデプロイフロー

CI / CD の詳細はプロジェクト全体の計画で扱うが、インフラ視点では次のようなフローを想定する。

1) Git の main ブランチに変更がマージされる。  
2) CI で backend と frontend のテストとビルドを実行する。  
3) Terraform plan を dev に対して実行し、問題なければ apply する（必要な場合のみ）。  
4) Cloudflare Pages と Workers へ dev デプロイを実行する。  
5) dev での確認後、prod 用の Terraform plan / apply を実行し、prod へデプロイする。

個人開発であれば手動で Terraform コマンドと wrangler コマンドを実行してもよいが、将来的な自動化を見据えて構成を分離しておく。

## 12. ローカル開発との関係

本計画では local 専用インフラリソースを持たない。開発者はローカルマシンから wrangler dev と Vite 開発サーバを利用して開発を行うが、その際に利用される R2, D1, Access, DNS などのインフラリソースはすべて dev 環境のものとなる。

local で minio やローカル DB を立てて Cloudflare サービスを模倣する構成は、現時点では採用しない。必要になった場合は、別の計画として追加検討する。

## 13. 監視とログ

初期段階では、Cloudflare が提供するログおよびアナリティクス機能を利用してアクセス状況やエラー状況を確認する。Workers ログや R2 アクセスログなどが対象となる。

本格的な監視やアラート機能が必要になった場合は、外部監視サービスとの連携や Cloudflare のログ転送機能の利用を検討する。その場合も、Terraform から可能な範囲で設定を管理する。

## 14. セキュリティと運用

インフラセキュリティの観点から、次の方針を採用する。

環境ごとの分離を徹底し、dev と prod で API キーや Access ポリシーを明確に分ける。  
R2 や D1 などのリソースに対する直接アクセスは極力避け、Workers 経由でのみアクセスさせる。  
Cloudflare Access によりアプリケーション全体を保護し、匿名アクセスを前提とした設計は行わない。

運用においては、dev 環境の再構築手順と prod 環境のバックアップ方針を明確に分ける。dev はいつでも作り直せるようにし、prod は誤操作防止を優先する。

以上の方針に基づき、infra ディレクトリ配下の Terraform コードを実装・運用する。
