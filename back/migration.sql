CREATE DATABASE `megatire`;

use `megatire`;


-- megatire.clients definition

CREATE TABLE `clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cc_nit` varchar(100) NOT NULL,
  `fullname` text NOT NULL,
  `email` text,
  `cellphone` varchar(20) NOT NULL,
  `registered` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);


-- megatire.headquarters definition

CREATE TABLE `headquarters` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
);


-- megatire.users definition

CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `token` text CHARACTER SET utf8mb4,
  `headquarter_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `users_FK` (`headquarter_id`),
  CONSTRAINT `users_FK` FOREIGN KEY (`headquarter_id`) REFERENCES `headquarters` (`id`)
);


-- megatire.vehicles definition

CREATE TABLE `vehicles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `plate` varchar(10) NOT NULL,
  `tipo` varchar(10) NOT NULL,
  `client_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicles_FK` (`client_id`),
  CONSTRAINT `vehicles_FK` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`)
);


-- megatire.services definition

CREATE TABLE `services` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `headquarter_id` bigint unsigned DEFAULT NULL,
  `price` float DEFAULT NULL,
  `description` text,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `services_FK` (`user_id`),
  KEY `services_FK_1` (`headquarter_id`),
  KEY `services_FK_2` (`vehicle_id`),
  CONSTRAINT `services_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `services_FK_1` FOREIGN KEY (`headquarter_id`) REFERENCES `headquarters` (`id`),
  CONSTRAINT `services_FK_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
);


-- megatire.contact_us definition

CREATE TABLE `contact_us` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cellphone` varchar(20) DEFAULT NULL,
  `content` text,
  `email` text,
  `fullname` text,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` datetime DEFAULT NULL,
  `reviewed_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_us_FK` (`reviewed_by`),
  CONSTRAINT `contact_us_FK` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`)
);

INSERT INTO megatire.headquarters (name,address) VALUES
	 ('carrera 18','cra 18');

INSERT INTO megatire.users (username,password,token,headquarter_id) VALUES
	 ('admin','81dc9bdb52d04dc20036dbd8313ed055','eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImhlYWRxdWFydGVyX2lkIjoxLCJuYW1lIjoiY2FycmVyYSAxOCIsImFkZHJlc3MiOiJjcmEgMTgiLCJleHAiOjE2OTc2Mzk4Mzh9',1);

