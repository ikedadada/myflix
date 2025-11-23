bucket                      = "myflix-state"
key                         = "dev/terraform.tfstate"
region                      = "auto"
endpoints = {
  s3 = "https://<your-account-id>.r2.cloudflarestorage.com"
}
skip_credentials_validation = true
skip_region_validation      = true
skip_metadata_api_check     = true
force_path_style            = true
skip_requesting_account_id  = true
