provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region = "${var.region}"
}

variable "access_key" {
}
variable "environment" {
  default = ""
}
variable "domain_prefix" {
  default = ""
}
variable "secret_key" {
}
variable "accountName" {
  default = "SmartExperience"
}
variable "account_number" {
  default = "***REMOVED***"
}
variable "region" {
}

variable "vpc_id" {
}

variable "subnet_1" {
}

variable "user" {
  default = "smrt"
}

variable "password" {
}

variable "dns_name" {
}

variable "email_send_from_account" {
  default = "no-reply@drivesmartcbus.com"
}

variable "send_to_email" {
}

variable "skip_final_snapshot" {
  default = false
}