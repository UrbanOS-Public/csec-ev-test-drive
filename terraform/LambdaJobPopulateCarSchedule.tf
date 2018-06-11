module "JobPopulateCarScheduleRole" {
  source = "./modules/roles/create_lambda_role"
  lambda_role_name = "JobPopulateCarScheduleRole"
}

module "JobPopulateCarSchedule" {
  source = "./modules/lambda/create_lambda_function_in_vpc_with_env_variables"
  function_name = "JobPopulateCarSchedule"
  handler = "src/JobPopulateCarSchedule.handler"
  role_arn = "${module.JobPopulateCarScheduleRole.arn}"
  timeout = "300"
  description = "Runs nightly to populate Car Schedules 180 days out"
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

//TODO: NEED TO DO SCHEDULE.