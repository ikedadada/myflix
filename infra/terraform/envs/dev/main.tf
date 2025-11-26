terraform {
  required_version = ">= 1.6.0"
  backend "s3" {}
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "5.13.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

locals {
  environment = "dev"
  app_hostname = "${var.project_slug}-${local.environment}.${var.root_domain}"
  backend_route_patterns = ["${local.app_hostname}/api/*"]
}

module "pages" {
  source                 = "../../modules/cloudflare_pages"
  account_id             = var.cloudflare_account_id
  project_name           = "${var.project_slug}-frontend-${local.environment}"
  production_branch      = var.pages_production_branch
  preview_branch_pattern = var.pages_preview_branch_pattern
  custom_domains         = [local.app_hostname]
}

module "dns_app" {
  source       = "../../modules/dns"
  zone_id      = var.cloudflare_zone_id
  hostname     = local.app_hostname
  target_value = module.pages.production_domain
}

module "workers" {
  source             = "../../modules/cloudflare_workers"
  account_id         = var.cloudflare_account_id
  script_name        = "${var.project_slug}-backend-${local.environment}"
  zone_id            = var.cloudflare_zone_id
  routes             = local.backend_route_patterns
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
    { type = "public", uri = local.app_hostname }
  ]
  allowed_emails = var.allowed_emails
}
