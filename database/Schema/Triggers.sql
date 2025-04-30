USE CocoScheme;

DELIMITER $$

CREATE OR REPLACE TRIGGER DeactivateRequest
BEFORE UPDATE ON `Request`
FOR EACH ROW
BEGIN
    IF NEW.request_status_id IN (7, 8) THEN
        SET NEW.active = FALSE;
    END IF;
END$$

DELIMITER ;