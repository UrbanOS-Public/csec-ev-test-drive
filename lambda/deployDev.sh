#!/usr/bin/env bash


ACCOUNT_ID=***REMOVED***
BUCKET=***REMOVED***
KEY=lambdas.zip
ENVIRONMENT=smart_experience_dev

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
            'dev_JobPopulateCarSchedule'
            'dev_JobArchiveCarSchedule'
            'dev_JobPopulateTimeSlots'
            'dev_JobSendConfirmationEmail'
            'dev_JobWeeklyEmailAnalytics'
            'dev_JobMonthlyEmailAnalytics'
            'dev_JobReleaseTimeSlots'
            'dev_ApiSaveUser'
            'dev_ApiGetTimeSlots'
            'dev_ApiGetCars'
            'dev_ApiGetPreSurvey'
            'dev_ApiGetPostSurvey'
            'dev_ApiSaveSurvey'
            'dev_ApiScheduleDrive'
            'dev_ApiGetScheduledDrives'
            'dev_ApiGetUser'
            'dev_ApiCancelDrive'
            'dev_ApiGetSchedule'
            'dev_ApiReserveSlot'
            'dev_ApiReleaseSlot'
            'dev_ApiGetDriveSurveyAnalytics'
        )
    fi

    for lambda in ${lambdaNames[@]}; do
      aws lambda --profile $ENVIRONMENT update-function-code --function-name arn:aws:lambda:us-west-2:$ACCOUNT_ID:function:${lambda} --s3-bucket $BUCKET --s3-key $KEY
    done
}

build ${KEY}
uploadArtifact ${ENVIRONMENT} ${BUCKET} ${KEY}
deployLambdas $1
checkFileSize ${KEY}


# Need to put back any dev dependencies
npm install
date