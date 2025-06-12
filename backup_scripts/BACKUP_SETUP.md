# Backup Script Instructions

## MariaDB

### Location

In the VM hosting your mariadb database, create the backup script by running:

```bash
sudo vim /usr/local/bin/backup-mariadb.sh
```

### Shell Script

### 1. Add the following content to the script, changing the user and password, as well as the paths as necessary:

```bash
#!/bin/bash
echo "[$(date)] Inicio del script" >> ~/debug_cron.log
USER="CocoAdmin"
PASSWORD="CocoPassword"
DATABASE="CocoScheme"
BACKUP_DIR="/var/backups/mariadb"
DATE=$(date +"%Y%m%d_%H%M%S")
FILENAME="${DATABASE}_${DATE}.sql"

# Remove old backup (if it exists)
rm -fr $BACKUP_DIR
mkdir -p $BACKUP_DIR

# Create backup
echo "Ejecutando mysqldump..." >> /var/backups/mariadb/debug_cron.log
mysqldump -u $USER -p$PASSWORD $DATABASE > "$BACKUP_DIR/$FILENAME"
echo "mysqldump finalizado" >> /var/backups/mariadb/debug_cron.log

# SCP transfer to remote VM
REMOTE_USER="backupUser"
REMOTE_PASSWORD="backupPassword"
REMOTE_HOST="172.16.61.151"
REMOTE_DIR="~/backups"

# Clean up remote backup directory before transferring new backup
echo "Limpiando directorio remoto..." >> /var/backups/mariadb/debug_cron.log
sshpass -p "${REMOTE_PASSWORD}" ssh ${REMOTE_USER}@${REMOTE_HOST} "rm -fr ${REMOTE_DIR}/* && mkdir -p ${REMOTE_DIR}"
SSH_STATUS=$?

if [ $SSH_STATUS -ne 0 ]; then
    echo "Error al limpiar directorio remoto (c—digo: $SSH_STATUS)" >> ~/debug_cron.log
fi

echo "Iniciando transferencia SCP..." >> /var/backups/mariadb/debug_cron.log
sshpass -p "${REMOTE_PASSWORD}" scp "$BACKUP_DIR/$FILENAME" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
SCP_STATUS=$?

if [ $SCP_STATUS -eq 0 ]; then
    echo "Transferencia SCP completada exitosamente" >> /var/backups/mariadb/debug_cron.log
else
    echo "Error en la transferencia SCP (c?digo: $SCP_STATUS)" >/var/backups/mariadb/debug_cron.log
fi
```

### 2. Make the script an executable:

```bash
sudo chmod +x /usr/local/bin/backup-mariadb.sh
```

### 3. Verify the script runs:

```bash
sudo /usr/local/bin/backup-mariadb.sh
```

### 4. Check the backup was created succesfully locally and in the remote backup machine:

#### Locally

```bash
ls -la /var/backups/mariadb
```

#### Remote machine

```bash
ls -la /your/backup/path
```

### 5. Schedule the script to run as you need:

- Install cron and crontab in the VM using

    ```bash
    sudo apt install crontab
    ```

- Run

    ```bash
    sudo crontab -e
    ```

    and choose the editor of your choice (nano by default).

- At the beginning of the file, add

    ```bash
    0 3 * * * /usr/local/bin/backup-mariadb.sh >> ~/mariadb_backup.log 2>&1
    ```

    This will create a backup everyday at 3am and send the cron logs to the
    file in the home directory for your user.

- Run `sudo systemctl enable --now`. You may need to install or specify a locale for crontab to be able to interpret the executable properly.
You can use the following commands for this.

```Shell
sudo apt-get update
sudo apt-get install locales
sudo locale-gen en_US.UTF-8
```

Then run `sudo dpkg-reconfigure locales`. In the menu, select `"en_US.UTF-8 UTF-8"` and `"en_US.UTF-8"` as the default locale.

Now you can update your locale with `sudo update-locale LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8`.

## MongoDB

In the VM hosting your mongodb database, create the backup script by running:

```bash
sudo vim /usr/local/bin/backup-mongodb.sh
```

### Shell Script

