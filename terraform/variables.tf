provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region = "${var.region}"
}

variable "access_key" {
}
variable "secret_key" {
}
variable "accountName" {
  default = "SmartExperience"
}
variable "account_number" {
  default = "722431446741"
}
variable "region" {
  default = "us-east-1"
}

variable "vpc_id" {
  default = "vpc-f3617188"
}
variable "subnet-us-east-1-a" {
  default = "subnet-3bb66615"
}

variable "subnet-us-east-1-b" {
  default = "subnet-91a933db"
}

variable "user" {
  default = "smrt"
}

variable "password" {
  default = "akdg9le&e82ldKa"
}

variable "dns_name" {
  default = "drivesmartcbus.com"
}

variable "email_send_from_account" {
  default = "no-reply@drivesmartcbus.com"
}