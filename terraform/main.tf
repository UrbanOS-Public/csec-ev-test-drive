resource "aws_s3_bucket" "smart_experience_artifact_repo" {
  bucket = "smart-experience-artifact-repo"
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


resource "aws_subnet" "Subnet1a" {
  vpc_id     = "${var.vpc_id}"
  cidr_block = "172.31.80.0/20"
  availability_zone = "us-east-1a"
  map_public_ip_on_launch = true
  tags {
    Name = "Subnet1a"
  }
}

resource "aws_subnet" "Subnet1b" {
  vpc_id     = "${var.vpc_id}"
  cidr_block = "172.31.16.0/20"
  availability_zone = "us-east-1b"
  map_public_ip_on_launch = true
  tags {
    Name = "Subnet1b"
  }
}

resource "aws_subnet" "Subnet1f" {
  vpc_id     = "${var.vpc_id}"
  cidr_block = "172.31.64.0/20"
  availability_zone = "us-east-1f"
  map_public_ip_on_launch = true
  tags {
    Name = "Subnet1f"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = "${var.vpc_id}"
}

resource "aws_eip" "nat_gateway_ip" {
  vpc      = true
}

resource "aws_nat_gateway" "nat" {
  allocation_id = "${aws_eip.nat_gateway_ip.id}"
  subnet_id     = "${aws_subnet.Subnet1f.id}"

  tags {
    Name = "gw NAT"
  }
}