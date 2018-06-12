#/bin/bash

#upload files
aws s3 cp ./dist/ev-test-drive s3://smart-experience-web --profile smart_experience --recursive --acl public-read
