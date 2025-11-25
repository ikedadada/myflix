terraform {
  required_version = ">= 1.6.0"
  backend "s3" {}
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.40"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

locals {
  environment = "prod"
}

module "pages" {
  source                 = "../../modules/cloudflare_pages"
  account_id             = var.cloudflare_account_id
  project_name           = "${var.project_slug}-frontend-${local.environment}"
  production_branch      = var.pages_production_branch
  preview_branch_pattern = var.pages_preview_branch_pattern
}

module "workers" {
  source             = "../../modules/cloudflare_workers"
  account_id         = var.cloudflare_account_id
  script_name        = "${var.project_slug}-backend-${local.environment}"
  routes             = []
  d1_binding_name    = "DB"
  r2_binding_name    = "MEDIA_BUCKET"
}

module "r2" {
  source     = "../../modules/cloudflare_r2"
  account_id = var.cloudflare_account_id
  bucket_name = "${var.project_slug}-${local.environment}-media"
}

module "d1" {
  source        = "../../modules/cloudflare_d1"
  account_id    = var.cloudflare_account_id
  database_name = "${var.project_slug}-${local.environment}-db"
}

module "access" {
  source        = "../../modules/cloudflare_access"
  account_id    = var.cloudflare_account_id
  app_name      = "${var.project_slug}-${local.environment}"
  destinations  = [
    { type = "self_hosted", uri = var.backend_domain },
    { type = "self_hosted", uri = var.frontend_domain }
  ]
  allowed_emails = var.allowed_emails
}
