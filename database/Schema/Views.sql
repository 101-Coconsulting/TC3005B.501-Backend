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
        