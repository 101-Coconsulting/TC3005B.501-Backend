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
