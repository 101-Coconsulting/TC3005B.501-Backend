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
