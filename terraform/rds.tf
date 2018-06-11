resource "aws_security_group" "smartexperience_db_security_group" {
  name = "Smart Experience Security Group"
  tags {
    Name = "Smart Experience Security Group"
  }
  description = "Rules for Smart Experience DB"
  vpc_id = "${var.vpc_id}"

  ingress {
    from_port = 3306
    to_port = 3306
    protocol = "TCP"
    cidr_blocks = [
      "0.0.0.0/0"]
  }

  ingress {
    from_port = 3306
    to_port = 3306
    protocol = "TCP"
    security_groups = ["${aws_security_group.LambdaSecurityGroup.id}"]
  }
}


resource "aws_db_instance" "smartexperience_mysql_db" {
  identifier = "smartexperience"
  allocated_storage = 10
  storage_type = "standard"
  engine = "mysql"
  engine_version = "5.7.21"
  instance_class = "db.t2.micro"
  name = "smart_experience"
  username = "${var.user}"
  password = "${var.password}"
  vpc_security_group_ids = [
    "${aws_security_group.smartexperience_db_security_group.id}"]
  publicly_accessible = false
  skip_final_snapshot = false
}