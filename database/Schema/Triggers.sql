USE CocoScheme;

DELIMITER $$

CREATE TRIGGER DeleteAlert
AFTER UPDATE ON `Request`
FOR EACH ROW
BEGIN
    IF NEW.request_status_id IN (8, 9, 10) THEN
        DELETE FROM Alert
        WHERE request_id = NEW.request_id;
    END IF;
END$$

DELIMITER ;