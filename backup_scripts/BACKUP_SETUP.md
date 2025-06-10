# Backup Script Instructions

## MariaDB
### Location
In the VM, create the backup script by running:
`sudo vim /usr/local/bin/backup-mariadb.sh`

### Shell Script
### 1. Add the following content to the script, changing the user and password as necessary:

```sh
#!/bin/bash
echo "[$(date)] Inicio del script" >> /home/Gwenvito/debug_cron.log
USER="db_user"
PASSWORD="your_secure_password"
DATABASE="CocoScheme"
BACKUP_DIR="/var/backups/mariadb"
DATE=$(date +"%Y%m%d_%H%M%S")
FILENAME="${DATABASE}_${DATE}.sql"

# Remove old backup (if it exists)
rm -fr $BACKUP_DIR
mkdir -p $BACKUP_DIR

# Create backup
echo "Ejecutando mysqldump..." >> ~/debug_cron.log
mysqldump -u $USER -p$PASSWORD $DATABASE > "$BACKUP_DIR/$FILENAME"
echo "mysqldump finalizado" >> ~/debug_cron.log

# SCP transfer to remote VM
REMOTE_USER="remote_username"
REMOTE_HOST="remote_vm_ip_or_hostname"
REMOTE_DIR="/path/to/backup/destination"

# Clean up remote backup directory before transferring new backup
echo "Limpiando directorio remoto..." >> ~/debug_cron.log
ssh ${REMOTE_USER}@${REMOTE_HOST} "rm -fr ${REMOTE_DIR}/* && mkdir -p ${REMOTE_DIR}"
SSH_STATUS=$?

if [ $SSH_STATUS -ne 0 ]; then
    echo "Error al limpiar directorio remoto (cÃ³digo: $SSH_STATUS)" >> ~/debug_cron.log
fi

echo "Iniciando transferencia SCP..." >> ~/debug_cron.log
scp "$BACKUP_DIR/$FILENAME" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
SCP_STATUS=$?

if [ $SCP_STATUS -eq 0 ]; then
    echo "Transferencia SCP completada exitosamente" >> ~/debug_cron.log
else
    echo "Error en la transferencia SCP (c—digo: $SCP_STATUS)" >> ~/debug_cron.log
fi
```

### 2. Make the script an executable:
`sudo chmod +x /usr/local/bin/backup-mariadb.sh`

### 3. Verify the script runs:
`sudo /usr/local/bin/backup-mariadb.sh`

### 4. Check the backup was created succesfully:
`ls -la /var/backups/mariadb`

### 5. Schedule the script to run as you need:
- Install cron and crontab in the VM using `sudo apt install crontab`.
- Run `sudo crontab -e` and choose the editor of your choice (nano by default).
- At the begginning of the file, add `0 3 * * * /home/Gwenvito/backup_mariadb.sh >> ~/mariadb_backup.log 2>&1`. This will create a backup everyday at 3am and send the cron logs to the file in the home directory for your user.


## MongoDB
In the VM, create the backup script by running:

