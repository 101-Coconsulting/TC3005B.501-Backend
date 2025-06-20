USE CocoScheme;

CREATE OR REPLACE TRIGGER DeactivateRequest
BEFORE UPDATE ON Request
FOR EACH ROW
BEGIN
    IF NEW.request_status_id IN (9, 10) THEN
        SET NEW.active = FALSE;
    END IF;
END;

CREATE OR REPLACE TRIGGER CreateAlert
AFTER INSERT ON Request
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM AlertMessage WHERE message_id = NEW.request_status_id) THEN
        INSERT INTO Alert (request_id, message_id) VALUES
            (NEW.request_id, NEW.request_status_id);
    END IF;
END;

CREATE OR REPLACE TRIGGER ManageAlertAfterRequestUpdate
AFTER UPDATE ON Request
FOR EACH ROW
BEGIN
    IF NEW.request_status_id IN (8, 9, 10) THEN
        DELETE FROM Alert
        WHERE request_id = NEW.request_id;
    ELSEIF OLD.request_status_id <> NEW.request_status_id THEN
        UPDATE Alert
        SET message_id = NEW.request_status_id
        WHERE request_id = NEW.request_id;
    END IF;
END;

CREATE OR REPLACE TRIGGER DeductFromWalletOnFeeImposed
AFTER UPDATE ON Request
FOR EACH ROW
BEGIN
    IF NEW.imposed_fee IS NOT NULL AND (OLD.imposed_fee IS NULL OR NEW.imposed_fee != OLD.imposed_fee) THEN
        UPDATE `User`
        SET wallet = wallet - (NEW.imposed_fee - IFNULL(OLD.imposed_fee, 0))
        WHERE user_id = NEW.user_id;
    END IF;
END;

CREATE OR REPLACE TRIGGER AddToWalletOnReceiptApproved
AFTER UPDATE ON Receipt
FOR EACH ROW
BEGIN
    IF NEW.validation = 'Aprobado' AND OLD.validation != 'Aprobado' THEN
        UPDATE `User` u
        JOIN Request r ON r.request_id = NEW.request_id
        SET u.wallet = u.wallet + NEW.amount
        WHERE u.user_id = r.user_id;
    END IF;
END;

/*
CREATE OR REPLACE TRIGGER ResetRejectedReceipts
AFTER UPDATE ON Request
FOR EACH ROW
BEGIN
    IF OLD.request_status_id = 7 AND NEW.request_status_id = 6 THEN
        UPDATE Receipt
        SET validation = 'Pendiente'
        WHERE request_id = NEW.request_id
        AND validation = 'Rechazado';
    END IF;
END;
*/
