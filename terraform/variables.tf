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
}
variable "account_number" {
}
variable "region" {
  default = "us-east-1"
}

variable "vpc_id" {
  default = "***REMOVED***"
}
variable "subnet-us-east-1-a" {
  default = "***REMOVED***"
}

variable "subnet-us-east-1-b" {
  default = "subnet-91a933db"
}

variable "user" {
  default = "smrt"
}

variable "password" {
  default = "***REMOVED***"
}

variable "dns_name" {
  default = "drivesmartcbus.com"
}

variable "email_send_from_account" {
  default = "no-reply@drivesmartcbus.com"
}