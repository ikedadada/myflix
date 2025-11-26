variable "account_id" {
  type = string
}

variable "script_name" {
  type = string
}

variable "zone_id" {
  type = string
}

variable "routes" {
  type = list(string)
}

variable "d1_binding_name" {
  type = string
}

variable "r2_binding_name" {
  type = string
}

resource "cloudflare_workers_route" "this" {
  for_each    = toset(var.routes)
  zone_id     = var.zone_id
  pattern     = each.value
  script      = var.script_name
}

output "routes" {
  value = var.routes
}

terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}
