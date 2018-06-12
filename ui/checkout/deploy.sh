#/bin/bash

#upload files
aws s3 cp ./dist s3://smart-experience-webapp --profile smart_experience --recursive --acl public-read
