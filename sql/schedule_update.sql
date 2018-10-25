update schedule set employees_per_slot = 0 where day_of_the_week = 1;
update schedule set slot_length_minutes = 0 where day_of_the_week = 1;

update schedule set start_time = '11:00:00' where day_of_the_week = 2;
update schedule set end_time = '13:00:00' where day_of_the_week = 2;

update schedule set start_time = '11:00:00' where day_of_the_week = 3;
update schedule set end_time = '13:00:00' where day_of_the_week = 3;

update schedule set start_time = '11:00:00' where day_of_the_week = 4;
update schedule set end_time = '20:00:00' where day_of_the_week = 4;

update schedule set start_time = '11:00:00' where day_of_the_week = 5;
update schedule set end_time = '20:00:00' where day_of_the_week = 5;