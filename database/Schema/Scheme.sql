CREATE DATABASE IF NOT EXISTS CocoScheme;
USE CocoScheme;

CREATE TABLE IF NOT EXISTS Roles(
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(20),
);

CREATE TABLE IF NOT EXISTS User(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT,
    user_name VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    workstation VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_mod_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOLEAN,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE Request (
    request_id INT PRIMARY KEY,
    status enum,
    notes losngtext,
    requested_fee FLOAT,
    imposed_fee FLOAT,
    request_date DATE,
    request_time TIME,
    last_mod_date DATE,
    last_mod_time TIME,
    active BOOL,
    user_id INT,
    route_request_id INT
);

CREATE TABLE Department (
    department_id INT PRIMARY KEY,
    department_name TEXT,
    costs_center TEXT,
    active BOOL
);