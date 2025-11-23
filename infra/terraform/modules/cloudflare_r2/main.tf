variable "account_id" {
  type = string
}

variable "bucket_name" {
  type = string
}

resource "cloudflare_r2_bucket" "this" {
  account_id = var.account_id
  name       = var.bucket_name
}

output "bucket_name" {
  value = cloudflare_r2_bucket.this.name
}
