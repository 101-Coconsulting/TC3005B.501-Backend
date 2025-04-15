CREATE DATABASE IF NOT EXISTS CocoScheme;
USE CocoScheme;

CREATE TABLE IF NOT EXISTS Roles(
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS User(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT,
    user_name VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL,
    workstation VARCHAR(20),
    email VARCHAR(20) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_mod_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOLEAN,
  
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);

CREATE TABLE IF NOT EXISTS Request (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    status ENUM('1', '2', '3', '4', '5', '6', '7'),
    notes LONGTEXT,
    route_request_id,
    requested_fee FLOAT,
    imposed_fee FLOAT,
    request_days FLOAT,
    last_mod_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOL,
  
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (route_request_id) REFERENCES Route_Request(route_request_id)
);

CREATE TABLE IF NOT EXISTS Country (
    country_id INT PRIMARY KEY,
    country_name VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Route (
    route_id INT PRIMARY KEY,
    router_index INT,
    id_origin_country VARCHAR(20),
    id_origin_city VARCHAR(20),
    id_destination_country VARCHAR(20),
    id_destination_city VARCHAR(20),
    plane_needed BOOL,
    hotel_needed BOOL,
    begining_date DATE,
    begining_time TIME,
    ending_date DATE,
    ending_time TIME
);

CREATE TABLE IF NOT EXISTS Receipt (
    receipt_id INT PRIMARY KEY AUTO_INCREMENT,
    validation ENUM('Pending', 'Approved', 'Rejected') NOT NULL,
    submission_date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    validation_date DEFAULT CURRENT_TIMESTAMP,
  
    receipt_type_id INT ,
    request_id INT
) ;
