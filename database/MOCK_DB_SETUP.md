
# 📘 MariaDB Setup Guide via CLI

This guide provides step-by-step instructions for setting up a MariaDB database, user, table, and stored procedure using the MariaDB CLI.

---

## 📚 Table of Contents

1. [🔑 Connect to MariaDB CLI](#-connect-to-mariadb-cli)
2. [👤 Create a User](#-create-a-user)
3. [🗃️ Create a Database](#️-create-a-database)
4. [👥 Grant Privileges](#-grant-privileges)
5. [📂 Create a Table](#-create-a-table)
6. [📝 Insert Data](#-insert-data)
7. [⚙️ Create a Stored Procedure](#️-create-a-stored-procedure)
8. [📞 Call a Stored Procedure](#-call-a-stored-procedure)
9. [🌐 Configure .env File](#-configure-env-file)
10. [🔗 Test the Connection](#-test-the-connection)

---

## 🔑 Connect to MariaDB CLI

To access the MariaDB CLI:

```bash
mysql -u root -p
```

Enter your root password when prompted.

---

## 👤 Create a User

```sql
CREATE USER 'db_user'@'localhost' IDENTIFIED BY 'your_secure_password';
```
---

## 🗃️ Create a Database

```sql
CREATE DATABASE example_db;
```

---

## 👥 Grant Privileges

Grant the user full access to the new database:

```sql
GRANT ALL PRIVILEGES ON example_db.* TO 'db_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 📂 Create a Table

Switch to your database:

```sql
USE example_db;
```

Then create your table:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📝 Insert Data

```sql
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
```

---

## ⚙️ Create a Stored Procedure

Example: A procedure to fetch all users.

```sql
DELIMITER $$

CREATE PROCEDURE GetAllUsers()
BEGIN
  SELECT * FROM users;
END $$

DELIMITER ;
```

---

## 📞 Call a Stored Procedure

To test the stored procedure:

```sql
CALL GetAllUsers();
```

---

## 🌐 Configure `.env` File

In your project root, create a `.env` file:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=db_user
DB_PASSWORD=your_secure_password
DB_NAME=example_db
```

---

## 🔗 Test the Connection (Node.js)

The connection code using the file `db_example.js`:

```js
/* DB connection 
To use this functionality, please refer to the example
under this same folder 'db_example.js' */
import dotenv from 'dotenv';
import mariadb from 'mariadb';

dotenv.config();

const pool = mariadb.createPool({
     host: process.env.DB_HOST,
     port: process.env.DB_PORT, 
     user: process.env.DB_USER, 
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME
});

export default pool;
```

To test it with a simple query:

```js
import pool from './db_example.js';

async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("CALL GetAllUsers()");
    console.log(rows);
  } catch (err) {
    console.error("DB error: ", err);
  } finally {
    if (conn) conn.release();
  }
}

testConnection();
```
