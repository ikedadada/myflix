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

  validation {
    condition     = length(var.allowed_emails) > 0
    error_message = "At least one email address must be provided for Access."
  }
}

resource "cloudflare_zero_trust_access_policy" "allow_emails" {
  account_id = var.account_id
  name       = "allow-devs"
  decision   = "allow"
  include = [
    for email in var.allowed_emails : {
      email = {
        email = email
      }
    }
  ]
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
