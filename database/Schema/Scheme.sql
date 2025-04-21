CREATE DATABASE IF NOT EXISTS CocoScheme;
USE CocoScheme;


CREATE TABLE IF NOT EXISTS Role(
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Department (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(20),
    costs_center VARCHAR(20),
    active BOOL
);

CREATE TABLE IF NOT EXISTS `User`(
    user_id INT PRIMARY KEY,
    role_id INT,
    department_id INT,
    user_name VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    workstation VARCHAR(20),
    email VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_mod_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOL,
  
    FOREIGN KEY (role_id) REFERENCES Role(role_id),
    FOREIGN KEY (department_id) REFERENCES Department(department_id)
);

CREATE TABLE IF NOT EXISTS `Alert` (
    alert_id INT PRIMARY KEY,
    user_id INT,
    alert_text LONGTEXT,
    alert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
    FOREIGN KEY (user_id) REFERENCES `User`(user_id)
);



CREATE TABLE IF NOT EXISTS `Request` (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    status ENUM('1', '2', '3', '4', '5', '6', '7'),
    notes LONGTEXT,
    route_request_id INT,
    requested_fee FLOAT,
    imposed_fee FLOAT,
    request_days FLOAT,
    last_mod_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOL,
  
    FOREIGN KEY (user_id) REFERENCES `User`(user_id),
    FOREIGN KEY (route_request_id) REFERENCES Route_Request(route_request_id)
);

CREATE TABLE IF NOT EXISTS Country (
    country_id INT PRIMARY KEY AUTO_INCREMENT,
    country_name VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS City (
    city_id INT PRIMARY KEY AUTO_INCREMENT,
    city_name VARCHAR(20) 
);

CREATE TABLE IF NOT EXISTS Route (
    route_id INT PRIMARY KEY AUTO_INCREMENT,
    router_index INT,

    id_origin_country INT,
    id_origin_city INT,
    id_destination_country INT,
    id_destination_city INT,
  
    plane_needed BOOL,
    hotel_needed BOOL,
    beginning_date DATE,
    beginning_time TIME,
    ending_date DATE,
    ending_time TIME,
    
    FOREIGN KEY (id_origin_country) REFERENCES Country(id_origin_country),
    FOREIGN KEY (id_origin_city) REFERENCES City(id_origin_city),
    FOREIGN KEY (id_destination_country) REFERENCES Country(id_destination_country),
    FOREIGN KEY (id_destination_city) REFERENCES City(id_destination_city)
);

CREATE TABLE IF NOT EXISTS Route_Request (
    route_request_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT,
    route_id INT,
  
    FOREIGN KEY (request_id) REFERENCES Request(request_id),
    FOREIGN KEY (route_id) REFERENCES Route(route_id)
);



CREATE TABLE IF NOT EXISTS Receipt_Type(
    receipt_type_id INT PRIMARY KEY AUTO_INCREMENT,
    receipt_type_name VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS `Receipt` (
    receipt_id INT PRIMARY KEY AUTO_INCREMENT,
    receipt_type_id INT,
    request_id INT,
    validation ENUM('Pending', 'Approved', 'Rejected') NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    validation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
    FOREIGN KEY (receipt_type_id) REFERENCES Receipt_Type(receipt_type_id),
    FOREIGN KEY (request_id) REFERENCES Request(request_id)
);
