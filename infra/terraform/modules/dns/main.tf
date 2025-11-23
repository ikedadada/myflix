variable "zone_id" {
  type = string
}

variable "hostname" {
  type = string
}

variable "target_value" {
  type = string
}

resource "cloudflare_record" "cname" {
  zone_id = var.zone_id
  name    = var.hostname
  type    = "CNAME"
  value   = var.target_value
  proxied = true
}

output "hostname" {
  value = cloudflare_record.cname.hostname
}
terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}
