resource "aws_api_gateway_rest_api" "SmartExperienceApi" {
  name        = "SmartExperience"
  description = "Smart Experience API for test drive registration and survey"
}

resource "aws_api_gateway_deployment" "event_stage" {
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  stage_name  = "test"
}

resource "aws_api_gateway_usage_plan" "DefaultUseagePlan" {
  name         = "default-usage-plan"
  description  = "default description"
  product_code = "SMARTEXPERIENCE"

  api_stages {
    api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
    stage  = "${aws_api_gateway_deployment.event_stage.stage_name}"
  }
}

resource "aws_api_gateway_api_key" "Smart_Experience_Key" {
  name = "Smart_Experience_Key"

  stage_key {
    rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
    stage_name  = "${aws_api_gateway_deployment.event_stage.stage_name}"
  }
}

resource "aws_api_gateway_usage_plan_key" "main" {
  key_id        = "${aws_api_gateway_api_key.Smart_Experience_Key.id}"
  key_type      = "API_KEY"
  usage_plan_id = "${aws_api_gateway_usage_plan.DefaultUseagePlan.id}"
}

module "api_post_user" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "user"
  function_invoke_arn = "${module.ApiSaveUserFunction.invoke_arn}"
  function_arn = "${module.ApiSaveUserFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
  method = "POST"
  region = "${var.region}"
}

module "api_get_cars" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "cars"
  function_invoke_arn = "${module.ApiGetCarsFunction.invoke_arn}"
  function_arn = "${module.ApiGetCarsFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
  method = "GET"
  region = "${var.region}"
}

module "api_get_timeSlots" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "timeSlots"
  function_invoke_arn = "${module.ApiGetTimeSlotsFunction.invoke_arn}"
  function_arn = "${module.ApiGetTimeSlotsFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
  method = "GET"
  region = "${var.region}"
}

module "api_get_preSurvey" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "preSurvey"
  function_invoke_arn = "${module.ApiGetPreSurveyFunction.invoke_arn}"
  function_arn = "${module.ApiGetPreSurveyFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
  method = "GET"
  region = "${var.region}"
}

module "api_get_postSurvey" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "postSurvey"
  function_invoke_arn = "${module.ApiGetPostSurveyFunction.invoke_arn}"
  function_arn = "${module.ApiGetPostSurveyFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
  method = "GET"
  region = "${var.region}"
}

module "api_post_saveSurvey" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "survey"
  function_invoke_arn = "${module.ApiSaveSurveyFunction.invoke_arn}"
  function_arn = "${module.ApiSaveSurveyFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
  method = "POST"
  region = "${var.region}"
}

module "api_post_scheduleDrive" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "drive"
  function_invoke_arn = "${module.ApiScheduleDriveFunction.invoke_arn}"
  function_arn = "${module.ApiScheduleDriveFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
  method = "POST"
  region = "${var.region}"
}
module "api_post_reserveSlot" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "reserve"
  function_invoke_arn = "${module.ApiReserveSlotFunction.invoke_arn}"
  function_arn = "${module.ApiReserveSlotFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
  method = "POST"
  region = "${var.region}"
}

module "api_post_releaseSlot" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "release"
  function_invoke_arn = "${module.ApiReleaseSlotFunction.invoke_arn}"
  function_arn = "${module.ApiReleaseSlotFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
  method = "POST"
  region = "${var.region}"
}

module "api_get_schedule" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "schedule"
  function_invoke_arn = "${module.ApiGetScheduledDrivesFunction.invoke_arn}"
  function_arn = "${module.ApiGetScheduledDrivesFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
  method = "GET"
  region = "${var.region}"
}

module "api_get_user" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "getUser"
  function_invoke_arn = "${module.ApiGetUserFunction.invoke_arn}"
  function_arn = "${module.ApiGetUserFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
  method = "GET"
  region = "${var.region}"
}

module "api_cancel_drive" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "cancelDrive"
  function_invoke_arn = "${module.ApiCancelDriveFunction.invoke_arn}"
  function_arn = "${module.ApiCancelDriveFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
  method = "POST"
  region = "${var.region}"
}

module "api_patch_car_state" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "carState"
  function_invoke_arn = "${module.ApiPatchCarStateFunction.invoke_arn}"
  function_arn = "${module.ApiPatchCarStateFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
  method = "POST"
  region = "${var.region}"
}

module "api_get_drive_survey_analytics_drive" {
  source = "./modules/api/create_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "analytics"
  function_invoke_arn = "${module.ApiGetDriveSurveyAnalyticsFunction.invoke_arn}"
  function_arn = "${module.ApiGetDriveSurveyAnalyticsFunction.arn}"
  api_key_required = "true"
  account_number = "${var.account_number}"
  method = "POST"
  region = "${var.region}"
}


resource "aws_api_gateway_authorizer" "SmartExperience" {
  name = "SmartExperienceAuthorizer"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  type = "COGNITO_USER_POOLS"
  provider_arns = [
    "${aws_cognito_user_pool.smart_experience.arn}"]
}

module "api_test_auth" {
  source = "./modules/api/create_authenticated_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "testAuth"
  function_invoke_arn = "${module.ApiTestingAuthFunction.invoke_arn}"
  function_arn = "${module.ApiTestingAuthFunction.arn}"
  aws_api_gateway_authorizer_id = "${aws_api_gateway_authorizer.SmartExperience.id}"
  account_number = "${var.account_number}"
  method = "GET"
  region = "${var.region}"
}

resource "aws_api_gateway_resource" "admin_resource" {
  path_part = "admin"
  parent_id = "${aws_api_gateway_rest_api.SmartExperienceApi.root_resource_id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
}

module "api_admin_get_schedule" {
  source = "./modules/api/create_authenticated_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_resource.admin_resource.id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "schedule"
  function_invoke_arn = "${module.ApiGetScheduleFunction.invoke_arn}"
  function_arn = "${module.ApiGetScheduleFunction.arn}"
  aws_api_gateway_authorizer_id = "${aws_api_gateway_authorizer.SmartExperience.id}"
  account_number = "${var.account_number}"
  method = "GET"
  region = "${var.region}"
}

module "api_admin_get_scheduled_drives" {
  source = "./modules/api/create_authenticated_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_resource.admin_resource.id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "drives"
  function_invoke_arn = "${module.ApiGetScheduledDrivesFunction.invoke_arn}"
  function_arn = "${module.ApiGetScheduledDrivesFunction.arn}"
  aws_api_gateway_authorizer_id = "${aws_api_gateway_authorizer.SmartExperience.id}"
  account_number = "${var.account_number}"
  method = "GET"
  region = "${var.region}"
}

module "api_admin_cancel_drive" {
  source = "./modules/api/create_authenticated_gateway_method_for_lambda"
  parent_id = "${aws_api_gateway_resource.admin_resource.id}"
  rest_api_id = "${aws_api_gateway_rest_api.SmartExperienceApi.id}"
  path = "cancelDrive"
  function_invoke_arn = "${module.ApiCancelDriveFunction.invoke_arn}"
  function_arn = "${module.ApiCancelDriveFunction.arn}"
  aws_api_gateway_authorizer_id = "${aws_api_gateway_authorizer.SmartExperience.id}"
  account_number = "${var.account_number}"
  method = "POST"
  region = "${var.region}"
}