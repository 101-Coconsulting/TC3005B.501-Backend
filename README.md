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
4. Go to the [/database/Scheme](/database/Scheme) directory.
    ```sh
    cd database/Scheme
    ```
5. [Run the `mariadb` client in batch mode](https://mariadb.com/kb/en/mariadb-command-line-client/).
    1. Load database scheme [/database/Scheme/Scheme.sql](/database/Scheme/Scheme.sql).
        ```sh
        mariadb < Scheme.sql
        ```
    2. Load database initial prepopulation [/database/Scheme/Prepopulate.sql](/database/Scheme/Prepopulate.sql).
        ```sh
        mariadb < Prepopulate.sql
        ```
    3. Load database dummy data [/database/Scheme/Dummy.sql](/database/Scheme/Dummy.sql).
        ```sh
        mariadb < Dummy.sql
        ```
    4. Load database views [/database/Scheme/Views.sql](/database/Scheme/Views.sql).
        ```sh
        mariadb < Views.sql
        ```
    5. Load database triggers [/database/Scheme/Triggers.sql](/database/Scheme/Triggers.sql).
        ```sh
        mariadb < Triggers.sql
        ```

### Running

To run the Backend, ensure the `mariadb` server is running, and utilize whichever package manager you used for dependencies to run the project.

#### Using `pnpm`

```sh
pnpm run dev
```

#### Using `npm`

```sh
npm run dev
```

And you're good to go! `nodemon` should start and you should be able to start sending requests to your specified `PORT` on `localhost`!
