module "JobWeeklyEmailAnalyticsRole" {
  source = "./modules/roles/create_lambda_role"
  lambda_role_name = "${var.environment}JobWeeklyEmailAnalyticsRole"
}

data "aws_iam_policy_document" "JobWeeklyEmailAnalytics_policy" {
  statement {
    effect = "Allow"
    resources = [
      "arn:aws:ses:${var.region}:${var.account_number}:identity/no-reply@${aws_ses_domain_identity.drivesmart_email.id}"
    ]
    actions = [
      "ses:SendRawEmail"
    ]
  }
}

module "JobWeeklyEmailAnalytics_policy_attachment" {
  source = "./modules/roles/create_permission_attached_to_role"
  role_name = "${module.JobWeeklyEmailAnalyticsRole.name}"
  policy_name = "${var.environment}JobWeeklyEmailAnalytics_Policy"
  policy_json = "${data.aws_iam_policy_document.JobWeeklyEmailAnalytics_policy.json}"
}

module "JobWeeklyEmailAnalyticsFunction" {
  source = "./modules/lambda/create_lambda_function_in_vpc_with_env_variables"
  lambda_s3_artifact_bucket = "${aws_s3_bucket.smart_experience_artifact_repo.id}"
  function_name = "${var.environment}JobWeeklyEmailAnalytics"
  handler = "src/JobWeeklyEmailAnalytics.handler"
  role_arn = "${module.JobWeeklyEmailAnalyticsRole.arn}"
  timeout = "300"
  description = "Runs job to send email based on the user_drive_map table"
  vpc_subnet_ids = [
    "${aws_subnet.Subnet2.id}",
    "${aws_subnet.Subnet3.id}"]
  vpc_security_group_ids = [ "${aws_security_group.LambdaSecurityGroup.id}" ]
  environment = {
    variables = {
      host = "${aws_db_instance.smartexperience_mysql_db.address}"
      user = "${var.user}"
      password = "${var.password}"
      email = "${var.email_send_from_account}"
      send_to_email = "${var.send_to_email}"
    }
  }
}

module "JobWeeklyEmailAnalyticsTimer" {
  source = "./modules/lambda/add_cloudwatch_timer_to_lambda"
  name = "${var.environment}JobWeeklyEmailAnalyticsSchedule"
  schedule_expression = "cron(0 7 ? * FRI *)"
  schedule_description = "Runs every Friday at 700 UTC"
  lambda_function_arn = "${module.JobWeeklyEmailAnalyticsFunction.arn}"
}