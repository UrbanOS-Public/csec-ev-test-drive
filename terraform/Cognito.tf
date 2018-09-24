resource "aws_cognito_user_pool" "smart_experience" {
  name = "${var.environment}smartexperience"
  admin_create_user_config = {
    allow_admin_create_user_only = true
  }
}

resource "aws_cognito_user_pool_domain" "smart_experience" {
  domain = "${var.domain_prefix}drivesmartcbus"
  user_pool_id = "${aws_cognito_user_pool.smart_experience.id}"
}

resource "aws_cognito_user_pool_client" "smart_experience" {
  name = "webapp"
  user_pool_id = "${aws_cognito_user_pool.smart_experience.id}"
  supported_identity_providers = [
    "COGNITO"
  ]
  callback_urls = [
    "https://${var.domain_prefix}drivesmartcbus.com/admin/login",
    "https://${var.domain_prefix}drivesmartcbus.com/admin/logout"
  ]
  logout_urls = [
    "https://${var.domain_prefix}drivesmartcbus.com/admin/logout"
  ]
  allowed_oauth_flows = ["code"]
  allowed_oauth_scopes = ["email", "openid", "profile"]
}