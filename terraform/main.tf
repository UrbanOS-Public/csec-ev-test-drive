//This was originally created via terraform.  I manually removed it from the state file
//and commented it out so I could setup the dev environment (since s3 bucket names are globally unique).
//resource "aws_s3_bucket" "smart_experience_artifact_repo" {
//  bucket = "***REMOVED***"
//  acl = "private"
//}