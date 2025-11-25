# Terraform Stack

The Terraform layout mirrors the project plan: `envs/` contain dev and prod entrypoints while `modules/` keep reusable resource definitions.

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
