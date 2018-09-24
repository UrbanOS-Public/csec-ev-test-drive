module "JobMonthlyEmailAnalyticsRole" {
  source = "./modules/roles/create_lambda_role"
  lambda_role_name = "${var.environment}JobMonthlyEmailAnalyticsRole"
}

data "aws_iam_policy_document" "JobMonthlyEmailAnalytics_policy" {
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

module "JobMonthlyEmailAnalytics_policy_attachment" {
  source = "./modules/roles/create_permission_attached_to_role"
  role_name = "${module.JobMonthlyEmailAnalyticsRole.name}"
  policy_name = "JobMonthlyEmailAnalytics_Policy"
  policy_json = "${data.aws_iam_policy_document.JobMonthlyEmailAnalytics_policy.json}"
}

module "JobMonthlyEmailAnalyticsFunction" {
  source = "./modules/lambda/create_lambda_function_in_vpc_with_env_variables"
  function_name = "JobMonthlyEmailAnalytics"
  handler = "src/JobMonthlyEmailAnalytics.handler"
  role_arn = "${module.JobMonthlyEmailAnalyticsRole.arn}"
  timeout = "300"
  description = "Runs job to send email based on the user_drive_map table"
  vpc_subnet_ids = [ "${aws_subnet.Subnet1d.id}", "${aws_subnet.Subnet1b.id}" ]
  vpc_security_group_ids = [ "${aws_security_group.LambdaSecurityGroup.id}" ]
  environment = {
    variables = {
      host = "${aws_db_instance.smartexperience_mysql_db.address}"
      user = "${var.user}"
      password = "${var.password}"
      email = "${var.email_send_from_account}"
    }
  }
}

module "JobMonthlyEmailAnalyticsTimer" {
  source = "./modules/lambda/add_cloudwatch_timer_to_lambda"
  name = "JobMonthlyEmailAnalyticsSchedule"
  schedule_expression = "cron(0 7 1 * ? *)"
  schedule_description = "Runs 1st of the month at 700 UTC"
  lambda_function_arn = "${module.JobMonthlyEmailAnalyticsFunction.arn}"
}