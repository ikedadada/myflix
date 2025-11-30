# TODO: サムネイル生成〜表示（ローカル検証優先 → 本実装）

## ローカルでまず通す（同期フロー）
- [ ] DTO/メタデータに `thumbnailUrl` を追加し、`/videos` と `/videos/:id/metadata` で返す（listは実装済み、metadataは未対応）
- [ ] `/videos` 登録時に `thumbnailObjectKey` を受け取り保存（実装済みだがフロントから送る導線を追加）
- [ ] フロント: カード表示で `thumbnailUrl` を使う（なければデフォルト画像）、登録フォームでサムネobjectKeyを渡せる暫定UIを追加
- [ ] ローカル検証: `npm run migrate:local` → `npm run dev` → 動画アップロード＋任意のサムネキー指定 → カードにサムネが出ることを確認

## 本実装（自動切り出し・Queue化）
- [ ] `POST /videos/:id/thumbnail/from-video` を追加し、`timeSeconds` を受けてR2動画からフレーム切り出し→R2サムネ保存→objectKey返却（外部サムネAPI/サービスを利用）
- [ ] フロント: 上記エンドポイントを呼んで取得したサムネキーを `/videos` 登録時に渡す（初期値は0秒切り出し）
- [ ] Queue導入を検討: 重い切り出しを非同期ジョブ化し、完了後に `thumbnail_key` を更新

## デプロイ後の検証
- [ ] dev環境でアップロード→サムネ切り出し→登録→カード表示の流れを手動確認
- [ ] 最低限の統合テスト（メタデータで thumbnail フィールドが返ること、from-video API のバリデーション）を追加
