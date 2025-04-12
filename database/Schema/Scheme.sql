CREATE DATABASE IF NOT EXISTS CocoScheme;
USE CocoScheme;

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


CREATE TABLE Route (
    route_id INT PRIMARY KEY,
    router_index INT,
    id_origin_country VARCHAR(10),
    id_origin_city VARCHAR(10),
    id_destination_country VARCHAR(10),
    id_destination_city VARCHAR(10),
    plane_needed BOOL,
    hotel_needed BOOL,
    begining_date DATE,
    begining_time TIME,
    ending_date DATE,
    ending_time TIME
);