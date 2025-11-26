variable "account_id" {
  type = string
}

variable "project_name" {
  type = string
}

variable "custom_domains" {
  type        = list(string)
  description = "Optional list of custom domains to attach to the Pages project"
  default     = []
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

resource "cloudflare_pages_domain" "custom" {
  for_each    = toset(var.custom_domains)
  account_id  = var.account_id
  project_name = cloudflare_pages_project.this.name
  name        = each.value
}

output "production_domain" {
  value = cloudflare_pages_project.this.subdomain
}

terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}
