variable "lambda_s3_artifact_bucket" {
  default = "***REMOVED***"
}
variable "lambda_s3_artifact_key" {
  default = "lambdas.zip"
}
variable "function_name" {
  type = "string"
}
variable "handler" {
  type = "string"
}
variable "role_arn" {
  type = "string"
}
variable "timeout" {
  default = 20
}
variable "runtime" {
  default = "nodejs8.10"
}
variable "description" {
  type = "string"
  default = ""
}
variable "vpc_subnet_ids" {
  type = "list"
  default = []
}
variable "vpc_security_group_ids" {
  type = "list"
  default = []
}
variable "environment" {
  type = "map"
}
variable "memory_size" {
  default = "128"
  type = "string"
}

resource "aws_lambda_function" "function" {
  s3_bucket = "${var.lambda_s3_artifact_bucket}"
  s3_key = "${var.lambda_s3_artifact_key}"
  function_name = "${var.function_name}"
  role = "${var.role_arn}"
  handler = "${var.handler}"
  timeout = "${var.timeout}"
  runtime = "${var.runtime}"
  description = "${var.description}"
  memory_size = "${var.memory_size }"
  environment = ["${var.environment}"]
  vpc_config = {
    subnet_ids = ["${var.vpc_subnet_ids}"]
    security_group_ids = ["${var.vpc_security_group_ids}"]
  }
}

output "arn" {
  value = "${aws_lambda_function.function.arn}"
}