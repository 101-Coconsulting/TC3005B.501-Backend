USE CocoScheme;

CREATE OR REPLACE VIEW UserRequestHistory AS
    SELECT
        `Request`.request_id,
        `Request`.user_id,
        `Request`.creation_date,
        Request_status.status,
        GROUP_CONCAT(DISTINCT Country_origin.country_name ORDER BY Route.router_index SEPARATOR ', ') AS trip_origins,
        GROUP_CONCAT(DISTINCT Country_destination.country_name ORDER BY Route.router_index SEPARATOR ', ') AS trip_destinations
    FROM
        `Request`
        INNER JOIN Request_status
            ON `Request`.request_status_id = Request_status.request_status_id
        LEFT JOIN Route_Request
            ON `Request`.request_id = Route_Request.request_id
        LEFT JOIN Route
            ON Route_Request.route_id = Route.route_id
        LEFT JOIN Country AS Country_origin
            ON Route.id_origin_country = Country_origin.country_id
        LEFT JOIN Country AS Country_destination
            ON Route.id_destination_country = Country_destination.country_id
    GROUP BY
        `Request`.request_id,
        `Request`.user_id,
        `Request`.last_mod_date,
        Request_status.status;

CREATE OR REPLACE VIEW RequestWithRouteDetails AS
    SELECT
        `Request`.request_id,
        `Request`.user_id,
        `Request`.request_status_id,
        `Request`.notes,
        `Request`.requested_fee,
        `Request`.imposed_fee,
        `Request`.request_days,
        `Request`.creation_date,
        `Request`.last_mod_date,
        `Request`.active,
        GROUP_CONCAT(DISTINCT Country_origin.country_name ORDER BY Route.router_index SEPARATOR ', ') AS origin_countries,
        GROUP_CONCAT(DISTINCT City_origin.city_name ORDER BY Route.router_index SEPARATOR ', ') AS origin_cities,
        GROUP_CONCAT(DISTINCT Country_destination.country_name ORDER BY Route.router_index SEPARATOR ', ') AS destination_countries,
        GROUP_CONCAT(DISTINCT City_destination.city_name ORDER BY Route.router_index SEPARATOR ', ') AS destination_cities
    FROM
        `Request`
        LEFT JOIN Route_Request
            ON `Request`.request_id = Route_Request.request_id
        LEFT JOIN Route
            ON Route_Request.route_id = Route.route_id
        LEFT JOIN Country AS Country_origin
            ON Route.id_origin_country = Country_origin.country_id
        LEFT JOIN City AS City_origin
            ON Route.id_origin_city = City_origin.city_id
        LEFT JOIN Country AS Country_destination
            ON Route.id_destination_country = Country_destination.country_id
        LEFT JOIN City AS City_destination
            ON Route.id_destination_city = City_destination.city_id
    GROUP BY
        `Request`.request_id,
        `Request`.user_id,
        `Request`.request_status_id,
        `Request`.notes,
        `Request`.requested_fee,
        `Request`.imposed_fee,
        `Request`.request_days,
        `Request`.creation_date,
        `Request`.last_mod_date,
        `Request`.active;

