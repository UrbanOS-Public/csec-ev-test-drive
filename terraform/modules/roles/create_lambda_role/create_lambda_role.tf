variable "lambda_role_name" {
  type = "string"
}

data "aws_iam_policy_document" "lambda_policy" {
  statement {
    effect = "Allow"
    principals = {
      type = "Service"
      identifiers = ["lambda.amazonaws.com", "apigateway.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "role" {
  name = "${var.lambda_role_name}"
  assume_role_policy = "${data.aws_iam_policy_document.lambda_policy.json}"
}

output "arn" {
  value = "${aws_iam_role.role.arn}"
}
output "name" {
  value = "${aws_iam_role.role.name}"
}


data "aws_iam_policy_document" "logging_policy_statement" {
  statement {
    effect = "Allow"
    resources = ["arn:aws:logs:*:*:*"]
    actions = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
  }
}
resource "aws_iam_policy" "lambda_logging_policy" {
  name = "logging_policy_for_${var.lambda_role_name}"
  description = "Allows AWS Lambda to create and write logs"
  policy = "${data.aws_iam_policy_document.logging_policy_statement.json}"
}
resource "aws_iam_role_policy_attachment" "Attach_Logging_Role" {
  role = "${aws_iam_role.role.name}"
  policy_arn = "${aws_iam_policy.lambda_logging_policy.arn}"
}

resource "aws_iam_role_policy_attachment" "Attach_VPC_Policy" {
  role = "${aws_iam_role.role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}