

// Wordpress Single Site

//resource "aws_instance" "app_server" {
//  ami = "ami-0b134fa4f657818a0"
//  instance_type = "t2.medium"
//  subnet_id = "${var.subnet-us-east-1-a}"
//  tags {
//    Name = "Wordpress"
//  }
//  key_name = "PillarSmartExperienceKey"
//  vpc_security_group_ids = ["${aws_security_group.wordpress_security_group.id}"]
//  associate_public_ip_address = true
//}
//
//resource "aws_security_group" "wordpress_security_group" {
//  name = "Wordpress Security Group"
//  tags {
//    Name = "Wordpress Security Group"
//  }
//  description = "Rules for Wordpress Site"
//  vpc_id = "${var.vpc_id}"
//
//  ingress {
//    from_port = 80
//    to_port = 80
//    protocol = "TCP"
//    cidr_blocks = [
//      "0.0.0.0/0"]
//  }
//  ingress {
//    from_port = "443"
//    to_port = "443"
//    protocol = "TCP"
//    cidr_blocks = [
//      "0.0.0.0/0"]
//  }
//  ingress {
//    from_port = "22"
//    to_port = "22"
//    protocol = "TCP"
//    cidr_blocks = [
//      "207.238.255.132/32",
//      "12.246.159.190/32"
//    ]
//    description = "Pillar CMH Forge IP Address"
//  }
//  egress {
//    from_port = 0
//    to_port = 0
//    protocol = "-1"
//    cidr_blocks = [
//      "0.0.0.0/0"]
//  }
//}