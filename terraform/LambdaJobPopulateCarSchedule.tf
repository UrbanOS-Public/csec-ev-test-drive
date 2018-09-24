module "JobPopulateCarScheduleRole" {
  source = "./modules/roles/create_lambda_role"
  lambda_role_name = "${var.environment}JobPopulateCarScheduleRole"
}

module "JobPopulateCarScheduleFunction" {
  source = "./modules/lambda/create_lambda_function_in_vpc_with_env_variables"
  function_name = "${var.environment}JobPopulateCarSchedule"
  handler = "src/JobPopulateCarSchedule.handler"
  role_arn = "${module.JobPopulateCarScheduleRole.arn}"
  timeout = "300"
  description = "Runs nightly to populate Car Schedules 180 days out"
  vpc_subnet_ids = [
    "${aws_subnet.Subnet2.id}",
    "${aws_subnet.Subnet3.id}"]
  vpc_security_group_ids = [ "${aws_security_group.LambdaSecurityGroup.id}" ]
  environment = {
    variables = {
      host = "${aws_db_instance.smartexperience_mysql_db.address}"
      user = "${var.user}"
      password = "${var.password}"
    }
  }
}

module "JobPopulateCarScheduleTimer" {
  source = "./modules/lambda/add_cloudwatch_timer_to_lambda"
  name = "${var.environment}JobPopulateCarScheduleSchedule"
  schedule_expression = "cron(0 1 * * ? *)"
  schedule_description = "Runs everyday at 0100 UTC"
  lambda_function_arn = "${module.JobPopulateCarScheduleFunction.arn}"
}