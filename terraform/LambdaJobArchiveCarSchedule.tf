module "JobArchiveCarScheduleRole" {
  source = "./modules/roles/create_lambda_role"
  lambda_role_name = "${var.environment}JobArchiveCarScheduleRole"
}

module "JobArchiveCarScheduleFunction" {
  source = "./modules/lambda/create_lambda_function_in_vpc_with_env_variables"
  lambda_s3_artifact_bucket = "${aws_s3_bucket.smart_experience_artifact_repo.id}"
  function_name = "${var.environment}JobArchiveCarSchedule"
  handler = "src/JobArchiveCarSchedule.handler"
  role_arn = "${module.JobArchiveCarScheduleRole.arn}"
  timeout = "300"
  description = "Runs nightly to archive Car Schedules in the past"
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

module "JobArchiveCarScheduleTimer" {
  source = "./modules/lambda/add_cloudwatch_timer_to_lambda"
  name = "${var.environment}JobArchiveCarScheduleSchedule"
  schedule_expression = "cron(15 1 * * ? *)"
  schedule_description = "Runs everyday at 0115 UTC"
  lambda_function_arn = "${module.JobArchiveCarScheduleFunction.arn}"
}