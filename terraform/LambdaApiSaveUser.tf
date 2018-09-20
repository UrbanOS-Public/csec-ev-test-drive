module "ApiSaveUserRole" {
  source = "./modules/roles/create_lambda_role"
  lambda_role_name = "ApiSaveUserRole"
}

module "ApiSaveUserFunction" {
  source = "./modules/lambda/create_lambda_function_in_vpc_with_env_variables"
  function_name = "ApiSaveUser"
  handler = "src/api/SaveUser.handler"
  role_arn = "${module.ApiSaveUserRole.arn}"
  timeout = "10"
  description = "Api to save user information"
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