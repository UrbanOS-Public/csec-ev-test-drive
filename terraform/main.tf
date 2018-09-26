resource "aws_s3_bucket" "smart_experience_artifact_repo" {
  bucket = "${var.domain_prefix}***REMOVED***"
  acl = "private"
}