### 1. Add the following content to the script, changing the user and password, as well as the paths as necessary:

```bash
#!/bin/bash
echo "[$(date)] Inicio del script de backup MongoDB" >> ~/debug_cron.log

# MongoDB connection parameters
MONGO_HOST="localhost"
MONGO_PORT="27017"
MONGO_DB="fileStorage"
# If authentication is required, uncomment and set these
#MONGO_USER="db_user"
#MONGO_PASSWORD="your_secure_password"

# Backup settings
BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +"%Y%m%d_%H%M%S")
FILENAME="${MONGO_DB}_${DATE}"

# Remote server settings
REMOTE_USER="remote_username"
REMOTE_HOST="remote_vm_ip_or_hostname"
REMOTE_DIR="/path/to/backup/destination"

# Remove old backup locally (if it exists)
echo "Limpiando directorio local de backups..." >> ~/debug_cron.log
rm -fr $BACKUP_DIR
mkdir -p $BACKUP_DIR

# Create MongoDB backup
echo "Ejecutando mongodump..." >> ~/debug_cron.log

# Choose one of these commands based on whether you need authentication
# Without authentication:
mongodump --host $MONGO_HOST --port $MONGO_PORT --db $MONGO_DB --out "$BACKUP_DIR/$FILENAME"

# With authentication (uncomment if needed):
#mongodump --host $MONGO_HOST --port $MONGO_PORT --username $MONGO_USER --password $MONGO_PASSWORD --authenticationDatabase admin --db $MONGO_DB --out "$BACKUP_DIR/$FILENAME"

DUMP_STATUS=$?
if [ $DUMP_STATUS -eq 0 ]; then
    echo "mongodump completado exitosamente" >> ~/debug_cron.log
else
    echo "Error en mongodump (c¿¿digo: $DUMP_STATUS)" >> ~/debug_cron.log
    exit 1
fi

# Compress the backup
echo "Comprimiendo backup..." >> ~/debug_cron.log
tar -czf "$BACKUP_DIR/${FILENAME}.tar.gz" -C "$BACKUP_DIR" "$FILENAME"
rm -rf "$BACKUP_DIR/$FILENAME"  # Remove uncompressed directory

# Clean up remote backup directory before transferring new backup
echo "Limpiando directorio remoto..." >> ~/debug_cron.log
ssh ${REMOTE_USER}@${REMOTE_HOST} "rm -fr ${REMOTE_DIR}/* && mkdir -p ${REMOTE_DIR}"
SSH_STATUS=$?

if [ $SSH_STATUS -ne 0 ]; then
    echo "Error al limpiar directorio remoto (c¿¿digo: $SSH_STATUS)" >> ~/debug_cron.log
fi

# Transfer new backup file
echo "Iniciando transferencia SCP..." >> ~/debug_cron.log
scp "$BACKUP_DIR/${FILENAME}.tar.gz" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
SCP_STATUS=$?

if [ $SCP_STATUS -eq 0 ]; then
    echo "Transferencia SCP completada exitosamente" >> ~/debug_cron.log
else
    echo "Error en la transferencia SCP (c¿¿digo: $SCP_STATUS)" >> ~/debug_cron.log
fi
```

### 2. Make the script an executable:

```bash
sudo chmod +x /usr/local/bin/backup-mongodb.sh
```

### 3. Verify the script runs:

```bash
sudo /usr/local/bin/backup-mongodb.sh
```

### 4. Check the backup was created succesfully locally and in the remote backup machine:

#### Locally

```bash
ls -la /var/backups/mongodb
```

#### Remote machine

```bash
ls -la /your/backup/path
```

### 5. Schedule the script to run as you need:

- Install cron and crontab in the VM using

    ```bash
    sudo apt install crontab
    ```

- Run

    ```bash
    sudo crontab -e
    ```

    and choose the editor of your choice (nano by default).

- At the beginning of the file, add

    ```bash
    0 3 * * * /usr/local/bin/backup-mongodb.sh >> ~/mongodb_backup.log 2>&1
    ```

    This will create a backup everyday at 3am and send the cron logs to the
    file in the home directory for your user.
