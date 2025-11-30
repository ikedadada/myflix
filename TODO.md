# TODO: サムネイル生成〜表示（ローカル検証優先 → デプロイ後検証）

## ローカルでまず通す
- [ ] マイグレーション追加: `videos.thumbnail_key`, `thumbnail_status` (pending/processing/succeeded/failed), `thumbnail_error`
- [ ] DTO/メタデータに `thumbnailUrl`/`thumbnailStatus` を追加し、`/videos` と `/videos/:id/metadata` で返す
- [ ] API: `POST /videos/:id/thumbnail`（mode: frame | upload | ai、owner限定）。とりあえず mode=upload を先に実装して手動差し替えを可能にする
- [ ] フロント: カードで `thumbnailUrl` を表示（なければプレースホルダー）。動画詳細でサムネ設定UIを暫定追加（uploadのみ対応）
- [ ] ローカル検証: `npm run migrate:local` → `npm run dev` → フロントからアップロード→サムネ差し替え→カード表示でサムネが出ることを確認

## 本実装（ジョブ・自動生成を含む）
- [ ] キュー導入: wrangler.toml に Queue 定義追加（producer/consumer）。`env.local` でも動くようにする
- [ ] 生成ジョブ: mode=frame で timeSeconds を受け、外部サムネAPI/FFmpegサービスを呼んで R2 `thumbnails/` に保存。完了時に `thumbnail_key` / `thumbnail_status` 更新
- [ ] mode=ai: プリセットで自動選択するジョブを追加（候補は1枚でよい）。失敗時は status=failed と error を記録
- [ ] リトライ: `POST /videos/:id/thumbnail/retry` を追加（owner限定）
- [ ] フロント: サムネ設定UIに mode切替（frame指定、upload、auto）、ステータス表示とリトライボタン、更新後のプレビュー反映

## デプロイ後の検証
- [ ] dev環境にマイグレーション適用後、サムネAPI/Queueが動作するかを手動検証（アップロード→サムネ生成→カード表示）
- [ ] 最低限の統合テストをCIに追加（メタデータで thumbnail フィールドが返ること、サムネAPIのバリデーション）
