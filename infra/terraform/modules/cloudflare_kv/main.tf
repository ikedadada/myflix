variable "account_id" {
  type = string
}

variable "namespace_key" {
  type = string
}

resource "cloudflare_workers_kv_namespace" "this" {
  account_id = var.account_id
  title      = var.namespace_key
}

output "namespace_id" {
  value = cloudflare_workers_kv_namespace.this.id
}
