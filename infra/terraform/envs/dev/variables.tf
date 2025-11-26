variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account identifier"
}

variable "cloudflare_api_token" {
  type        = string
  description = "Token with permissions for Pages/Workers/R2/etc."
}

variable "root_domain" {
  type        = string
  description = "Apex domain (e.g., example.com) to build subdomains like myflix-dev.example.com"
}

variable "cloudflare_zone_id" {
  type        = string
  description = "Cloudflare zone ID for routing"
}

variable "project_slug" {
  type        = string
  description = "Base name used for resources"
}

variable "pages_production_branch" {
  type        = string
  default     = "main"
}

variable "pages_preview_branch_pattern" {
  type        = string
  default     = "feature/*"
}

variable "allowed_emails" {
  type        = list(string)
  default     = []
}
