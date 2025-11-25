# Terraform Stack

The Terraform layout mirrors the project plan: `envs/` contain dev and prod entrypoints while `modules/` keep reusable resource definitions.

## 運用ポリシー（backend指定/CI・ローカル/管理方針）

- state backend: R2 (S3互換) を使用。`envs/*/backend.hcl` はテンプレートなので実値に置換してから使う。`backend.hcl` を直接書き換える場合はコミットしない（ローカル専用設定にする）。
- CI/CD: GitHub Actions 上で `terraform plan` を実行し、state も同じ R2 backend を利用する。CI は `apply` しない方針（レビュー後に手動 apply するか、別ジョブで明示的に apply する）。
- ローカル: 開発者は `plan` を実行して差分を確認する。`apply` は基本禁止（必要なら事前合意）。Cloudflare API Token や Account ID は環境変数/tfvars で渡し、Git には含めない。
- backend指定の分離: ローカル/CI とも `-backend-config=backend.hcl` を指定して同一 backend を使う。別 backend を使いたい場合は `backend.local.hcl` を自作し、`.gitignore` に追加してローカルのみで使用する。

## ローカル実行手順（dev）

前提: Terraform 1.6+、Cloudflare API Token（Pages/Workers/R2/D1/Access権限付き）、Cloudflare Account ID を手元で参照できること。

1. 作業ディレクトリに入る
   ```bash
   cd infra/terraform
   ```
2. dev用の tfvars を作成（例）
   ```bash
   cp envs/dev/dev.tfvars.example envs/dev/dev.tfvars
   # dev.tfvars を開いて以下を実環境値に置き換える:
   # - cloudflare_account_id
   # - access_domain
   # - allowed_emails
   # 必要なら project_slug も変更
   ```
3. Cloudflare API トークンを環境変数で設定
   ```bash
   export TF_VAR_cloudflare_api_token="<your-token>"
   ```
4. init（R2バックエンド設定込み）
   ```bash
   terraform -chdir=envs/dev init -backend-config=backend.hcl -reconfigure
   ```
   ※ backend.hcl の R2 エンドポイント `<your-account-id>` も事前に実値へ置き換えてください。
5. plan
   ```bash
   terraform -chdir=envs/dev plan -var-file=dev.tfvars
   ```

prod も同様に `envs/prod` 配下で tfvars を用意し、`-chdir=envs/prod` で init/plan を実行します。
