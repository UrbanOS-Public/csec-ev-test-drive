#!/usr/bin/env bash

terraform init
terraform get
# You will need to put your access key and secret key in to your local ~/.aws/smart-experience.tfvars file
terraform apply -var-file="~/.aws/smart-experience.tfvars" -var-file="variables/dev.tfvars" -state=state/dev/terraform.tfstate