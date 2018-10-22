UPDATE survey_question set order_index = '9' where id = 1000669;
UPDATE survey_question_option set order_index = 9 where id = 1000669
UPDATE survey_question_option set order_index = '10' where id = 1000779;

insert into survey_question_option (`id`, `survey_question_id`, `text`, `free_form`, `order_index`, `image_url`)
values (1000780, 1000127, 'Zach McGuire', FALSE, 4, null);

insert into survey_question_option (`id`, `survey_question_id`, `text`, `free_form`, `order_index`, `image_url`)
values (1000781, 1000127, 'Matt Stephens-Rich', FALSE, 5, null);

insert into survey_question_option (`id`, `survey_question_id`, `text`, `free_form`, `order_index`, `image_url`)
values (1000782, 1000127, 'Alex Slaymaker', FALSE, 6, null);

insert into survey_question_option (`id`, `survey_question_id`, `text`, `free_form`, `order_index`, `image_url`)
values (1000783, 1000127, 'Emily Stoodley', FALSE, 7, null);

insert into survey_question_option (`id`, `survey_question_id`, `text`, `free_form`, `order_index`, `image_url`)
values (1000784, 1000127, 'Marie McConnell', FALSE, 8, null);
