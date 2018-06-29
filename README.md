# csec-ev-test-drive
The Columbus Smart Experience Center - EV Test Drive application allows for scheduling of test drives and capturing of survey information.
This application was developed over the course of 2.5 weeks.  That being said the current workflow is extremely slimmed down and some "best practices" like TDD were not necessarily followed.  
Using the best judgment of the original developers (Jarred Olson, Kyle Engan, and a little support from Michael Cibulskis) we chose to test drive things that were more complex.  
For example Jarred did not TDD the `GetCars.js` file because it simply does a query against the database and transforms the data to send back to the caller.  
When originally written there were 2 paths through that code, so if it works it works, if it didn't it would be pretty obvious.

- [Time Slots](#time-slots)
- [Schedule Exceptions](#schedule-exceptions)
- [Terraform And AWS](#terraform-and-aws)
- [Deploy Lambdas](#deploy-lambdas)
- [Jobs](#Jobs)

# Time Slots
Every night the JobPopulateTimeSlots runs to archive yesterdays schedule and populate today's schedule (since we're only dealing with current day drives).
The `time_slot` table is built off of either the `schedule` table (based on day of the week) or the `schedule_exception` table based on date.
If there is a `schedule_exception` for 'today' then that schedule is used, otherwise the `schedule` for 'today's day of the week' is used.
Both of those tables have primarily the same [Table Structure](#schedule-and-schedule_exception-table-structure)

# Schedule Exceptions
Look at the sql/create_schedule_exception.sql file for how to insert one of these rows.  
In summary these values are used for 1 off special scenarios.  For example wanting to stay open later on July 19th due to an event in the area.
They can be used for:
- Staying Open Late
- Closing Early
- Increasing/Decreasing the number of available employees
- Increasing/Decreasing the length of each test drive
These rows would need to be in the database before the nightly job runs to populate the car scheduled for the given date.
[Table Structure](#schedule-and-schedule_exception-table-structure)

# Schedule And Schedule_Exception Table Structure
* `day_of_the_week` 
    - 0 based starting on Sunday. e.g. 5 for Friday
* `date`
    - The date of the exception e.g. '2018-07-05'
* `start_time` 
    - The time of day (24 hour format) that rides are allowed to start e.g. '10:00'
* `end_time`
    - The time of day (24 hour formatt) that rides are supposed to end e.g. '20:00'
* `slot_length_minutes` 
    - How long each time slot should be in minutes e.g. 60
* `employees_per_slot` 
    - How many employees are available per time slot e.g. 3

** employees_per_slot should not be greater than the number of active cars for the day.

# Terraform And AWS
[Terraform](https://www.terraform.io/) was used to setup our AWS environment.  Nearly everything done is configured in the scripts except the things listed.
- Simple Email Service - Verified Email - https://console.aws.amazon.com/ses/home?region=us-east-1#verified-senders-email.  You would need to add the specific accounts based on the domain name.
- DNS Domain Verification - This is done via terraform but the verification records are commented out.
- The DNS registration was done outside of AWS.  This is just because the client already owned their DNS with bluehost.com.  To configure this I logged into that account and pointed to the AWS Name Server records for our setup.

To apply changes to terraform you can execute the `deploy.sh` script that is in the root of the terraform/ directory.  It assumes you have a `~/.aws/smart-experience.tvfars` with the appropriate values.  
The only values you would need would be the access key and secret key for a service account.  If you do not have the access key and secret key you should be able to create one through the [AWS Console in the IAM section](https://console.aws.amazon.com/iam/home?#/home)
This user would need to be added to the `CSECEVTestDriveAdmins` group.
~~~~ 
access_key = "AKI______________ZOA"
secret_key = "VjUn________________________________+0ed"
~~~~


# Deploy Lambdas
To deploy/update the lambdas you can run the `deploy.sh` script that is in the root of the lambda/ directory.  It does an NPM install, zips up everything, uploads it to S3, then uses the [AWS CLI](https://aws.amazon.com/cli/) to update all of the functions.

# Database
The database is using a hosted MySQL RDS instance.  This instance is not publicly available so you need to be inside of the Virtual Private Cloud (VPC) to be able to connect to the database.  
If you need to do this to make data changes then you would need to:
1. Turn on the [Jumpbox EC2 instance](https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#Instances:search=Jumpbox;sort=instanceType). Turning on this instance will assign it a new IP address.
2. ssh to the server with a command like this: `ssh -i ~/.ssh/PillarSmartExperienceKey.pem ec2-user@***REMOVED***`
3. Once on the server you can connect to the database with the following command: `mysql smart_experience -h ***REMOVED***.amazonaws.com -usmrt -p'<PASSWORD>'`

If you don't have access to the mentioned private key you can create a new EC2 Instance uses the Amazon Linux AMI, and add the `Jumpbox Security Group` to it's list of Security Groups.  This Security Group allows access via a restricted range of IP address.  
If you are trying to ssh to the server and cannot you may want to ensure that your IP address is in the ingress list of IP Addresses.

# Jobs
There are several background jobs that run to setup data, archive data, and to send out emails.

- Archive Car Schedule - Copies yesterday's data from the `car_schedule` table to the `archive_car_schedule`.  This ensures that the data in the `car_schedule` table is small and only the current live data.
- Populate Car Schedule - Creates rows in the `car_schedule` table up to 180 days out. **This needs to run before Populate Time Slots**
- Populate Time Slots - This job does a lot and could be broken down.  It copies yesterday's data from `time_slot` to `archive_time_slot` and `car_slot` to `archive_car_slot`.
Again, this ensures that the data in this table is the current live data and keeps the table small.  Then it populates the `car_slot` and `time_slot` data based on the folowing logic.
For the current day it will look at the `car_schedule` table to determine what cars are 'active'.  
Then to determine what hours, how long, and how many employees should be in each slot if there is an entry in the `schedule_exception` table for the current day, then it will use those settings to populate.  If there is no `schedule_exception` for the current day then the value for the current day's day of the week will be used from `schedule`
- Send Confirmation Email - This runs every minute and looks for a `user_drive_map` entry that has the `email_sent` field equal to false.  When one is found it sends a confirmation email to the user so they have their confirmation number and details about how to get to the experience center.
- Weekly Email Analytics - This email is sent to the experience center employee(s) with the raw data for the past week's drives.  This will execute on Friday morning sending Friday (last week) through Thursday (yesterday) data.