#!/usr/bin/env bash


ACCOUNT_ID=***REMOVED***
BUCKET=***REMOVED***
KEY=lambdas.zip
ENVIRONMENT=smart_experience

build() {
    rm -rf $KEY
    rm -rf node_modules/*
    npm install --production
    zip -r $1 * -x *.zip *.json *.log \*test\* deploy.sh
}

checkFileSize() {
    SIZE=$(du -sm $1 | awk '{ print $1 }')
    if ((SIZE>50)) ; then
        echo ""
        echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        echo "File is too large to be handled by lambda";
        echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        echo ""
        exit
    fi
    if ((SIZE>45)) ; then
        echo ""
        echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        echo "File size is approaching the limit for Lambda (50mb).";
        echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        echo ""
    fi
}

uploadArtifact() {
    checkFileSize $3
    aws s3 --profile $1 cp $KEY s3://$2/$3
}

deployLambdas() {
    if [ $1 ]
    then
        lambdaNames=($1)
    else
        lambdaNames=(
            'JobPopulateCarSchedule'
            'JobArchiveCarSchedule'
            'JobPopulateTimeSlots'
            'JobSendConfirmationEmail'
            'JobWeeklyEmailAnalytics'
            'ApiSaveUser'
            'ApiGetTimeSlots'
            'ApiGetCars'
            'ApiGetPreSurvey'
            'ApiGetPostSurvey'
            'ApiSaveSurvey'
            'ApiScheduleDrive'
            'ApiGetScheduledDrives'
            'ApiGetUser'
            'ApiCancelDrive'
        )
    fi

    for lambda in ${lambdaNames[@]}; do
      aws lambda --profile $ENVIRONMENT update-function-code --function-name arn:aws:lambda:us-east-1:$ACCOUNT_ID:function:${lambda} --s3-bucket $BUCKET --s3-key $KEY
    done
}

build ${KEY}
uploadArtifact ${ENVIRONMENT} ${BUCKET} ${KEY}
deployLambdas $1
checkFileSize ${KEY}


# Need to put back any dev dependencies
npm install
date