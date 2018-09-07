insert into schedule_exception (`date`, `start_time`, `end_time`, `slot_length_minutes`, `employees_per_slot`)
  values ('2018-09-15', '09:00:00', '18:00:00', 30, 3);


update survey_question set text = 'Registration for this event may be used by participating automotive manufacturers to learn about your experience and communicate with you. Would you like a local dealership or participating automotive manufacturer to contact you with more information?' where id = 1000130;