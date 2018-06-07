CREATE TABLE car (
  `id`                BIGINT(20)   NOT NULL AUTO_INCREMENT,
  `make`              VARCHAR(256) NOT NULL,
  `model`             VARCHAR(256) NOT NULL,
  `image_url`         VARCHAR(1024)         DEFAULT NULL,
  `type`              VARCHAR(256) NOT NULL,
  `msrp`              VARCHAR(256) NOT NULL,
  `range`             VARCHAR(256) NOT NULL,
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
  `scheduled_start_date` DATETIME   NOT NULL,
  `scheduled_end_date`   DATETIME   NOT NULL,
  `date_created`         DATETIME   NOT NULL DEFAULT now(),
  `last_updated`         DATETIME   NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`),
  CONSTRAINT FOREIGN KEY (`car_id`) REFERENCES `car` (`id`)
)
  ENGINE = InnoDB
  AUTO_INCREMENT = 50000
  DEFAULT CHARSET = utf8;


CREATE TABLE user_drive_map (
  `user_id`      BIGINT(20) NOT NULL,
  `drive_id`     BIGINT(20) NOT NULL,
  `role`         DATETIME   NOT NULL,
  `date_created` DATETIME   NOT NULL DEFAULT now(),
  `last_updated` DATETIME   NOT NULL DEFAULT now() ON UPDATE now(),
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
  `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
  `car_id`       BIGINT(20) NOT NULL,
  `date`         DATE       NOT NULL,
  `active`       BOOLEAN    NOT NULL,
  `date_created` DATETIME   NOT NULL DEFAULT now(),
  `last_updated` DATETIME   NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`),
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
  PRIMARY KEY (`id`)
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
  CONSTRAINT FOREIGN KEY (`car_id`) REFERENCES `car` (`id`)
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

insert into car (`id`, `make`, `model`, `image_url`, `type`, `msrp`, `range`, `battery_size`, `charging_standard`, `charge_time`)
values
  (1, 'BMW', 'i3', 'http://', 'Battery Electric Vehicle (BEV)', '$44,450 before tax credits', '114 EV miles', '33 kWh',
   'Level 2 (240V)', '4-5 hours'),
  (2, 'Nissan', 'Leaf', 'http://', 'Battery Electric Vehicle (BEV)', '$29,900 before tax credits', '151 EV miles',
   '40 kWh', 'Level 2 (240V)', '8 hours'),
  (3, 'Toyota', 'Prius Prime', 'http://', 'Plug-In Hybrid Electric Vehicle (PHEV)', '$27,100 before tax credits',
   '25 EV miles (640 Total)', '8.8 kWh', 'Level 2 (240V)', '2.1 hours'),
  (4, 'Honda', 'Clarity', 'http://', 'Plug-In Hybrid Electric Vehicle (PHEV)', '$33,400 before tax credits',
   '48 EV miles (340 Total)', '17 kWh', 'Level 2 (240V)', '2-3 hours'),
  (5, 'Chevrolet', 'Volt', 'http://', 'Plug-In Hybrid Electric Vehicle (PHEV)', '$34,095 before tax credits',
   '53 EV miles (420 Total)', '18.4 kWh', 'Level 2 (240V)', '4-5 hours'),
  (6, 'Mercedes', 'GLE 550e', 'http://', 'Plug-In Hybrid Electric Vehicle (PHEV)', '$66,700 before tax credits',
   '10 EV miles (??? Total)', '3.3 kWh', 'Level 2 (240V)', '2.3 hours');


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
  (1000506, 'On a scale of 1 – 7 (1 = not at all important, 7 = extremely important), please indicate the importance of each of the following vehicle features in your next vehicle', 1000000, 6),
  (1000507, 'On a scale of 1-7 (1 = strongly disagree, 7 = strongly agree), please indicate how strongly you agree or disagree with the following statements about electric vehicles (EVs): ', 1000000, 7),
  (1000508, null, 1000000, 8),
  (1000509, null, 1000000, 9),
  (1000510, null, 1000000, 10);


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
   1000510, 'MC', 0);


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
  (1000664, 1000126, 'Not Applicable', FALSE, 2, null);
