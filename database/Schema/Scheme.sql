CREATE DATABASE IF NOT EXISTS CocoScheme;
USE CocoScheme;

CREATE TABLE IF NOT EXISTS Roles(
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(20),
);

CREATE TABLE IF NOT EXISTS User(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT,
    user_name VARCHAR(25) UNIQUE NOT NULL,
    password VARCHAR(25) NOT NULL,
    workstation VARCHAR(25) NOT NULL,
    email VARCHAR(25) UNIQUE NOT NULL,
    phone_number VARCHAR(30) UNIQUE NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_mod_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOLEAN,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE IF NOT EXISTS Request (
    request_id INT PRIMARY KEY,
    status enum,
    notes losngtext,
    requested_fee FLOAT,
    imposed_fee FLOAT,
    request_date DATE,
    request_time TIME,
    last_mod_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_mod_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOL,
    user_id INT,
    route_request_id INT
);


CREATE TABLE IF NOT EXISTS Country (
    country_id INT PRIMARY KEY,
    country_name VARCHAR(25)
);

CREATE TABLE IF NOT EXISTS Route (
    route_id INT PRIMARY KEY,
    router_index INT,
    id_origin_country VARCHAR(50),
    id_origin_city VARCHAR(50),
    id_destination_country VARCHAR(50),
    id_destination_city VARCHAR(50),
    plane_needed BOOL,
    hotel_needed BOOL,
    begining_date DATE,
    begining_time TIME,
    ending_date DATE,
    ending_time TIME
);