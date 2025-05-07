# TC3005B.501-Backend
API y Base de Datos para la conexión y el funcionamiento del portal del sistema gestor de viajes desarrollado en la clase TC3005B por el grupo 501. 

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

> [!Important]
> You have to download the .cnf file provided in OneDrive and place it in the `TC3005B.501-Backend/certs` directory.

- Access the directory `TC3005B.501-Backend/certs`
- Run the next line of code in the terminal to make the file and executable:

  ```gitbash
  chmod +x create_certs.sh
  ```
  
- Run this line of code to create the certificates:

    ```gitbash
  ./create_certs.sh
  ```

Now you should have 6 new files in the `TC3005B.501-Backend/certs` directory and should be able to run the server using HTTPS.

> [!Caution]
> After creating the certificates, when making a commit be sure not to be uploading the certificates to the repository.
