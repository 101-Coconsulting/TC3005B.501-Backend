# SQL Standard Rules for 101-Coconsulting

## 0. Examples

Creating a Table: {#example-creating-table}

    ```sql
    CREATE TABLE IF NOT EXISTS User (
        user_id INT PRIMARY KEY,
        user_name VARCHAR(20),
        creation_date FLOAT,
        -- Department where the user works
        department_id INT FOREIGN KEY
    );
    ```

Creating a SELECT Query: {#example-select-query}

    ```sql
    SELECT u.user_id,
           u.name,
           u.email,
           d.department_id,
      FROM User AS u
      JOIN Department AS d
        ON u.department_id = d.department_id
     WHERE u.name = 'Pedro Mauri'
        OR u.name = 'Salvador Vaquero';
    ```

Creating a SELECT Query with CASE: {#example-select-query-case}

    ```sql
    SELECT u.user_id,
           u.name,
           u.email,
           CASE
                WHEN u.user_id < 10 THEN 'First users';
                WHEN u.user_id > 100 THEN 'Last users';
                ELSE 'Other'
           END AS user_category
      FROM User AS u;
    ```

Creating a INSERT Query: {#example-insert-query}

    ```sql
    INSERT INTO User(user_id, name, email) VALUES
        (1, 'Pedro', 'mauri@tec.mx'),
        (2, 'Salvador', 'un_men@tec.mx'),
        (3, 'Fernando', 'nier@tec.mx'),
        (4, 'Natalia', 'nat@tec.mx'),
        (5, 'Enique', 'quique@tec.mx');
    ```

Creating a UPDATE Query: {#example-update-query}

    ```sql
    UPDATE User
    SET user_id = 3107
    WHERE name = 'Pedro';
    ```

Creating a DELETE Query: {#example-delete-query}

    ```sql
    DELETE FROM User
    WHERE name = 'Sosa';
    ```

Creating a BEFORE Trigger: {#example-creating-before-trigger}

    ```sql
    DELIMITER $$

    CREATE OR REPLACE TRIGGER [TriggerName]
    BEFORE [crud action] ON [TableName]
    FOR EACH ROW
    BEGIN
        IF [condition] THEN
            [query]
        ELSE IF [condition] THEN
            [query]
        END IF;
    END$$
    ```

Creating a AFTER Trigger: {#example-creating-after-trigger}

    ```sql
    DELIMITER $$

    CREATE OR REPLACE TRIGGER [TriggerName]
    AFTER [crud action] ON [TableName]
    FOR EACH ROW
    BEGIN
        IF [condition] THEN
            [query]
        ELSE IF [condition] THEN
            [query]
        END IF;
    END$$
    ```

Trigger with OLD and NEW selected words: {#example-trigger-with-old-and-new}

    ```sql
    DELIMITER $$

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
    END$$
    ```

Creating a VIEW: {#example-creating-view}

    ```sql
    CREATE OR REPLACE VIEW [ViewName] AS
        SELECT
            [TableName].[RowName],
            [TableName].[RowName],

            GROUP_CONCAT(),
            GROUP_CONCAT()
        FROM
            [TableName1]
            LEFT JOIN [TableName2]
                ON [TableName1].[Row] = [TableName2].[Row]
        GROUP BY
            [TableName].[RowName],
            [TableName].[RowName];
    ```


## 1. SQL Reserved Words Rule

- Use uppercase letters for SQL reserved words. This makes the code easier to read and understand. (CREATE, TABLE, INT, VARCHAR, SELECT, FROM, WHERE, AND, OR, etc.)

## 2. Naming Tables and Columns Rules

Check the example: [Creating a Table](#example-creating-table).

### Tables

- Use capital letters only for the first letter of table names.

- Do not use plural forms for table names.

### Table Elements (Columns)

- Use descriptive IDs for primary keys, such as "user_id".

- Do not use capital letters in column names.

### General Naming Rules (Applies to both, Tables and Columns)

- Names should not be too long (10 characters max).

- Use underscores ('_') only if necessary when the name consists of two or more words.

- Do not use plural for column names.
    + Example: Use "user" instead of "users".

- Ensure the name is not an SQL reserved word. If necessary, use double quotes (" ").

- Names must be unique; do not use the same name for other tables nor rows.

- Do not use special caracters ('$, &, *, etc.').

- Do not start names with an underscore ('_').

- Avoid abbreviations, unless absolutely necessary.

## 3. Comments

- Avoid using comments unless absolutely necessary for explaining of a table, column, query, etc.

There are two ways to write a comment in SQL:

- For one line.

- For multiple lines.

    + Example:
    ```sql
    -- Single-line comment
    /*
    Multi-line comment
    */
    ```

## 4. Query Formatting Rules

### SELECT Query

Check the example: [Creating a SELECT Query](#example-select-query).

- Write SQL keywords at the beginning of the line, followed by the rest of the code. ('Keywords' | 'Rest of the code').

- If the WHERE clause has multiple conditions (AND, OR), write them in separate lines.

- Use AS for aliases when necessary for better readability.

- Use JOIN when a FOREIGN KEY is involved.

- Format CASE statements properly, aligning END with CASE. Check the example: [Creating a SELECT Query with CASE](#example-select-query-case). For this case.

### For INSERT, UPDATE and DELETE Queries

Check the following examples:

[Creating a INSERT Query](#example-insert-query).

[Creating a UPDATE Query](#example-update-query).

[Creating a DELETE Query](#example-delete-query).

- Use tabs before the values you want to INSERT. In the case of multiple lines of VALUES, use the tab for each.

- For UPDATE and DELETE queries, follow the SELECT query structure is not  necessary, just separate them into multiple lines.

## 5. Triggers Formatting Rules

- The only tabs to use in triggers are; inside the logic code of the trigger (query and conditions), located between BEGIN and END selected words.

- There are two types of trigger; BEFORE and AFTER triggers, you have to determinate when you want to activate the trigger; before or after the crud function being in use.

Check the following examples:

[Creating a BEFORE Trigger](#example-creating-before-trigger).

[Creating a AFTER Trigger](#example-creating-after-trigger).

- OLD and NEW are special selected words for triggers in UPDATES, INSERTS and DELETEING queries. There are use to reference data that is beinging change in the data base.

Check this example: [Trigger using OLD and NEW](#example-trigger-with-old-and-new).

## 6. Views Formatting Rules

- 

Check the example: [Creating a View](#example-creating-view).


## References

Rules, examples and info based from: https://learnsql.es/blog/24-reglas-del-estandar-de-formato-sql/
