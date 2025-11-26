# TODO (MVP優先順)

- [ ] アップロード〜視聴の基本フロー
  - [x] `/uploads` 後の動画登録APIを追加し、R2 objectKey を `videos` に紐づける
  - [x] 再生用URL発行エンドポイント（署名付きURL or 公開URL）を追加（現状は `/videos/:id/stream` でR2から取得）
  - [ ] `/videos/:id/progress` を再生フローに組み込み、クライアントから呼べる形にする（再生位置はフロントMVP後に対応）

- [ ] 認証と保護
  - [ ] Access設定のdev/prod整備（同じヘッダ運用で動作確認）
  - [ ] モックトークンで `/auth/me` `/uploads` `/videos` のテストを追加

- [ ] 永続化とインフラ
  - [ ] D1マイグレーションをdev/prodへ適用（`upload_sessions`/`videos`/`playback_sessions` 等）
  - [ ] R2ライフサイクル/権限をTerraformに反映（不要オブジェクト整理ルール）

- [ ] API品質・異常系
  - [ ] `/uploads` 最大サイズ・Content-Type検証、失敗時に `failed` 保存
  - [ ] `/videos` 系の404/権限チェック整理とレスポンススキーマ固定

- [ ] CI/CD・運用
  - [ ] backend deploy + migrations の自動確認フロー固定（devでの `wrangler d1 migrations apply --remote`、テスト/Lint）
  - [ ] 最低限のE2E（認証→アップロード→動画登録→一覧→再生URL取得）を追加しCIに組み込む

- [x] Deployment playbooks in `docs/` (dev/prod runbooks, rollback steps) are done.

## ブロッカー/最優先対応
- [ ] カスタムドメインに集約してプリフライトを解消する（例: `app.example.com` 配下に `/api` をぶら下げる）
  - Backend: Hono を `/api` ベースで受ける（basePath or ルートを `/api/*` 前提に統一）、CORSヘッダーに `Authorization` も許可しておく。wrangler はパス付きルートでデプロイする想定に合わせる。
  - Frontend: `VITE_API_BASE_URL` を `https://app.example.com/api/` に変更し、env/README を更新。
  - Infra (Terraform): `backend_domain`/`frontend_domain` を単一 `app_domain` に整理。DNS の CNAME を `app.example.com` に作成し、Pages にカスタムドメイン紐付け。Workers のルートを `app.example.com/api/*` に設定。Access 宛先も同一ホストに変更。
  - GitHub Actions: frontend-deploy の `VITE_API_BASE_URL` を新ドメインに、backend-deploy の `CORS_ALLOWED_ORIGINS` を同一ホストに、terraform-dev の変数を `app_domain` 前提に修正。必要に応じて secrets を更新。
  - 動作確認: ゲストブラウザで Access ログイン後、`/api/uploads` プリフライトが 200/204 になることを Network タブで確認。
