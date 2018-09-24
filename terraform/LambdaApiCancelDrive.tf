module "ApiCancelDriveRole" {
  source = "./modules/roles/create_lambda_role"
  lambda_role_name = "${var.environment}ApiCancelDriveRole"
}

module "ApiCancelDriveFunction" {
  source = "./modules/lambda/create_lambda_function_in_vpc_with_env_variables"
  function_name = "ApiCancelDrive"
  handler = "src/api/CancelDrive.handler"
  role_arn = "${module.ApiCancelDriveRole.arn}"
  timeout = "10"
  description = "Api to Cancel the drive"
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