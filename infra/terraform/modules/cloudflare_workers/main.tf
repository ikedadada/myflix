variable "account_id" {
  type = string
}

variable "script_name" {
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

resource "cloudflare_workers_script" "this" {
  account_id  = var.account_id
  script_name = var.script_name
  content = <<EOT
addEventListener('fetch', (event) => {
  event.respondWith(new Response('deploy backend artifact via wrangler'));
});
EOT
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
