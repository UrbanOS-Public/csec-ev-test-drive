module "ApiGetPreSurveyRole" {
  source = "./modules/roles/create_lambda_role"
  lambda_role_name = "ApiGetPreSurveyRole"
}

module "ApiGetPreSurveyFunction" {
  source = "./modules/lambda/create_lambda_function_in_vpc_with_env_variables"
  function_name = "ApiGetPreSurvey"
  handler = "src/api/GetPreSurvey.handler"
  role_arn = "${module.ApiGetPreSurveyRole.arn}"
  timeout = "10"
  description = "Api to get pre survey"
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