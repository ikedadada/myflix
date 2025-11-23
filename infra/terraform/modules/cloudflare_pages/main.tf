variable "account_id" {
  type = string
}

variable "project_name" {
  type = string
}

variable "production_branch" {
  type = string
}

variable "preview_branch_pattern" {
  type = string
}

resource "cloudflare_pages_project" "this" {
  account_id = var.account_id
  name       = var.project_name
  production_branch = var.production_branch
}

output "production_domain" {
  value = cloudflare_pages_project.this.subdomain
}
