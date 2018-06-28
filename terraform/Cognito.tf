resource "aws_cognito_user_pool" "smart_experience" {
  name = "smartexperience"
  admin_create_user_config = {
    allow_admin_create_user_only = true
  }
}

resource "aws_cognito_user_pool_domain" "smart_experience" {
  domain = "drivesmartcbus"
  user_pool_id = "${aws_cognito_user_pool.smart_experience.id}"
}

resource "aws_cognito_user_pool_client" "smart_experience" {
  name = "webapp"
  user_pool_id = "${aws_cognito_user_pool.smart_experience.id}"
  supported_identity_providers = [
    "COGNITO"
  ]
  callback_urls = [
    "https://drivesmartcbus.com/admin/login",
    "https://drivesmartcbus.com/admin/logout"
  ]
  logout_urls = [
    "https://drivesmartcbus.com/admin/logout"
  ]
  allowed_oauth_flows = ["code"]
  allowed_oauth_scopes = ["email", "openid", "profile"]
}