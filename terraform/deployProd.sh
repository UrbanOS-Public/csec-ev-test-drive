#!/usr/bin/env bash

terraform init
terraform get
# You will need to put your access key and secret key in to your local ~/.aws/smart-experience.tfvars file
terraform apply -parallelism=0 -var-file="variables/prod.tfvars" -state=state/prod/terraform.tfstate
