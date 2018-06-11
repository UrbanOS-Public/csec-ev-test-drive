variable "policy_name" {}
variable "policy_description" {
  default = ""
}
variable "policy_json" {}
variable "role_name" {}

resource "aws_iam_policy" "policy_to_create" {
  name = "${var.policy_name}"
  description = "${var.policy_description}"
  policy = "${var.policy_json}"
}
resource "aws_iam_role_policy_attachment" "attach_new_policy_to_role" {
  role = "${var.role_name}"
  policy_arn = "${aws_iam_policy.policy_to_create.arn}"
}