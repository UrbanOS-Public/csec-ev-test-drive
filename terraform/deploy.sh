#!/usr/bin/env bash

terraform init
terraform get
terraform apply -var-file="~/.aws/smart-experience.tvfars" -state=state/prod/terraform.tfstate
