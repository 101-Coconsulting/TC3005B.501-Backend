# TC3005B.501-Backend

API and Database for the conection and the functioning of the trip management system portal developed in course TC3005B by group 501.

## Getting Started

In order to run this Backend, the following steps are required:

### Installing

The only option currently is to clone the repository locally from GitHub.

#### Using `git`

```sh
git clone https://github.com/101-Coconsulting/TC3005B.501-Backend
```

#### Using `gh` (GitHub CLI)

```sh
gh repo clone 101-Coconsulting/TC3005B.501-Backend
```

### Dependencies

The dependencies for this project are managed using [the pnpm package manager](https://pnpm.io/), so it is recommended to use this. However, [npm](https://www.npmjs.com/) can also be used. The dependencies are automatically managed by `pnpm` in the `package.json` file, so they are installed automatically when issuing the install command.

#### Using `pnpm`

```sh
pnpm install
```

#### Using `npm`

```sh
npm install
```

### Create HTTPS certificates

To succesfully create the certificates to use the server with HTTPS you will need to follow the next steps:

#### Configuring OpenSSL

> [!Important]
> You have to download the `.cnf` file provided in SharePoint and place it in the [`/certs`](/certs) directory.

#### Generating keys and certificates

1. Access the [`/certs`](/certs) directory.

    ```sh
    cd certs
    ```

2. Run the next line of code in the terminal to ensure the [`/certs/create_certs.sh`](/certs/create_certs.sh) file is executable:

    ```sh
    chmod +x create_certs.sh
    ```

3. Run this line of code to create the certificates:

    ```sh
    ./create_certs.sh
    ```

Now you should have 6 new files in the [`/certs`](/certs) directory and should be able to run the server using HTTPS.

> [!Caution]
> After creating the certificates, when making a commit be sure not to be uploading the certificates to the repository.

### Configuring the Database

For the database to be operational, some initial configuration is required.

#### Setup MariaDB

In order to properly setup MariaDB, the following steps are required:

1. [Download `mariadb`](https://mariadb.com/kb/en/where-to-download-mariadb/).
2. It is recommended that you [secure your MariaDB installation](https://mariadb.com/kb/en/mysql_secure_installation/).
3. [Start the `mariadb` server](https://mariadb.com/kb/en/starting-and-stopping-mariadb-automatically/).
4. To setup the database with dummy data, run `pnpm dummy_db` or `node database/config/dev_db.js`from the root of the repository.
5. To setup only the database, run `pnpm empty_db` or `node database/config/init_db.js` from the root of the repository.

#### Manual MariaDB Setup

1. Go to the [/database/Scheme](/database/Scheme) directory.
    ```sh
    cd database/Scheme
    ```
2. [Run the `mariadb` client in batch mode](https://mariadb.com/kb/en/mariadb-command-line-client/). With `DB_USER` and `DB_USER_PASSWORD` being your created `mariadb` user and its password.
    i. Load database scheme [/database/Scheme/Scheme.sql](/database/Scheme/Scheme.sql).
        ```sh
        mariadb -u DB_USER -p DB_USER_PASSWORD < Scheme.sql
        ```
    ii. Load database initial prepopulation [/database/Scheme/Prepopulate.sql](/database/Scheme/Prepopulate.sql).
        ```sh
        mariadb -u DB_USER -p DB_USER_PASSWORD < Prepopulate.sql
        ```
    iii. Load database triggers [/database/Scheme/Triggers.sql](/database/Scheme/Triggers.sql).
        ```sh
        mariadb -u DB_USER -p DB_USER_PASSWORD < Triggers.sql
        ```
    iv. Load database views [/database/Scheme/Views.sql](/database/Scheme/Views.sql).
        ```sh
        mariadb -u DB_USER -p DB_USER_PASSWORD < Views.sql
        ```
    v. Load database dummy data [/database/Scheme/Dummy.sql](/database/Scheme/Dummy.sql).
        ```sh
        mariadb -u DB_USER -p DB_USER_PASSWORD < Dummy.sql
        ```

### Setup MongoDB
1. [Download `mongodb`](https://www.mongodb.com/docs/manual/installation/) using your preferred method or package manager.
2. [Download `mongosh`](https://www.mongodb.com/try/download/shell) if you want to interact with the database directly (recommended).
3. Test that mongo was installed correctly by running the `mongod` or `mongosh` command. `mongod` will usually return error codes since no connection is currently made to then database.
4. Verify that mongo is running using ` systemctl status mongod `
5. If the status appears as inactive, use the command ` systemctl start mongod `
### Environment Variables

Finally, it is crucial that a local `.env` file is created. Based off of the [`.env.example`](/.env.example) file provided, which includes all necessary environment variables to be set in order for the server to be able to connect to the `mariadb` database, as well as the required JSON Web Token(JWT) information required for verifying authorized requests and encryption.

1. Go to the [root directory](/) of your local repository.
2. Create your `.env` file based off of the [`.env.example`](/.env.example) file.
    ```sh
    cp .env.example .env
    ```
3. Edit the newly created `.env` file, and edit the required variables based on your previous [`mariadb` configuration](#configuring-the-database) and `mongodb` configuration:
    ```sh
    # Server Configuration
    PORT=3000
    NODE_ENV=development

    # Database Configuration
    DB_HOST=localhost
    DB_PORT=27017
    DB_NAME=travel_management  # Change this
    DB_USER=username  # Change this
    DB_PASSWORD=password  # Change this

    # JWT Configuration
    JWT_SECRET=your_jwt_secret_key  # Change this
    JWT_EXPIRES_IN=1d

    # API Keys (if needed)
    # API_KEY=your_api_key

    # Other Configuration
    # CORS_ORIGIN=http://localhost:3000

    MONGO_URI=mongodb://localhost:27017
    ```

### Running

To run the Backend, ensure the `mariadb` and `mongodb` servers are running, and utilize whichever package manager you used for dependencies to run the project.

#### Using `pnpm`

```sh
pnpm run dev
```

#### Using `npm`

```sh
npm run dev
```

And you're good to go! `nodemon` should start and you should be able to start sending requests to your specified `PORT` on `localhost` as well as a confirmation message of connection to the file database!
