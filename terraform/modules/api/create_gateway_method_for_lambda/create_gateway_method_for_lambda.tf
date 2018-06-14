variable "function_invoke_arn" {
}
variable "function_arn" {
}
variable "rest_api_id" {
}
variable "parent_id" {
}
variable "path" {
}
variable "account_number" {
}
variable "api_key_required" {
  default = "false"
}

resource "aws_api_gateway_resource" "cors_resource" {
  path_part = "${var.path}"
  parent_id = "${var.parent_id}"
  rest_api_id = "${var.rest_api_id}"
}
resource "aws_api_gateway_method" "options_method" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.cors_resource.id}"
  http_method = "OPTIONS"
  authorization = "NONE"
}
resource "aws_api_gateway_method_response" "options_200" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.cors_resource.id}"
  http_method = "${aws_api_gateway_method.options_method.http_method}"
  status_code = "200"
  response_models {
    "application/json" = "Empty"
  }
  response_parameters {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin" = true
  }
  depends_on = [
    "aws_api_gateway_method.options_method"]
}
resource "aws_api_gateway_integration" "options_integration" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.cors_resource.id}"
  http_method = "${aws_api_gateway_method.options_method.http_method}"
  type = "MOCK"
  depends_on = [
    "aws_api_gateway_method.options_method"]
  request_templates {
    "application/json" = "{'statusCode': 200}"
  }

}
resource "aws_api_gateway_integration_response" "options_integration_response" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.cors_resource.id}"
  http_method = "${aws_api_gateway_method.options_method.http_method}"
  status_code = "${aws_api_gateway_method_response.options_200.status_code}"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,POST'",
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
  response_templates {
    "application/json" = ""
  }
  depends_on = [
    "aws_api_gateway_method_response.options_200"]
}

resource "aws_api_gateway_method" "cors_method" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.cors_resource.id}"
  http_method = "POST"
  authorization = "NONE"
  api_key_required = "${var.api_key_required}"
}
resource "aws_api_gateway_method_response" "cors_method_response_200" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.cors_resource.id}"
  http_method = "${aws_api_gateway_method.cors_method.http_method}"
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }

  depends_on = [
    "aws_api_gateway_method.cors_method"]
}
resource "aws_api_gateway_integration" "integration" {
  rest_api_id = "${var.rest_api_id}"
  resource_id = "${aws_api_gateway_resource.cors_resource.id}"
  http_method = "${aws_api_gateway_method.cors_method.http_method}"
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = "${var.function_invoke_arn}"
  depends_on = [
    "aws_api_gateway_method.cors_method"]
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "API_Lambda_${var.rest_api_id}_${aws_api_gateway_method.cors_method.http_method}_${aws_api_gateway_resource.cors_resource.id}"
  action        = "lambda:InvokeFunction"
  function_name = "${var.function_arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:us-east-1:${var.account_number}:${var.rest_api_id}/*/${aws_api_gateway_method.cors_method.http_method}${aws_api_gateway_resource.cors_resource.path}"
}