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

resource "aws_subnet" "Subnet1c" {
  vpc_id     = "${var.vpc_id}"
  cidr_block = "172.31.32.0/20"
  availability_zone = "us-east-1c"
  map_public_ip_on_launch = true
  tags {
    Name = "Subnet1c"
  }
}

resource "aws_subnet" "Subnet1d" {
  vpc_id     = "${var.vpc_id}"
  cidr_block = "172.31.0.0/20"
  availability_zone = "us-east-1d"
  map_public_ip_on_launch = true
  tags {
    Name = "Subnet1d"
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

resource "aws_route_table_association" "subnet1f_to_public" {
  subnet_id      = "${aws_subnet.Subnet1f.id}"
  route_table_id = "${aws_route_table.public_route_table.id}"
}

resource "aws_route_table" "private_route_table" {
  vpc_id = "${var.vpc_id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_nat_gateway.nat.id}"
  }

  tags {
    Name = "Private"
  }
}

resource "aws_route_table_association" "subnet1d_to_private" {
  subnet_id      = "${aws_subnet.Subnet1d.id}"
  route_table_id = "${aws_route_table.private_route_table.id}"
}
resource "aws_route_table_association" "subnet1b_to_private" {
  subnet_id      = "${aws_subnet.Subnet1b.id}"
  route_table_id = "${aws_route_table.private_route_table.id}"
}