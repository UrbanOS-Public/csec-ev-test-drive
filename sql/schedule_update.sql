update schedule set start_time = '11:00:00' where day_of_the_week = 0;
update schedule set start_time = '11:00:00' where day_of_the_week = 6;
update schedule set end_time = '18:00:00' where day_of_the_week = 0;
update schedule set end_time = '18:00:00' where day_of_the_week = 6;

update schedule set end_time = '18:00:00' where day_of_the_week = 1;
update schedule set end_time = '18:00:00' where day_of_the_week = 2;
update schedule set end_time = '18:00:00' where day_of_the_week = 3;

