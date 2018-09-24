resource "aws_security_group" "LambdaSecurityGroup" {
  name = "${var.environment}LambdaSecurityGroup"
  tags {
    Name = "LambdaSecurityGroup"
  }
  description = "Security Group used by lambdas to access the RDS instance"
  vpc_id = "${var.vpc_id}"

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

//resource "aws_subnet" "Subnet1b" {
//  vpc_id     = "${var.vpc_id}"
//  cidr_block = "172.31.16.0/20"
//  availability_zone = "${var.region}b"
//  map_public_ip_on_launch = true
//  tags {
//    Name = "Subnet1b"
//  }
//}

resource "aws_subnet" "Subnet1" {
  vpc_id     = "${var.vpc_id}"
  cidr_block = "172.31.96.0/20"
  availability_zone = "${var.region}a"
  map_public_ip_on_launch = true
  tags {
    Name = "Subnet1"
  }
}
resource "aws_subnet" "Subnet2" {
  vpc_id     = "${var.vpc_id}"
  cidr_block = "172.31.112.0/20"
  availability_zone = "${var.region}b"
  map_public_ip_on_launch = true
  tags {
    Name = "Subnet2"
  }
}

resource "aws_subnet" "Subnet3" {
  vpc_id     = "${var.vpc_id}"
  cidr_block = "172.31.128.0/20"
  availability_zone = "${var.region}c"
  map_public_ip_on_launch = true
  tags {
    Name = "Subnet3"
  }
}

resource "aws_subnet" "Subnet4" {
  vpc_id     = "${var.vpc_id}"
  cidr_block = "172.31.144.0/20"
  availability_zone = "${var.region}a"
  map_public_ip_on_launch = true
  tags {
    Name = "Subnet4"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = "${var.vpc_id}"
}

resource "aws_route_table" "public_route_table" {
  vpc_id = "${var.vpc_id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.gw.id}"
  }

  tags {
    Name = "Public"
  }
}