# Backend (Cloudflare Workers)

## 現状の実装 (MVP)
- 認証: Cloudflare Access の `CF-Access-Jwt-Assertion` で保護。`/auth/me` でユーザーを自動作成・返却。
- アップロード: `POST /uploads` でバイナリを受け取り、R2 (`MEDIA_BUCKET`) に保存。`upload_sessions` に `completed` で登録。
- 動画登録: `POST /videos` でアップロード済みセッションを指定し、`videos` にメタデータを作成（title/description/durationSeconds/objectKey）。
- 動画一覧・メタデータ: `GET /videos`, `GET /videos/:id/metadata`。
- ストリーム取得: `GET /videos/:id/stream` で R2 から直接返却（現状は Range 未対応の全体返却）。
- 再生進捗: `GET/POST /videos/:id/progress` で最終再生位置を保存/取得（クライアント組み込みは後続）。
- ストレージ: D1 (users/videos/upload_sessions/playback_sessions/settings), R2 (媒体), R2 バインド名は `MEDIA_BUCKET`。
- デプロイ: GitHub Actions (`backend-deploy.yml`) で dev にデプロイ。マイグレーションは `wrangler d1 migrations apply --remote`。
- クリーンアップ: 手動ワークフロー `cleanup-dev.yml` で dev の D1 テーブルと R2 バケットを削除。

## 残タスク/次のステップ
- 再生進捗の実運用: クライアントから progress API を呼ぶフローを組み込み、必要なら Range 対応やプレーヤ連携を検討。
- インフラ適用: D1 マイグレーション (`0002/0003`) の dev/prod 反映、R2 ライフサイクル/権限を Terraform に反映。
- API 異常系: `/uploads` のサイズ/Content-Type バリデーション、`/videos` の 404/権限チェック、レスポンススキーマ固定。
- テスト: 認証付きの API テスト（最低 `/auth/me`, `/uploads`, `/videos`, `/videos/:id/stream`）と E2E を追加し CI に組み込み。
- Range/部分配信 (任意): `Range` ヘッダ対応で部分取得を返すか、HLS/DASH などへの分割を検討。

## ローカル開発メモ
- 必要変数は direnv (.envrc) で TF_VAR_* を設定。Access の AUD/JWKS は GitHub Secrets で渡す運用。
- マイグレーション: `npm run migrate:dev` で dev D1、`wrangler d1 migrations apply --remote` でリモート適用。
- デプロイ: `npm run deploy -- --env dev --config wrangler.ci.toml --var "ACCESS_JWKS_URL:..." --var "ACCESS_JWT_AUD:..."` （CI 参照）。
