DROP DATABASE IF EXISTS CocoScheme;
CREATE DATABASE CocoScheme;
USE CocoScheme;


CREATE TABLE IF NOT EXISTS Role (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS Department (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(20) NOT NULL,
    costs_center VARCHAR(20),
    active BOOL NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS `User`(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT,
    department_id INT,

    user_name VARCHAR(60) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    workstation VARCHAR(20) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_mod_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOL NOT NULL DEFAULT TRUE,
  
    FOREIGN KEY (role_id) REFERENCES Role(role_id),
    FOREIGN KEY (department_id) REFERENCES Department(department_id)
);

CREATE TABLE IF NOT EXISTS Request_status (
    request_status_id INT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS `Request` (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    request_status_id INT DEFAULT 1,

    notes LONGTEXT,
    requested_fee FLOAT,
    imposed_fee FLOAT,
    request_days FLOAT,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_mod_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOL NOT NULL DEFAULT TRUE,
  
    FOREIGN KEY (user_id) REFERENCES `User`(user_id),
    FOREIGN KEY (request_status_id) REFERENCES Request_status(request_status_id)
);

CREATE TABLE IF NOT EXISTS Alert (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    request_id INT,

    alert_text LONGTEXT,
    alert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES `User`(user_id),
    FOREIGN KEY (request_id) REFERENCES `Request`(request_id)
);

CREATE TABLE IF NOT EXISTS Country (
    country_id INT PRIMARY KEY AUTO_INCREMENT,
    country_name VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS City (
    city_id INT PRIMARY KEY AUTO_INCREMENT,
    city_name VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS Route (
    route_id INT PRIMARY KEY AUTO_INCREMENT,
    id_origin_country INT,
    id_origin_city INT,
    id_destination_country INT,
    id_destination_city INT,

    router_index INT,
    plane_needed BOOL NOT NULL DEFAULT FALSE,
    hotel_needed BOOL NOT NULL DEFAULT FALSE,
    beginning_date DATE,
    beginning_time TIME,
    ending_date DATE,
    ending_time TIME,
    
    FOREIGN KEY (id_origin_country) REFERENCES Country(country_id),
    FOREIGN KEY (id_origin_city) REFERENCES City(city_id),
    FOREIGN KEY (id_destination_country) REFERENCES Country(country_id),
    FOREIGN KEY (id_destination_city) REFERENCES City(city_id)
);

CREATE TABLE IF NOT EXISTS Route_Request (
    route_request_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT,
    route_id INT,
  
    FOREIGN KEY (request_id) REFERENCES Request(request_id),
    FOREIGN KEY (route_id) REFERENCES Route(route_id)
);



CREATE TABLE IF NOT EXISTS Receipt_Type (
    receipt_type_id INT PRIMARY KEY AUTO_INCREMENT,
    receipt_type_name VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS `Receipt` (
    receipt_id INT PRIMARY KEY AUTO_INCREMENT,
    receipt_type_id INT,
    request_id INT,

    validation ENUM('Pendiente', 'Aprobado', 'Rechazado') DEFAULT 'Pendiente',
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validation_date TIMESTAMP,
  
    FOREIGN KEY (receipt_type_id) REFERENCES Receipt_Type(receipt_type_id),
    FOREIGN KEY (request_id) REFERENCES Request(request_id)
);
