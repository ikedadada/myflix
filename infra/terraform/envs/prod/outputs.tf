output "pages_domain" {
  value = module.pages.production_domain
}

output "worker_routes" {
  value = module.workers.routes
}
