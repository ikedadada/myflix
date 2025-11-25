variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account identifier"
}

variable "cloudflare_api_token" {
  type        = string
  description = "Token with permissions for Pages/Workers/R2/etc."
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
  default     = "preview/*"
}

variable "backend_domain" {
  type        = string
  description = "Backend hostname protected by Access (e.g., workers.dev)"
}

variable "frontend_domain" {
  type        = string
  description = "Frontend hostname protected by Access (e.g., pages.dev)"
}

variable "allowed_emails" {
  type        = list(string)
  default     = []
}
