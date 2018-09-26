module "ApiGetScheduledDrivesRole" {
  source = "./modules/roles/create_lambda_role"
  lambda_role_name = "${var.environment}ApiGetScheduledDrivesRole"
}

module "ApiGetScheduledDrivesFunction" {
  source = "./modules/lambda/create_lambda_function_in_vpc_with_env_variables"
  lambda_s3_artifact_bucket = "${aws_s3_bucket.smart_experience_artifact_repo.id}"
  function_name = "${var.environment}ApiGetScheduledDrives"
  handler = "src/api/GetScheduledDrives.handler"
  role_arn = "${module.ApiGetScheduledDrivesRole.arn}"
  timeout = "10"
  description = "Api to get scheduled drives"
  vpc_subnet_ids = [
    "${aws_subnet.Subnet2.id}",
    "${aws_subnet.Subnet3.id}"]
  vpc_security_group_ids = [
    "${aws_security_group.LambdaSecurityGroup.id}"]
  environment = {
    variables = {
      host = "${aws_db_instance.smartexperience_mysql_db.address}"
      user = "${var.user}"
      password = "${var.password}"
    }
  }
}