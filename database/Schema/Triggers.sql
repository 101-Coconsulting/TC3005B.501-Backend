USE CocoScheme;

DELIMITER $$

CREATE OR REPLACE TRIGGER DeactivateRequest
BEFORE UPDATE ON Request
FOR EACH ROW
BEGIN
    IF NEW.request_status_id IN (9, 10) THEN
        SET NEW.active = FALSE;
    END IF;
END$$

CREATE OR REPLACE TRIGGER CreateAlert
AFTER INSERT ON Request
FOR EACH ROW
BEGIN
    INSERT INTO Alert (request_id, message_id) VALUES
        (NEW.request_id, NEW.request_status_id);
END$$

CREATE OR REPLACE TRIGGER ManageAlertAfterRequestUpdate
AFTER UPDATE ON Request
FOR EACH ROW
BEGIN
    IF NEW.request_status_id IN (8, 9, 10) THEN
        DELETE FROM Alert
        WHERE request_id = NEW.request_id;
    END IF;
END$$

DELIMITER ;
