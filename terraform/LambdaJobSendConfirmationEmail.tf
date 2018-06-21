module "JobSendConfirmationEmailRole" {
  source = "./modules/roles/create_lambda_role"
  lambda_role_name = "JobSendConfirmationEmailRole"
}

data "aws_iam_policy_document" "JobSendConfirmationEmail_policy" {
  statement {
    effect = "Allow"
    resources = [
      "arn:aws:ses:${var.region}:${var.account_number}:identity/no-reply@${aws_ses_domain_identity.drivesmart_email.id}"
    ]
    actions = [
      "ses:SendTemplatedEmail"
    ]
  }
}

module "JobSendConfirmationEmail_policy_attachment" {
  source = "./modules/roles/create_permission_attached_to_role"
  role_name = "${module.JobSendConfirmationEmailRole.name}"
  policy_name = "JobSendConfirmationEmail_Policy"
  policy_json = "${data.aws_iam_policy_document.JobSendConfirmationEmail_policy.json}"
}

module "JobSendConfirmationEmailFunction" {
  source = "./modules/lambda/create_lambda_function_in_vpc_with_env_variables"
  function_name = "JobSendConfirmationEmail"
  handler = "src/JobSendConfirmationEmail.handler"
  role_arn = "${module.JobSendConfirmationEmailRole.arn}"
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

module "JobSendConfirmationEmailTimer" {
  source = "./modules/lambda/add_cloudwatch_timer_to_lambda"
  name = "JobSendConfirmationEmailSchedule"
  schedule_expression = "rate(3 minutes)"
  schedule_description = "Runs every 3 minutes"
  lambda_function_arn = "${module.JobSendConfirmationEmailFunction.arn}"
}