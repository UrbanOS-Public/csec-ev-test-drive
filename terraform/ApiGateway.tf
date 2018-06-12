resource "aws_api_gateway_rest_api" "SmartExperienceApi" {
  name        = "SmartExperience"
  description = "Smart Experience API for test drive registration and survey"
}

resource "aws_api_gateway_resource" "post_event_resource" {
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  parent_id   = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  path_part   = "user"
}

resource "aws_api_gateway_method" "post_event_method" {
  rest_api_id   = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  resource_id   = "${aws_api_gateway_resource.post_event_resource.id}"
  http_method   = "POST"
  authorization = "NONE"
  api_key_required = "true"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  resource_id = "${aws_api_gateway_method.post_event_method.resource_id}"
  http_method = "${aws_api_gateway_method.post_event_method.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${module.ApiSaveUserFunction.invoke_arn}"
}


resource "aws_api_gateway_deployment" "event_stage" {
  depends_on = [
    "aws_api_gateway_integration.lambda",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  stage_name  = "test"
}


resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${module.ApiSaveUserFunction.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:us-east-1:${var.account_number}:${aws_api_gateway_rest_api.SmartExperienceApi.id}/*/${aws_api_gateway_method.post_event_method.http_method}${aws_api_gateway_resource.post_event_resource.path}"
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