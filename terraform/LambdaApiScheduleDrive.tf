module "ApiScheduleDriveRole" {
  source = "./modules/roles/create_lambda_role"
  lambda_role_name = "ApiScheduleDriveRole"
}

module "ApiScheduleDriveFunction" {
  source = "./modules/lambda/create_lambda_function_in_vpc_with_env_variables"
  function_name = "ApiScheduleDrive"
  handler = "src/api/ScheduleDrive.handler"
  role_arn = "${module.ApiScheduleDriveRole.arn}"
  timeout = "10"
  description = "Api to schedule the drive"
  vpc_subnet_ids = [
    "${aws_subnet.Subnet1d.id}",
    "${aws_subnet.Subnet1b.id}"]
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