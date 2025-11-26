variable "zone_id" {
  type = string
}

variable "hostname" {
  type = string
}

variable "target_value" {
  type = string
}

resource "cloudflare_dns_record" "cname" {
  zone_id = var.zone_id
  name    = var.hostname
  type    = "CNAME"
  content = var.target_value
  proxied = true
  ttl     = 1
}

output "hostname" {
  value = cloudflare_dns_record.cname.name
}

terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}
