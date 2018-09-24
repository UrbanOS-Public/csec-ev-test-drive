module "ApiTestingAuthRole" {
  source = "./modules/roles/create_lambda_role"
  lambda_role_name = "${var.environment}ApiTestingAuthRole"
}

module "ApiTestingAuthFunction" {
  source = "./modules/lambda/create_lambda_function_in_vpc_with_env_variables"
  function_name = "ApiTestingAuth"
  handler = "src/api/TestingAuth.handler"
  role_arn = "${module.ApiTestingAuthRole.arn}"
  timeout = "10"
  description = "Api to test auth stuff"
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