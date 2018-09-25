#/bin/bash

#build code
ng build --aot

#upload files
aws s3 cp ./dist/ev-test-drive s3://dev-smart-experience-web --profile smart_experience --recursive --acl public-read
