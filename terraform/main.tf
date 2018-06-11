resource "aws_s3_bucket" "smart_experience_artifact_repo" {
  bucket = "***REMOVED***"
  acl = "private"
}


resource "aws_security_group" "LambdaSecurityGroup" {
  name = "LambdaSecurityGroup"
  tags {
    Name = "LambdaSecurityGroup"
  }
  description = "Security Group used by lambdas to access the RDS instance"
  vpc_id = "${var.vpc_id}"
}


resource "aws_subnet" "LambdaSubnet1" {
  vpc_id     = "${var.vpc_id}"
  cidr_block = "172.31.96.0/20"
  availability_zone = "us-east-1a"

  tags {
    Name = "LambdaSubnet1"
  }
}

resource "aws_subnet" "LambdaSubnet2" {
  vpc_id     = "${var.vpc_id}"
  cidr_block = "172.31.112.0/20"
  availability_zone = "us-east-1b"

  tags {
    Name = "LambdaSubnet2"
  }
}