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


CREATE TABLE survey_question (
  `id`           BIGINT(20)    NOT NULL AUTO_INCREMENT,
  `question`     VARCHAR(4096) NOT NULL,
  `survey_id`    BIGINT(20)    NOT NULL,
  `type`         VARCHAR(128)  NOT NULL,
  `order_index`  SMALLINT      NOT NULL,
  `date_created` DATETIME      NOT NULL DEFAULT now(),
  `last_updated` DATETIME      NOT NULL DEFAULT now() ON UPDATE now(),
  PRIMARY KEY (`id`),
  CONSTRAINT FOREIGN KEY (`survey_id`) REFERENCES `survey` (`id`)
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


insert into survey_question (`id`, `question`, `survey_id`, `type`, `order_index`)
values
  (1000100, 'What is the highest degree of education you completed?', 1000000, 'MC', 0),
  (1000101, 'What was your annual household income in 2017 before taxes?', 1000000, 'MC', 1),
  (1000102, 'Gender', 1000000, 'MC', 2),
  (1000103, 'Do you currently drive an electric vehicle (EV)?', 1000000, 'MC', 3),
  (1000104, 'How many miles do you drive a day?', 1000000, 'MC', 4),
  (1000105, 'Do you plan to purchase or lease a vehicle in the next….?', 1000000, 'MC', 5)
;


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
  (1000529, 1000105, 'Don\'t know', FALSE, 6, null)
;
