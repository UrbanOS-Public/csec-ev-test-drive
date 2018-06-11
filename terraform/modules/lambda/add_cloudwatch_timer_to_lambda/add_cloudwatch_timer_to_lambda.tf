variable "name" {
}
variable "schedule_expression" {
  default = "rate(1 minute)"
}
variable "lambda_function_arn" {
}
variable "schedule_description" {
  default = ""
}

data "aws_iam_policy_document" "cloudwatch_events_assume_role" {
  statement {
    effect = "Allow"
    principals = {
      type = "Service"
      identifiers = [
        "events.amazonaws.com"]
    }
    actions = [
      "sts:AssumeRole"]
  }
}
resource "aws_iam_role" "Cloudwatch_Event_Invoke_Lambda_Role" {
  name = "${var.name}_InvokeLambdaRole"
  assume_role_policy = "${data.aws_iam_policy_document.cloudwatch_events_assume_role.json}"
}
resource "aws_cloudwatch_event_rule" "event_rule" {
  name = "${var.name}_CWEventRule"
  schedule_expression = "${var.schedule_expression}"
  description = "${var.schedule_description}"
  role_arn = "${aws_iam_role.Cloudwatch_Event_Invoke_Lambda_Role.arn}"
}
resource "aws_cloudwatch_event_target" "stepitup-initialize-connection-target" {
  rule = "${aws_cloudwatch_event_rule.event_rule.name}"
  arn = "${var.lambda_function_arn}"
}
resource "aws_lambda_permission" "cloudwatch_schedule_invoke_stepitup_initialize" {
  action = "lambda:InvokeFunction"
  function_name = "${var.lambda_function_arn}"
  principal = "events.amazonaws.com"
  statement_id = "cloudwatch_schedule_invoke_${var.name}"
}