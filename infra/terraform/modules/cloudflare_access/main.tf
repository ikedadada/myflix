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

resource "cloudflare_zero_trust_access_policy" "allow_emails" {
  account_id     = var.account_id
  name           = "allow-devs"
  decision       = "allow"
  approval_groups = [{
    approvals_needed = 1
    email_addresses = var.allowed_emails
  }]
}

resource "cloudflare_zero_trust_access_application" "this" {
  account_id = var.account_id
  name       = var.app_name
  domain     = var.domain
  type = "self_hosted"
  session_duration = "6h"
  policies = [ 
    {
      id = cloudflare_zero_trust_access_policy.allow_emails.id,
      precedence = 1
    }
  ]
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
