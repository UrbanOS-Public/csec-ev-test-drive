module "JobArchiveCarScheduleRole" {
  source = "./modules/roles/create_lambda_role"
  lambda_role_name = "${var.environment}JobArchiveCarScheduleRole"
}

module "JobArchiveCarScheduleFunction" {
  source = "./modules/lambda/create_lambda_function_in_vpc_with_env_variables"
  function_name = "JobArchiveCarSchedule"
  handler = "src/JobArchiveCarSchedule.handler"
  role_arn = "${module.JobArchiveCarScheduleRole.arn}"
  timeout = "300"
  description = "Runs nightly to archive Car Schedules in the past"
  vpc_subnet_ids = [ "${aws_subnet.Subnet1d.id}", "${aws_subnet.Subnet1b.id}" ]
  vpc_security_group_ids = [ "${aws_security_group.LambdaSecurityGroup.id}" ]
  environment = {
    variables = {
      host = "${aws_db_instance.smartexperience_mysql_db.address}"
      user = "${var.user}"
      password = "${var.password}"
    }
  }
}

module "JobArchiveCarScheduleTimer" {
  source = "./modules/lambda/add_cloudwatch_timer_to_lambda"
  name = "JobArchiveCarScheduleSchedule"
  schedule_expression = "cron(15 1 * * ? *)"
  schedule_description = "Runs everyday at 0115 UTC"
  lambda_function_arn = "${module.JobArchiveCarScheduleFunction.arn}"
}