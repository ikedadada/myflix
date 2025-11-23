# MYFLIX Backend Plan

## 1. 概要

本ドキュメントは、MYFLIX プロジェクトの backend ディレクトリ構成およびレイヤ構造の方針を定義する。  
バックエンドは Cloudflare Workers 上で Hono を用いて実装し、DDD の考え方を取り入れた  
domain / application_service / infrastructure / presentation の四層構成を採用する。

技術スタックは以下を前提とする。  
言語: TypeScript  
実行基盤: Cloudflare Workers  
Web フレームワーク: Hono  
認証: Cloudflare Zero Trust Access (Cloudflare Access + 外部 IdP 連携, JWT ベース)  
ストレージ: オブジェクトストレージ (Cloudflare R2 を想定)  
データベース: RDB 相当 (Cloudflare D1 を想定)  
キャッシュ / 軽量データ: KV 相当 (Cloudflare KV を想定)

## 2. ディレクトリ構成

backend 以下のディレクトリ構成は次の通りとする。

```
backend/
  src/
    domain/
      model/
        entity/
          user.ts
          video.ts
          playback-session.ts
          upload-session.ts
          settings.ts
        value_object/
          user-id.ts
          video-id.ts
          playback-position.ts
          upload-session-id.ts
          settings-id.ts
      repository/
        user-repository.ts
        video-repository.ts
        playback-repository.ts
        upload-session-repository.ts
        settings-repository.ts

    application_service/
      auth-service.ts
      video-service.ts
      upload-service.ts
      playback-service.ts
      settings-service.ts
      metadata-service.ts
      dto/
        user-dto.ts
        video-dto.ts
        settings-dto.ts

    infrastructure/
      database/
        user-repository-impl.ts
        video-repository-impl.ts
        playback-repository-impl.ts
        upload-session-repository-impl.ts
        settings-repository-impl.ts
        migrations/
          0001_init.sql
      storage/
        object-storage-impl.ts
      cache/
        session-cache-impl.ts
      external/
        auth-provider-impl.ts
        llm-client-impl.ts
      config/
        env.ts
      logging/
        logger.ts

    presentation/
      http/
        routes/
          auth-routes.ts
          video-routes.ts
          upload-routes.ts
          playback-routes.ts
          settings-routes.ts
        handler/
          auth-handler.ts
          video-handler.ts
          upload-handler.ts
          playback-handler.ts
          settings-handler.ts
        middleware/
          auth-middleware.ts
          logging-middleware.ts
          error-handler.ts
        handler/
        server.ts

  wrangler.toml
  package.json
  tsconfig.json
```

## 3. レイヤごとの責務

### 3.1 domain 層

domain 層はビジネスロジックの中心であり、技術要素や外外部サービスに依存しない。  
model/entity では集約やエンティティ単位の振る舞いを表現する。  
model/value_object では ID や再生位置などの不変条件を持つ値オブジェクトを定義する。  
repository では永続化に関する抽象インターフェースを定義し、infrastructure 層の実装詳細に依存しない。

認証や外部サービスから渡される情報は、domain 層に直接持ち込まず、  
application_service 層を介して domain 上の概念に変換する。

### 3.2 application_service 層

application_service 層はユースケース単位のアプリケーションサービスを提供する。  
クライアントからの要求を受けて、複数のエンティティやリポジトリを組み合わせ、  
一連の操作をオーケストレーションする役割を持つ。

ここでは次の方針を取る。

- 一つのサービスファイルにつき、関連するユースケースを数個程度にまとめる  
- DTO ディレクトリに入出力用のデータ構造を定義し、domain の型をそのまま外部に漏らさない  
- トランザクションが必要な場合はユニットオブワーク的な抽象をここで扱う  

infrastructure の実装には依存せず、domain 層の repository インターフェースを  
引き渡し可能な形で保持し、純粋なユースケースロジックを記述する。

### 3.3 infrastructure 層

infrastructure 層は技術的な詳細を担う。  
database ディレクトリには RDB 相当の実装 (Cloudflare D1 を想定) を配置し、  
domain 層の repository インターフェースを実装する。

storage ディレクトリではオブジェクトストレージの実装 (Cloudflare R2 相当) を担当する。

cache では軽量データやアプリ内キャッシュの管理を行い、KV ストアを抽象化する。

external では Cloudflare Access による JWT 検証および LLM など外部サービスを扱う。独自の OAuth/OIDC フローはここでは扱わない。

config では Cloudflare Workers のバインディング・環境変数を一元管理する。

logging では構造化ログなど横断的関心ごとを扱う。

### 3.4 presentation 層

presentation 層は Hono ベースの HTTP レイヤであり、  
application_service の呼び出しに責務を限定する。

routes では URL ルートを定義し、  
handler で application_service の個別関数を呼び出し、  
middleware で Cloudflare Access の JWT 検証・ロギング・エラー変換を行う。

presentation 層は domain や infrastructure には直接依存せず、  
application_service のみを経由して処理を行う。

## 4. 依存関係の方針

- domain は他レイヤに依存しない  
- application_service は domain のみ依存  
- infrastructure は domain の repository インターフェースに依存  
- presentation は application_service のみに依存  

Cloudflare Workers 起動時に server.ts 内で依存オブジェクトを組み立て、  
presentation → application_service → domain → repository 抽象 → infrastructure 実装  
という依存関係が成立する。

## 5. 型定義とエラーハンドリング

domain 層にドメインエラー型を定義し、  
application_service 層では Result 型パターンまたは例外処理戦略を統一する。  
presentation 層ではそれらを HTTP ステータスおよび JSON レスポンスに変換する。

DTO は application_service/dto 以下に置き、  
application_service と presentation の境界で型変換を行う。

## 6. 開発およびビルド

TypeScript 用 tsconfig と package.json を backend 直下に配置する。  
Workers のビルドは wrangler を用いて実行し、依存組み立ても server.ts 内で行う。

テスト構成は次の二つのうちプロジェクト開始時に選択する。  
- 各ファイルと同階層に .test.ts を配置  
- tests ディレクトリにレイヤごとにテストをまとめる  

## 7. 認証の扱い

認証は Cloudflare Access を利用し、Workers 側では `Cf-Access-Jwt-Assertion` ヘッダに含まれる JWT の検証のみを行う。  
ログイン画面やセッションのライフサイクルは Cloudflare 側の責務とし、backend 側ではセッションストアを持たない。

infrastructure/external/auth-provider-impl.ts では Cloudflare Access の公開鍵エンドポイントから JWK を取得し、  
JWT の署名・有効期限・audience などを検証してユーザー情報を取り出す。

presentation 層の middleware はこの auth-provider を用いて JWT を検証し、  
userId や email などを含む userContext を生成して application_service 層に渡す。

application_service 層では受け取った userContext をもとに domain 層の User を解決し、  
対象リソースの所有権チェックなど認可ロジックを記述する。

## 8. 今後の拡張方針

非同期処理が必要な機能は infrastructure 配下に queue ディレクトリを追加し、  
Cloudflare Queues を隠蔽する。

外部サービス追加時は external 配下に抽象名でディレクトリを作り、  
ベンダー固有の実装はファイル内に閉じ込める。
