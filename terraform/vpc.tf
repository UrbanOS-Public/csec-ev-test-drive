resource "aws_security_group" "LambdaSecurityGroup" {
  name = "LambdaSecurityGroup"
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

resource "aws_subnet" "Subnet1b" {
  vpc_id     = "${var.vpc_id}"
  cidr_block = "172.31.16.0/20"
  availability_zone = "${var.region}b"
  map_public_ip_on_launch = true
  tags {
    Name = "Subnet1b"
  }
}

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



resource "aws_eip" "nat_gateway_ip" {
  vpc      = true
}

resource "aws_nat_gateway" "nat" {
  allocation_id = "${aws_eip.nat_gateway_ip.id}"
  subnet_id     = "${aws_subnet.Subnet4.id}"

  tags {
    Name = "gw NAT"
  }
}

resource "aws_route_table_association" "subnet1f_to_public" {
  subnet_id      = "${aws_subnet.Subnet4.id}"
  route_table_id = "${aws_route_table.public_route_table.id}"
}

resource "aws_route_table" "private_route_table" {
  vpc_id = "${var.vpc_id}"

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = "${aws_nat_gateway.nat.id}"
  }

  tags {
    Name = "Private"
  }
}

resource "aws_route_table_association" "subnet1d_to_private" {
  subnet_id      = "${aws_subnet.Subnet3.id}"
  route_table_id = "${aws_route_table.private_route_table.id}"
}
resource "aws_route_table_association" "subnet1b_to_private" {
  subnet_id      = "${aws_subnet.Subnet2.id}"
  route_table_id = "${aws_route_table.private_route_table.id}"
}