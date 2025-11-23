variable "account_id" {
  type = string
}

variable "app_name" {
  type = string
}

variable "domain" {
  type = string
}

variable "allowed_emails" {
  type = list(string)
}

resource "cloudflare_access_application" "this" {
  account_id = var.account_id
  name       = var.app_name
  domain     = var.domain
  session_duration = "24h"
}

resource "cloudflare_access_policy" "allow_emails" {
  application_id = cloudflare_access_application.this.id
  account_id     = var.account_id
  name           = "allow-devs"
  decision       = "allow"
  precedence     = 1
  include {
    email = var.allowed_emails
  }
}

output "application_id" {
  value = cloudflare_access_application.this.id
}

terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}
