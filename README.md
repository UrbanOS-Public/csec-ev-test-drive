# csec-ev-test-drive
The Columbus Smart Experience Center - EV Test Drive application allows for scheduling of test drives and capturing of survey information.

- [Time Slots](#time-slots)
- [Schedule Exceptions](#schedule-exceptions)
- [Terraform And AWS](#terraform-and-aws)

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
-  