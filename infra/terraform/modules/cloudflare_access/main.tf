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

variable "policy_precedence" {
  type    = number
  default = 1
}

resource "cloudflare_zero_trust_access_application" "this" {
  account_id = var.account_id
  name       = var.app_name
  domain     = var.domain
  session_duration = "24h"
}

resource "cloudflare_zero_trust_access_policy" "allow_emails" {
  application_id = cloudflare_zero_trust_access_application.this.id
  account_id     = var.account_id
  name           = "allow-devs"
  decision       = "allow"
  precedence     = var.policy_precedence
  include {
    email = var.allowed_emails
  }
}

output "application_id" {
  value = cloudflare_zero_trust_access_application.this.id
}
terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}
