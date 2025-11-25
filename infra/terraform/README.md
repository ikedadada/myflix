# Terraform Stack

The Terraform layout mirrors the project plan: `envs/` contain dev and prod entrypoints while `modules/` keep reusable resource definitions.

## 運用ポリシー（backend指定/CI・ローカル/管理方針）

- state backend: R2 (S3互換) を使用。`envs/*/backend.hcl` は CI/CD 用テンプレート（書き換えない）。ローカルは `backend.local.hcl` を各自作成して使用し、Git では無視する（`.gitignore` 登録済み）。
- CI/CD: GitHub Actions 上で `terraform plan` を実行し、state も同じ R2 backend を利用する。CI は `apply` しない方針（レビュー後に手動 apply するか、別ジョブで明示的に apply する）。
- ローカル: 開発者は `plan` を実行して差分を確認する。`apply` は基本禁止（必要なら事前合意）。Cloudflare API Token や Account ID は環境変数/tfvars で渡し、Git には含めない。
- backend指定の分離: ローカルは `-backend-config=backend.local.hcl` を使用し、CI/CD は `backend.hcl` を使用する。これによりアカウントID等を書き換えて誤コミットするリスクを排除する。
- tfvars 運用: 現状 tfvars は使わず、direnv 経由の環境変数 (TF_VAR_*) で入力を渡す。必要があれば各自で tfvars を作ってもよいが Git には含めない。

## ローカル実行手順（dev）

前提: Terraform 1.6+、Cloudflare API Token（Pages/Workers/R2/D1/Access権限付き）、Cloudflare Account ID を手元で参照できること。

1. 作業ディレクトリに入る
   ```bash
   cd infra/terraform
   ```
2. dev用の backend/.envrc を作成（例）
   ```bash
   cp envs/dev/backend.hcl envs/dev/backend.local.hcl
   cp envs/dev/.envrc.example envs/dev/.envrc
   # backend.local.hcl: <your-account-id> を実値にする
   # .envrc: TF_VAR_* （cloudflare_api_token/account_id/access_domain/allowed_emails/project_slugなど）を設定し、`direnv allow` する
   ```
3. direnv を有効化
   ```bash
   cd envs/dev
   direnv allow
   cd ../../
   ```
4. init（ローカル専用 backend を使用）
   ```bash
   terraform -chdir=envs/dev init -backend-config=backend.local.hcl -reconfigure
   ```
5. plan
   ```bash
   terraform -chdir=envs/dev plan -var-file=dev.tfvars
   ```

prod も同様に `envs/prod` 配下で tfvars を用意し、`-chdir=envs/prod` で init/plan を実行します。
