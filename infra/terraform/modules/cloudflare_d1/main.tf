variable "account_id" {
  type = string
}

variable "database_name" {
  type = string
}

resource "cloudflare_d1_database" "this" {
  account_id = var.account_id
  name       = var.database_name
}

output "database_id" {
  value = cloudflare_d1_database.this.id
}
terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}
