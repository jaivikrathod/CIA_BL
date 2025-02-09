CREATE TABLE `care_insurance`.`users` (`id` INT NOT NULL AUTO_INCREMENT , `type` VARCHAR(20) NOT NULL , `full_name` VARCHAR(20) NOT NULL , `mobile` VARCHAR(20) NOT NULL , `email` VARCHAR(30) NOT NULL , `password` VARCHAR(255) NOT NULL , PRIMARY KEY (`id`), UNIQUE (`mobile`), UNIQUE (`email`)) ENGINE = InnoDB;


CREATE TABLE `care_insurance`.`token` (`id` INT NOT NULL AUTO_INCREMENT , `user_id` INT NOT NULL , `token` VARCHAR(255) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;


CREATE TABLE `care_insurance`.`customer` (`id` INT NOT NULL AUTO_INCREMENT , `full_name` VARCHAR(20) NOT NULL , `email` VARCHAR(30) NOT NULL , `primary_mobile` VARCHAR(20) NOT NULL , `additional_mobile` VARCHAR(20) NOT NULL , `age` INT NOT NULL , `gender` VARCHAR(10) NOT NULL , `state` VARCHAR(20) NOT NULL , `city` VARCHAR(20) NOT NULL , `full_address` VARCHAR(255) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
