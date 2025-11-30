# TODO (MVP優先順)

- [ ] フロント: タイトル/説明のトーン選択＋自動生成ボタンを追加し、生成結果を入力欄へ反映
  - [ ] toneセレクターと「自動生成」ボタンを追加し、動画未アップロード時は無効化・ツールチップ表示
  - [ ] `POST /api/videos/analyze` を叩くフックを作成し、成功時にタイトル/説明を上書き（失敗時は既存入力を保持）
  - [ ] ローディング/エラー表示とリトライ、生成モデル名などのメタ表示
  - [ ] フロントのユニット/コンポーネントテスト追加（成功・エラー・未アップロード時の無効化）

- [ ] バックエンド: `/videos/analyze` エンドポイントで動画→タイトル/説明を生成
  - [ ] `POST /videos/analyze` (multipart: video, tone, userContext?) を追加し、Geminiマルチモーダルでタイトル/説明を返す（言語は日本語固定）
  - [ ] domain: トーンenum、プロンプトビルダー（トーン別スタイル、日本語タイトル<=60文字/説明1–2文）、レスポンススキーマバリデータ
  - [ ] application: `AnalyzeVideoUseCase`（検証→Gemini呼び出し→レスポンス検証、ストレージ非保存）
  - [ ] infrastructure: Geminiクライアント（timeout+retry、型不一致はretryしない）
  - [ ] presentation: multipart受信ハンドラ、MIME allowlist(`video/mp4`,`video/quicktime`)、サイズ上限100MB、tone/userContext検証、エラーマッピング（400/502/504等）
  - [ ] テスト: prompt builder、レスポンスバリデータ、MIME/サイズバリデーションのunit、ハンドラインテグレーション（成功/tone不正/video欠如/MIME不正/サイズ超過/AI不正JSON）

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
