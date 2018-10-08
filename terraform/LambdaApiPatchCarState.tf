module "ApiPatchCarStateRole" {
  source = "./modules/roles/create_lambda_role"
  lambda_role_name = "${var.environment}ApiPatchCarStateRole"
}

module "ApiPatchCarStateFunction" {
  source = "./modules/lambda/create_lambda_function_in_vpc_with_env_variables"
  lambda_s3_artifact_bucket = "${aws_s3_bucket.smart_experience_artifact_repo.id}"
  function_name = "${var.environment}ApiPatchCarState"
  handler = "src/api/admin/PatchCarState.handler"
  role_arn = "${module.ApiPatchCarStateRole.arn}"
  timeout = "300"
  description = "Api to change the active state of a car"
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