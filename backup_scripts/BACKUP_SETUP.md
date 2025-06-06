# Backup Script Instructions

## MariaDB
### Location
In the VM, create the backup script by running:
`sudo vim /usr/local/bin/backup-mariadb.sh`

### Shell Script
### 1. Add the following content to the script, changing the user and password as necessary:

```sh
!#/bin/bash
echo "[$(date)] Inicio del script" >> /home/Gwenvito/debug_cron.log

USER="db_user"
PASSWORD="your_secure_password"
DATABASE="CocoScheme"
BACKUP_DIR="/var/backups/mariadb"
DATE=$(date +"%Y%m%d_%H%M%S")
FILENAME="${DATABASE}_${DATE}.sql"

echo "Ejecutando mysqldump..." >> ~/debug_cron.log

mysqldump -u $USER -p$PASSWORD $DATABASE > "$BACKUP_DIR/$FILENAME"

echo "mysqldump finalizado" >> ~/debug_cron.log
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
- At the begginning of the file, add `0 3 * * * /home/Gwenvito/backup_mariadb.sh >> ~/mariadb_backup.log 2>&1
`

## MongoDB
In the VM, create the backup script by running:

