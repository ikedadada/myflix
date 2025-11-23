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
  default     = "feature/*"
}

variable "access_domain" {
  type        = string
  description = "Access protected hostname"
}

variable "allowed_emails" {
  type        = list(string)
  default     = []
}
