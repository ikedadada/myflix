# Terraform Stack

The Terraform layout mirrors the project plan: `envs/` contain dev and prod entrypoints while `modules/` keep reusable resource definitions. Run commands from this directory:

```bash
cd infra/terraform
terraform init envs/dev
terraform plan -chdir=envs/dev -var="project_slug=myflix"
```

Each environment expects Cloudflare account, token, and DNS IDs supplied via `-var` or tfvars files.
