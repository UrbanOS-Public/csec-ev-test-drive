resource "aws_api_gateway_rest_api" "SmartExperienceApi" {
  name        = "SmartExperience"
  description = "Smart Experience API for test drive registration and survey"
}

resource "aws_api_gateway_deployment" "event_stage" {
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  stage_name  = "test"
}

resource "aws_api_gateway_usage_plan" "DefaultUseagePlan" {
  name         = "default-usage-plan"
  description  = "default description"
  product_code = "SMARTEXPERIENCE"

  api_stages {
    api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
    stage  = "${aws_api_gateway_deployment.event_stage.stage_name}"
  }
}

resource "aws_api_gateway_api_key" "Smart_Experience_Key" {
  name = "Smart_Experience_Key"

  stage_key {
    rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
    stage_name  = "${aws_api_gateway_deployment.event_stage.stage_name}"
  }
}

resource "aws_api_gateway_usage_plan_key" "main" {
  key_id        = "${aws_api_gateway_api_key.Smart_Experience_Key.id}"
  key_type      = "API_KEY"
  usage_plan_id = "${aws_api_gateway_usage_plan.DefaultUseagePlan.id}"
}

module "api_post_user" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "user"
  function_invoke_arn = "${module.ApiSaveUserFunction.invoke_arn}"
  function_arn = "${module.ApiSaveUserFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
}