#/bin/bash

#build code
ng build --prod --aot

#upload files
aws s3 cp ./dist/ev-test-drive s3://smart-experience-web --profile smart_experience --recursive --acl public-read
