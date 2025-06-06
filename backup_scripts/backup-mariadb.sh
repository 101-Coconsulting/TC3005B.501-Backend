!#/bin/bash
echo "[$(date)] Inicio del script" >>/home/Gwenvito/debug_cron.log

USER="db_user"
PASSWORD="your_secure_password"
DATABASE="CocoScheme"
BACKUP_DIR="/var/backups/mariadb"
DATE=$(date +"%Y%m%d_%H%M%S")
FILENAME="${DATABASE}_${DATE}.sql"

echo "Ejecutando mysqldump..." >>~/debug_cron.log

mysqldump -u $USER -p$PASSWORD $DATABASE >"$BACKUP_DIR/$FILENAME"

echo "mysqldump finalizado" >>~/debug_cron.log
