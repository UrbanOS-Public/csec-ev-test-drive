CREATE TABLE car (
  `id`                BIGINT(20)   NOT NULL AUTO_INCREMENT,
  `year`              char(4)      NOT NULL,
  `make`              VARCHAR(256) NOT NULL,
  `model`             VARCHAR(256) NOT NULL,
  `image_url`         VARCHAR(1024)         DEFAULT NULL,
  `type`              VARCHAR(256) NOT NULL,
  `msrp`              VARCHAR(256) NOT NULL,
  `ev_range`          VARCHAR(256) NOT NULL,
  `total_range`       VARCHAR(256) NOT NULL,
  `battery_size`      VARCHAR(256) NOT NULL,
  `charging_standard` VARCHAR(256) NOT NULL,
  `charge_time`       VARCHAR(256) NOT NULL,
  `date_created`      DATETIME     NOT NULL DEFAULT now(),
  `last_updated`      DATETIME     NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8;


CREATE TABLE user (
  `id`           BIGINT(20)   NOT NULL AUTO_INCREMENT,
  `email`        VARCHAR(128) NOT NULL,
  `first_name`   VARCHAR(32)  NOT NULL,
  `last_name`    VARCHAR(32)  NOT NULL,
  `phone`        VARCHAR(15)  NOT NULL,
  `zipcode`      CHAR(5)      NOT NULL,
  `date_created` DATETIME     NOT NULL DEFAULT now(),
  `last_updated` DATETIME     NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_unique_key` (`email`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 100000
  DEFAULT CHARSET = utf8;


CREATE TABLE drive (
  `id`                   BIGINT(20) NOT NULL AUTO_INCREMENT,
  `car_id`               BIGINT(20) NOT NULL,
  `date`                 DATE       NOT NULL,
  `scheduled_start_time` TIME       NOT NULL,
  `scheduled_end_time`   TIME       NOT NULL,
  `date_created`         DATETIME   NOT NULL DEFAULT now(),
  `last_updated`         DATETIME   NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`),
  CONSTRAINT FOREIGN KEY (`car_id`) REFERENCES `car` (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 50000
  DEFAULT CHARSET = utf8;


CREATE TABLE user_drive_map (
  `user_id`      BIGINT(20)  NOT NULL,
  `drive_id`     BIGINT(20)  NOT NULL,
  `role`         VARCHAR(32) NOT NULL,
  `date_created` DATETIME    NOT NULL DEFAULT now(),
  `last_updated` DATETIME    NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`user_id`, `drive_id`),
  CONSTRAINT FOREIGN KEY (`drive_id`) REFERENCES `drive` (`id`),
  CONSTRAINT FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 250000
  DEFAULT CHARSET = utf8;


CREATE TABLE schedule (
  `id`                  BIGINT(20) NOT NULL AUTO_INCREMENT,
  `day_of_the_week`     TINYINT    NOT NULL,
  `start_time`          TIME       NOT NULL,
  `end_time`            TIME       NOT NULL,
  `slot_length_minutes` SMALLINT   NOT NULL,
  `employees_per_slot`  SMALLINT   NOT NULL,
  `date_created`        DATETIME   NOT NULL DEFAULT now(),
  `last_updated`        DATETIME   NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 100
  DEFAULT CHARSET = utf8;


CREATE TABLE schedule_exception (
  `id`                  BIGINT(20) NOT NULL AUTO_INCREMENT,
  `day_of_the_week`     TINYINT    NOT NULL,
  `date`                DATE       NOT NULL,
  `start_time`          TIME       NOT NULL,
  `end_time`            TIME       NOT NULL,
  `slot_length_minutes` SMALLINT   NOT NULL,
  `employees_per_slot`  SMALLINT   NOT NULL,
  `date_created`        DATETIME   NOT NULL DEFAULT now(),
  `last_updated`        DATETIME   NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 125
  DEFAULT CHARSET = utf8;


CREATE TABLE car_schedule (
  `car_id`       BIGINT(20) NOT NULL,
  `date`         DATE       NOT NULL,
  `active`       BOOLEAN    NOT NULL,
  `date_created` DATETIME   NOT NULL DEFAULT now(),
  `last_updated` DATETIME   NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`car_id`, `date`),
  CONSTRAINT FOREIGN KEY (`car_id`) REFERENCES `car` (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 125
  DEFAULT CHARSET = utf8;


CREATE TABLE time_slot (
  `id`              BIGINT(20) NOT NULL AUTO_INCREMENT,
  `date`            DATE       NOT NULL,
  `start_time`      TIME       NOT NULL,
  `end_time`        TIME       NOT NULL,
  `available_count` TINYINT    NOT NULL,
  `date_created`    DATETIME   NOT NULL DEFAULT now(),
  `last_updated`    DATETIME   NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `time_slot_unique_date_start_time` (`date`, `start_time`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 500000
  DEFAULT CHARSET = utf8;


CREATE TABLE car_slot (
  `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
  `time_slot_id` BIGINT(20) NOT NULL,
  `car_id`       BIGINT(20) NOT NULL,
  `reserved`     BOOLEAN    NOT NULL,
  `date_created` DATETIME   NOT NULL DEFAULT now(),
  `last_updated` DATETIME   NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`),
  CONSTRAINT FOREIGN KEY (`time_slot_id`) REFERENCES `time_slot` (`id`),
  CONSTRAINT FOREIGN KEY (`car_id`) REFERENCES `car` (`id`),
  UNIQUE KEY `time_slot_unique_date_start_time` (`time_slot_id`, `car_id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 750000
  DEFAULT CHARSET = utf8;

CREATE TABLE archive_car_schedule LIKE car_schedule;
CREATE TABLE archive_time_slot LIKE time_slot;
CREATE TABLE archive_car_slot LIKE car_slot;


CREATE TABLE survey (
  `id`           BIGINT(20)   NOT NULL AUTO_INCREMENT,
  `type`         VARCHAR(128) NOT NULL COMMENT 'Idea here is for this to be PRE|POST',
  `name`         VARCHAR(128) NOT NULL,
  `date_active`  DATE         NOT NULL,
  `date_created` DATETIME     NOT NULL DEFAULT now(),
  `last_updated` DATETIME     NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 1000000
  DEFAULT CHARSET = utf8;


CREATE TABLE survey_question_group (
  `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
  `survey_id`    BIGINT(20) NOT NULL,
  `text`         VARCHAR(4096),
  `order_index`  SMALLINT   NOT NULL,
  `date_created` DATETIME   NOT NULL DEFAULT now(),
  `last_updated` DATETIME   NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`),
  CONSTRAINT FOREIGN KEY (`survey_id`) REFERENCES `survey` (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 1000500
  DEFAULT CHARSET = utf8;


CREATE TABLE survey_question (
  `id`                       BIGINT(20)    NOT NULL AUTO_INCREMENT,
  `survey_question_group_id` BIGINT(20)    NOT NULL,
  `text`                     VARCHAR(4096) NOT NULL,
  `type`                     VARCHAR(128)  NOT NULL,
  `order_index`              SMALLINT      NOT NULL,
  `date_created`             DATETIME      NOT NULL DEFAULT now(),
  `last_updated`             DATETIME      NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`),
  CONSTRAINT FOREIGN KEY (`survey_question_group_id`) REFERENCES `survey_question_group` (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 1000100
  DEFAULT CHARSET = utf8;

CREATE TABLE survey_question_option (
  `id`                 BIGINT(20)    NOT NULL AUTO_INCREMENT,
  `survey_question_id` BIGINT(20)    NOT NULL,
  `text`               VARCHAR(4096) NOT NULL,
  `free_form`          BOOLEAN,
  `order_index`        SMALLINT      NOT NULL,
  `image_url`          VARCHAR(1024),
  `date_created`       DATETIME      NOT NULL DEFAULT now(),
  `last_updated`       DATETIME      NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`),
  CONSTRAINT FOREIGN KEY (`survey_question_id`) REFERENCES `survey_question` (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 1000500
  DEFAULT CHARSET = utf8;


CREATE TABLE user_response (
  `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
  `user_id`      BIGINT(20) NOT NULL,
  `survey_id`    BIGINT(20) NOT NULL,
  `date_created` DATETIME   NOT NULL DEFAULT now(),
  `last_updated` DATETIME   NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`),
  CONSTRAINT FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT FOREIGN KEY (`survey_id`) REFERENCES `survey` (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 2000000
  DEFAULT CHARSET = utf8;

CREATE TABLE user_response_answer (
  `id`                        BIGINT(20) NOT NULL AUTO_INCREMENT,
  `user_response_id`          BIGINT(20) NOT NULL,
  `survey_question_id`        BIGINT(20) NOT NULL,
  `survey_question_option_id` BIGINT(20) NOT NULL,
  `text`                      VARCHAR(4096),
  `date_created`              DATETIME   NOT NULL DEFAULT now(),
  `last_updated`              DATETIME   NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`),
  CONSTRAINT FOREIGN KEY (`user_response_id`) REFERENCES `user_response` (`id`),
  CONSTRAINT FOREIGN KEY (`survey_question_id`) REFERENCES `survey_question` (`id`),
  CONSTRAINT FOREIGN KEY (`survey_question_option_id`) REFERENCES `survey_question_option` (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 3000000
  DEFAULT CHARSET = utf8;


CREATE TABLE miscellaneous_data (
  `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
  `ip_address`   VARCHAR(128),
  `email`        VARCHAR(128),
  `reason`       VARCHAR(128),
  `data`         MEDIUMTEXT,
  `date_created` DATETIME   NOT NULL DEFAULT now(),
  `last_updated` DATETIME   NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 10000000
  DEFAULT CHARSET = utf8;

insert into car (`id`, `year`, `make`, `model`, `image_url`, `type`, `msrp`, `ev_range`, `total_range`, `battery_size`, `charging_standard`, `charge_time`)
values
  (1, '2018', 'BMW', 'i3', 'https://drivesmartcbus.com/assets/cars/2018_BMW_i3.png', 'Battery Electric Vehicle (BEV)',
      '$44,450 before tax credits', '114', '114', '33 kWh', 'Level 2 (240V)', '4-5 hours'),
  (2, '2018', 'Nissan', 'Leaf', 'https://drivesmartcbus.com/assets/cars/2018_Nissan_Leaf.png',
      'Battery Electric Vehicle (BEV)', '$29,900 before tax credits', '151', '151', '40 kWh', 'Level 2 (240V)',
   '8 hours'),
  (3, '2018', 'Toyota', 'Prius Prime', 'https://drivesmartcbus.com/assets/cars/2018_Toyota_Prius_Prime.png',
      'Plug-In Hybrid Electric Vehicle (PHEV)', '$27,100 before tax credits', '25', '640', '8.8 kWh', 'Level 2 (240V)',
   '2.1 hours'),
  (4, '2018', 'Honda', 'Clarity', 'https://drivesmartcbus.com/assets/cars/2018_Honda_Clarity.png',
      'Plug-In Hybrid Electric Vehicle (PHEV)', '$33,400 before tax credits', '48', '340', '17 kWh', 'Level 2 (240V)',
   '2-3 hours'),
  (5, '2018', 'Chevrolet', 'Bolt', 'https://drivesmartcbus.com/assets/cars/2018_Chevrolet_Bolt.png',
      'Plug-In Hybrid Electric Vehicle (PHEV)', '$34,095 before tax credits', '53', '420', '18.4 kWh', 'Level 2 (240V)',
   '4-5 hours'),
  (6, '2018', 'Mercedes', 'GLE 550e', 'https://drivesmartcbus.com/assets/cars/2018_Mercedes_GLE_550e.png',
      'Plug-In Hybrid Electric Vehicle (PHEV)', '$66,700 before tax credits', '10', '460', '3.3 kWh', 'Level 2 (240V)',
   '2.3 hours');


insert into schedule (`id`, `day_of_the_week`, `start_time`, `end_time`, `slot_length_minutes`, `employees_per_slot`)
values
  (100, 0, '10:00', '18:00', 30, 2), #Sunday
  (101, 1, '10:00', '20:00', 30, 2), #Monday
  (102, 2, '10:00', '20:00', 30, 2), #Tuesday
  (103, 3, '10:00', '20:00', 30, 2), #Wednesday
  (104, 4, '10:00', '20:00', 30, 2), #Thursday
  (105, 5, '10:00', '20:00', 30, 2), #Friday
  (106, 6, '10:00', '18:00', 30, 2)  #Saturday
;


insert into survey (`id`, `type`, `name`, `date_active`)
values
  (1000000, 'PRE', 'Initial Pre Test', '2018-06-01'),
  (1000001, 'POST', 'Initial Pre Test', '2018-06-01');


insert into survey_question_group (`id`, `text`, `survey_id`, `order_index`)
values
  (1000500, null, 1000000, 0),
  (1000501, null, 1000000, 1),
  (1000502, null, 1000000, 2),
  (1000503, null, 1000000, 3),
  (1000504, null, 1000000, 4),
  (1000505, null, 1000000, 5),
  (1000506, 'On a scale of 1 - 7 (1 = not at all important, 7 = extremely important), please indicate the importance of each of the following vehicle features in your next vehicle', 1000000, 6),
  (1000507, 'On a scale of 1 - 7 (1 = strongly disagree, 7 = strongly agree), please indicate how strongly you agree or disagree with the following statements about electric vehicles (EVs): ', 1000000, 7),
  (1000508, null, 1000000, 8),
  (1000509, null, 1000000, 9),
  (1000510, null, 1000000, 10),
  (1000511, null, 1000001, 0),
  (1000512, null, 1000001, 1),
  (1000513, null, 1000001, 2),
  (1000514, null, 1000001, 3),
  (1000515,
   'On a scale of 1 - 7 (1 = strongly disagree, 7 = strongly agree), please indicate how strongly you agree or disagree with the following statements about electric vehicles (EVs)',
   1000001, 4),
  (1000516, null, 1000001, 5),
  (1000517, null, 1000001, 6),
  (1000518, null, 1000001, 7),
  (1000519, null, 1000001, 8);


insert into survey_question (`id`, `text`, `survey_question_group_id`, `type`, `order_index`)
values
  (1000100, 'What is the highest degree of education you completed?', 1000500, 'MC', 0),
  (1000101, 'What was your annual household income in 2017 before taxes?', 1000501, 'MC', 0),
  (1000102, 'Gender', 1000502, 'MC', 0),
  (1000103, 'Do you currently drive an electric vehicle (EV)?', 1000503, 'MC', 0),
  (1000104, 'How many miles do you drive a day?', 1000504, 'MC', 0),
  (1000105, 'Do you plan to purchase or lease a vehicle in the next….?', 1000505, 'MC', 0),
  (1000106, 'Acceleration', 1000506, 'SCALE', 0),
  (1000107, 'Handling', 1000506, 'SCALE', 1),
  (1000108, 'All-wheel drive', 1000506, 'SCALE', 2),
  (1000109, 'Semi-automated driving functions (such as braking and lane following)', 1000506, 'SCALE', 3),
  (1000110, 'Navigation', 1000506, 'SCALE', 4),
  (1000111, 'Internet connectivity', 1000506, 'SCALE', 5),
  (1000112, 'Fuel economy', 1000506, 'SCALE', 6),
  (1000113, 'Zero emission driving capability', 1000506, 'SCALE', 7),
  (1000114, 'Driving an EV means that I’m an environmentalist', 1000507, 'SCALE', 0),
  (1000115, 'Driving an EV means that I am doing the right thing', 1000507, 'SCALE', 1),
  (1000116, 'Driving an EV means that I am a trendsetter', 1000507, 'SCALE', 2),
  (1000117, 'Driving an EV means that I am tech savvy', 1000507, 'SCALE', 3),
  (1000118, 'Driving an EV means that I am doing right by my family', 1000507, 'SCALE', 4),
  (1000119, 'Driving an EV means that I am patriotic', 1000507, 'SCALE', 5),
  (1000120, 'Driving an EV means that I am a good community member', 1000507, 'SCALE', 6),
  (1000121, 'Driving an EV means that I am socially responsible', 1000507, 'SCALE', 7),
  (1000122, 'Driving an electric vehicle (EV) means that I make practical choices', 1000507, 'SCALE', 8),
  (1000123, 'Driving an EV demonstrates to others that I care about the environment', 1000507, 'SCALE', 9),
  (1000124, 'What is your overall opinion of electric vehicles (EVs)?', 1000508, 'MC', 0),
  (1000125, 'How likely are you to consider purchasing or leasing an electric vehicle (EV) for your next car?', 1000509,
   'MC', 0),
  (1000126,
   'If you were able to charge your car at work, would you be more likely to consider purchasing an electric vehicle (EV)?',
   1000510, 'MC', 0),

  (1000127, 'Select the photo of the person who was your right seat driver', 1000511, 'MC', 0),
  (1000128, 'How likely are you to consider purchasing or leasing an electric vehicle (EV) for your next car?', 1000512, 'MC', 0),
  (1000129, 'What is your overall opinion of electric vehicles (EVs)?', 1000513, 'MC', 0),
  (1000130, 'Would you like someone from the local dealership to contact you with more information about electric vehicles (EVs)?', 1000514, 'MC', 0),

  (1000131, 'Driving an EV means that I’m an environmentalist', 1000515, 'SCALE', 0),
  (1000132, 'Driving an EV means that I am doing the right thing', 1000515, 'SCALE', 1),
  (1000133, 'Driving an EV means that I am a trendsetter', 1000515, 'SCALE', 2),
  (1000134, 'Driving an EV means that I am tech savvy', 1000515, 'SCALE', 3),
  (1000135, 'Driving an EV means that I am doing right by my family', 1000515, 'SCALE', 4),
  (1000136, 'Driving an EV means that I am patriotic', 1000515, 'SCALE', 5),
  (1000137, 'Driving an EV means that I am a good community member', 1000515, 'SCALE', 6),
  (1000138, 'Driving an EV means that I am socially responsible', 1000515, 'SCALE', 7),
  (1000139, 'Driving an electric vehicle (EV) means that I make practical choices', 1000515, 'SCALE', 8),
  (1000140, 'Driving an EV demonstrates to others that I care about the environment', 1000515, 'SCALE', 9),
  (1000141,
   'If you were able to charge your car at work, would you be more likely to consider purchasing an electric vehicle (EV)?',
   1000516, 'MC', 0),
  (1000142, 'How would you rate your right seat driver’s knowledge and engagement?', 1000517, 'MC', 0),
  (1000143, 'How would you rate your overall experience at the Ride and Drive?', 1000518, 'MC', 0),
  (1000144, 'Anything else you would like to tell us about your experience or viewpoint on electric vehicles?', 1000519,
   'MC', 0);


insert into survey_question_option (`id`, `survey_question_id`, `text`, `free_form`, `order_index`, `image_url`)
values
  (1000500, 1000100, 'Less than high school', FALSE, 0, null),
  (1000501, 1000100, 'High school graduate', FALSE, 1, null),
  (1000502, 1000100, 'Technical school or some college', FALSE, 2, null),
  (1000503, 1000100, '2 year college degree', FALSE, 3, null),
  (1000504, 1000100, '4 year college degree', FALSE, 4, null),
  (1000505, 1000100, 'Graduate school (Master\'s or Doctorate)', FALSE, 5, null),

  (1000506, 1000101, 'Less than $50,000', FALSE, 0, null),
  (1000507, 1000101, '$50,000 to $100,000', FALSE, 1, null),
  (1000508, 1000101, '$100,000 or more', FALSE, 2, null),
  (1000509, 1000101, 'Prefer not to answer', FALSE, 3, null),

  (1000510, 1000102, 'Female', FALSE, 0, null),
  (1000511, 1000102, 'Male', FALSE, 1, null),
  (1000512, 1000102, 'Other', TRUE, 2, null),
  (1000513, 1000102, 'Prefer not to disclose', FALSE, 3, null),

  (1000514, 1000103, 'Yes', FALSE, 0, null),
  (1000515, 1000103, 'No', FALSE, 1, null),

  (1000516, 1000104, 'None', FALSE, 0, null),
  (1000517, 1000104, 'Below 5 miles', FALSE, 1, null),
  (1000518, 1000104, '5-10 miles', FALSE, 2, null),
  (1000519, 1000104, '11-30 miles', FALSE, 3, null),
  (1000520, 1000104, '31-50 miles', FALSE, 4, null),
  (1000521, 1000104, '51-75 miles', FALSE, 5, null),
  (1000522, 1000104, 'Over 75 miles', FALSE, 6, null),

  (1000523, 1000105, 'Year', FALSE, 0, null),
  (1000524, 1000105, 'Two Years', FALSE, 1, null),
  (1000525, 1000105, 'Three Years', FALSE, 2, null),
  (1000526, 1000105, 'Four Years', FALSE, 3, null),
  (1000527, 1000105, 'Five or more Years', FALSE, 4, null),
  (1000528, 1000105, 'I have no plans to purchase or lease a new vehicle in the foreseeable future', FALSE, 5, null),
  (1000529, 1000105, 'Don\'t know', FALSE, 6, null),

  (1000530, 1000106, '1', FALSE, 0, null),
  (1000531, 1000106, '2', FALSE, 1, null),
  (1000532, 1000106, '3', FALSE, 2, null),
  (1000533, 1000106, '4', FALSE, 3, null),
  (1000534, 1000106, '5', FALSE, 4, null),
  (1000535, 1000106, '6', FALSE, 5, null),
  (1000536, 1000106, '7', FALSE, 6, null),

  (1000537, 1000107, '1', FALSE, 0, null),
  (1000538, 1000107, '2', FALSE, 1, null),
  (1000539, 1000107, '3', FALSE, 2, null),
  (1000540, 1000107, '4', FALSE, 3, null),
  (1000541, 1000107, '5', FALSE, 4, null),
  (1000542, 1000107, '6', FALSE, 5, null),
  (1000543, 1000107, '7', FALSE, 6, null),

  (1000544, 1000108, '1', FALSE, 0, null),
  (1000545, 1000108, '2', FALSE, 1, null),
  (1000546, 1000108, '3', FALSE, 2, null),
  (1000547, 1000108, '4', FALSE, 3, null),
  (1000548, 1000108, '5', FALSE, 4, null),
  (1000549, 1000108, '6', FALSE, 5, null),
  (1000550, 1000108, '7', FALSE, 6, null),

  (1000551, 1000109, '1', FALSE, 0, null),
  (1000552, 1000109, '2', FALSE, 1, null),
  (1000553, 1000109, '3', FALSE, 2, null),
  (1000554, 1000109, '4', FALSE, 3, null),
  (1000555, 1000109, '5', FALSE, 4, null),
  (1000556, 1000109, '6', FALSE, 5, null),
  (1000557, 1000109, '7', FALSE, 6, null),

  (1000558, 1000110, '1', FALSE, 0, null),
  (1000559, 1000110, '2', FALSE, 1, null),
  (1000560, 1000110, '3', FALSE, 2, null),
  (1000561, 1000110, '4', FALSE, 3, null),
  (1000562, 1000110, '5', FALSE, 4, null),
  (1000563, 1000110, '6', FALSE, 5, null),
  (1000564, 1000110, '7', FALSE, 6, null),

  (1000565, 1000111, '1', FALSE, 0, null),
  (1000566, 1000111, '2', FALSE, 1, null),
  (1000567, 1000111, '3', FALSE, 2, null),
  (1000568, 1000111, '4', FALSE, 3, null),
  (1000569, 1000111, '5', FALSE, 4, null),
  (1000570, 1000111, '6', FALSE, 5, null),
  (1000571, 1000111, '7', FALSE, 6, null),

  (1000572, 1000112, '1', FALSE, 0, null),
  (1000573, 1000112, '2', FALSE, 1, null),
  (1000574, 1000112, '3', FALSE, 2, null),
  (1000575, 1000112, '4', FALSE, 3, null),
  (1000576, 1000112, '5', FALSE, 4, null),
  (1000577, 1000112, '6', FALSE, 5, null),
  (1000578, 1000112, '7', FALSE, 6, null),

  (1000579, 1000113, '1', FALSE, 0, null),
  (1000580, 1000113, '2', FALSE, 1, null),
  (1000581, 1000113, '3', FALSE, 2, null),
  (1000582, 1000113, '4', FALSE, 3, null),
  (1000583, 1000113, '5', FALSE, 4, null),
  (1000584, 1000113, '6', FALSE, 5, null),
  (1000585, 1000113, '7', FALSE, 6, null),

  (1000586, 1000114, '1', FALSE, 0, null),
  (1000587, 1000114, '2', FALSE, 1, null),
  (1000588, 1000114, '3', FALSE, 2, null),
  (1000589, 1000114, '4', FALSE, 3, null),
  (1000590, 1000114, '5', FALSE, 4, null),
  (1000591, 1000114, '6', FALSE, 5, null),
  (1000592, 1000114, '7', FALSE, 6, null),

  (1000593, 1000115, '1', FALSE, 0, null),
  (1000594, 1000115, '2', FALSE, 1, null),
  (1000595, 1000115, '3', FALSE, 2, null),
  (1000596, 1000115, '4', FALSE, 3, null),
  (1000597, 1000115, '5', FALSE, 4, null),
  (1000598, 1000115, '6', FALSE, 5, null),
  (1000599, 1000115, '7', FALSE, 6, null),

  (1000600, 1000116, '1', FALSE, 0, null),
  (1000601, 1000116, '2', FALSE, 1, null),
  (1000602, 1000116, '3', FALSE, 2, null),
  (1000603, 1000116, '4', FALSE, 3, null),
  (1000604, 1000116, '5', FALSE, 4, null),
  (1000605, 1000116, '6', FALSE, 5, null),
  (1000606, 1000116, '7', FALSE, 6, null),

  (1000607, 1000117, '1', FALSE, 0, null),
  (1000608, 1000117, '2', FALSE, 1, null),
  (1000609, 1000117, '3', FALSE, 2, null),
  (1000610, 1000117, '4', FALSE, 3, null),
  (1000611, 1000117, '5', FALSE, 4, null),
  (1000612, 1000117, '6', FALSE, 5, null),
  (1000613, 1000117, '7', FALSE, 6, null),

  (1000614, 1000118, '1', FALSE, 0, null),
  (1000615, 1000118, '2', FALSE, 1, null),
  (1000616, 1000118, '3', FALSE, 2, null),
  (1000617, 1000118, '4', FALSE, 3, null),
  (1000618, 1000118, '5', FALSE, 4, null),
  (1000619, 1000118, '6', FALSE, 5, null),
  (1000620, 1000118, '7', FALSE, 6, null),

  (1000621, 1000119, '1', FALSE, 0, null),
  (1000622, 1000119, '2', FALSE, 1, null),
  (1000623, 1000119, '3', FALSE, 2, null),
  (1000624, 1000119, '4', FALSE, 3, null),
  (1000625, 1000119, '5', FALSE, 4, null),
  (1000626, 1000119, '6', FALSE, 5, null),
  (1000627, 1000119, '7', FALSE, 6, null),

  (1000628, 1000120, '1', FALSE, 0, null),
  (1000629, 1000120, '2', FALSE, 1, null),
  (1000630, 1000120, '3', FALSE, 2, null),
  (1000631, 1000120, '4', FALSE, 3, null),
  (1000632, 1000120, '5', FALSE, 4, null),
  (1000633, 1000120, '6', FALSE, 5, null),
  (1000634, 1000120, '7', FALSE, 6, null),

  (1000635, 1000121, '1', FALSE, 0, null),
  (1000636, 1000121, '2', FALSE, 1, null),
  (1000637, 1000121, '3', FALSE, 2, null),
  (1000638, 1000121, '4', FALSE, 3, null),
  (1000639, 1000121, '5', FALSE, 4, null),
  (1000640, 1000121, '6', FALSE, 5, null),
  (1000641, 1000121, '7', FALSE, 6, null),

  (1000642, 1000122, '1', FALSE, 0, null),
  (1000643, 1000122, '2', FALSE, 1, null),
  (1000644, 1000122, '3', FALSE, 2, null),
  (1000645, 1000122, '4', FALSE, 3, null),
  (1000646, 1000122, '5', FALSE, 4, null),
  (1000647, 1000122, '6', FALSE, 5, null),
  (1000648, 1000122, '7', FALSE, 6, null),

  (1000649, 1000123, '1', FALSE, 0, null),
  (1000650, 1000123, '2', FALSE, 1, null),
  (1000651, 1000123, '3', FALSE, 2, null),
  (1000652, 1000123, '4', FALSE, 3, null),
  (1000653, 1000123, '5', FALSE, 4, null),
  (1000654, 1000123, '6', FALSE, 5, null),
  (1000655, 1000123, '7', FALSE, 6, null),

  (1000656, 1000124, 'For me', FALSE, 0, null),
  (1000657, 1000124, 'Not for me', FALSE, 1, null),
  (1000658, 1000124, 'No opinion', FALSE, 2, null),

  (1000659, 1000125, 'Very Likely', FALSE, 0, null),
  (1000660, 1000125, 'Likely', FALSE, 1, null),
  (1000661, 1000125, 'Unlikely', FALSE, 2, null),

  (1000662, 1000126, 'Yes', FALSE, 0, null),
  (1000663, 1000126, 'No', FALSE, 1, null),
  (1000664, 1000126, 'Not Applicable', FALSE, 2, null),

  (1000665, 1000127, 'Joe', FALSE, 0, null),
  (1000666, 1000127, 'Joe', FALSE, 1, null),
  (1000667, 1000127, 'Joe', FALSE, 2, null),
  (1000668, 1000127, 'Joe', FALSE, 3, null),
  (1000669, 1000127, 'Joe', FALSE, 4, null),
  (1000670, 1000127, 'Joe', FALSE, 5, null),
  (1000671, 1000127, 'Joe', FALSE, 6, null),
  (1000672, 1000127, 'Joe', FALSE, 7, null),
  (1000673, 1000127, 'Joe', FALSE, 8, null),
  (1000674, 1000127, 'Joe', FALSE, 9, null),
  (1000675, 1000127, 'Joe', FALSE, 10, null),
  (1000676, 1000127, 'Joe', FALSE, 11, null),
  (1000677, 1000127, 'Joe', FALSE, 12, null),
  (1000678, 1000127, 'Joe', FALSE, 13, null),
  (1000679, 1000127, 'Joe', FALSE, 14, null),
  (1000680, 1000127, 'Joe', FALSE, 15, null),
  (1000681, 1000127, 'Joe', FALSE, 16, null),
  (1000682, 1000127, 'Joe', FALSE, 17, null),
  (1000683, 1000127, 'Joe', FALSE, 18, null),
  (1000684, 1000127, 'Joe', FALSE, 19, null),

  (1000685, 1000128, 'Very Likely', FALSE, 0, null),
  (1000686, 1000128, 'Likely', FALSE, 1, null),
  (1000687, 1000128, 'Unlikely', FALSE, 2, null),
  (1000688, 1000128, 'Very Unlikely', FALSE, 3, null),

  (1000689, 1000129, 'For me', FALSE, 0, null),
  (1000690, 1000129, 'Not for me', FALSE, 1, null),
  (1000691, 1000129, 'No Opinion', FALSE, 2, null),

  (1000692, 1000130, 'Yes, and I give you permission to share my contact information for this purpose', FALSE, 0, null),
  (1000693, 1000130, 'No', FALSE, 1, null),

  (1000694, 1000131, '1', FALSE, 0, null),
  (1000695, 1000131, '2', FALSE, 1, null),
  (1000696, 1000131, '3', FALSE, 2, null),
  (1000697, 1000131, '4', FALSE, 3, null),
  (1000698, 1000131, '5', FALSE, 4, null),
  (1000699, 1000131, '6', FALSE, 5, null),
  (1000700, 1000131, '7', FALSE, 6, null),

  (1000701, 1000132, '1', FALSE, 0, null),
  (1000702, 1000132, '2', FALSE, 1, null),
  (1000703, 1000132, '3', FALSE, 2, null),
  (1000704, 1000132, '4', FALSE, 3, null),
  (1000705, 1000132, '5', FALSE, 4, null),
  (1000706, 1000132, '6', FALSE, 5, null),
  (1000707, 1000132, '7', FALSE, 6, null),

  (1000708, 1000133, '1', FALSE, 0, null),
  (1000709, 1000133, '2', FALSE, 1, null),
  (1000710, 1000133, '3', FALSE, 2, null),
  (1000711, 1000133, '4', FALSE, 3, null),
  (1000712, 1000133, '5', FALSE, 4, null),
  (1000713, 1000133, '6', FALSE, 5, null),
  (1000714, 1000133, '7', FALSE, 6, null),

  (1000715, 1000134, '1', FALSE, 0, null),
  (1000716, 1000134, '2', FALSE, 1, null),
  (1000717, 1000134, '3', FALSE, 2, null),
  (1000718, 1000134, '4', FALSE, 3, null),
  (1000719, 1000134, '5', FALSE, 4, null),
  (1000720, 1000134, '6', FALSE, 5, null),
  (1000721, 1000134, '7', FALSE, 6, null),

  (1000722, 1000135, '1', FALSE, 0, null),
  (1000723, 1000135, '2', FALSE, 1, null),
  (1000724, 1000135, '3', FALSE, 2, null),
  (1000725, 1000135, '4', FALSE, 3, null),
  (1000726, 1000135, '5', FALSE, 4, null),
  (1000727, 1000135, '6', FALSE, 5, null),
  (1000728, 1000135, '7', FALSE, 6, null),

  (1000729, 1000136, '1', FALSE, 0, null),
  (1000730, 1000136, '2', FALSE, 1, null),
  (1000731, 1000136, '3', FALSE, 2, null),
  (1000732, 1000136, '4', FALSE, 3, null),
  (1000733, 1000136, '5', FALSE, 4, null),
  (1000734, 1000136, '6', FALSE, 5, null),
  (1000735, 1000136, '7', FALSE, 6, null),

  (1000736, 1000137, '1', FALSE, 0, null),
  (1000737, 1000137, '2', FALSE, 1, null),
  (1000738, 1000137, '3', FALSE, 2, null),
  (1000739, 1000137, '4', FALSE, 3, null),
  (1000740, 1000137, '5', FALSE, 4, null),
  (1000741, 1000137, '6', FALSE, 5, null),
  (1000742, 1000137, '7', FALSE, 6, null),

  (1000743, 1000138, '1', FALSE, 0, null),
  (1000744, 1000138, '2', FALSE, 1, null),
  (1000745, 1000138, '3', FALSE, 2, null),
  (1000746, 1000138, '4', FALSE, 3, null),
  (1000747, 1000138, '5', FALSE, 4, null),
  (1000748, 1000138, '6', FALSE, 5, null),
  (1000749, 1000138, '7', FALSE, 6, null),

  (1000750, 1000139, '1', FALSE, 0, null),
  (1000751, 1000139, '2', FALSE, 1, null),
  (1000752, 1000139, '3', FALSE, 2, null),
  (1000753, 1000139, '4', FALSE, 3, null),
  (1000754, 1000139, '5', FALSE, 4, null),
  (1000755, 1000139, '6', FALSE, 5, null),
  (1000756, 1000139, '7', FALSE, 6, null),

  (1000757, 1000140, '1', FALSE, 0, null),
  (1000758, 1000140, '2', FALSE, 1, null),
  (1000759, 1000140, '3', FALSE, 2, null),
  (1000760, 1000140, '4', FALSE, 3, null),
  (1000761, 1000140, '5', FALSE, 4, null),
  (1000762, 1000140, '6', FALSE, 5, null),
  (1000763, 1000140, '7', FALSE, 6, null),

  (1000764, 1000141, 'Yes', FALSE, 0, null),
  (1000765, 1000141, 'No', FALSE, 1, null),
  (1000766, 1000141, 'Not applicable', FALSE, 2, null),

  (1000767, 1000142, '1', FALSE, 0, null),
  (1000768, 1000142, '2', FALSE, 1, null),
  (1000769, 1000142, '3', FALSE, 2, null),
  (1000770, 1000142, '4', FALSE, 3, null),
  (1000771, 1000142, '5', FALSE, 4, null),

  (1000772, 1000143, 'Excellent', FALSE, 0, null),
  (1000773, 1000143, 'Very Good', FALSE, 1, null),
  (1000774, 1000143, 'Good', FALSE, 2, null),
  (1000775, 1000143, 'Poor', FALSE, 3, null),

  (1000776, 1000144, 'No', FALSE, 0, null),
  (1000777, 1000144, 'Yes', TRUE, 1, null);

insert into car_schedule (`car_id`, `date`, `active`)
values
  (1, '2018-06-01', true),
  (2, '2018-06-01', true),
  (3, '2018-06-01', true),
  (4, '2018-06-01', true),
  (5, '2018-06-01', false),
  (6, '2018-06-01', false);

# insert into time_slot (`id`, `date`, `start_time`, `end_time`, `available_count`)
#     values
#       (500000, '2018-06-11', '9:00', '9:30', 1),
#       (500001, '2018-06-11', '9:30', '10:00', 0),
#       (500002, '2018-06-11', '13:00', '13:30', 2)
# ;
#
# insert into car_slot (`time_slot_id`, `car_id`, `reserved`)
#     values
#       (500000, 1, false),
#       (500000, 2, false),
#       (500000, 3, true),
#       (500000, 4, false),
#       (500001, 1, false),
#       (500001, 2, false),
#       (500001, 3, true),
#       (500001, 4, true),
#       (500002, 1, false)
# ;

insert into user (`email`, `first_name`, `last_name`, `phone`, `zipcode`)
    values ('jarred.128@gmail.com', 'Jarred', 'Olson', 'stuff', '12345')
;