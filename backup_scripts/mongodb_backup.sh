#!/bin/bash
echo "[$(date)] Inicio del script de backup MongoDB" >> /var/backups/mongodb/debug_cron.log

# MongoDB connection parameters
MONGO_HOST="172.16.61.137"
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
REMOTE_USER="backupUser"
REMOTE_PASSWORD="backupPassword"  # Add the remote password here
REMOTE_HOST="172.16.61.151"
REMOTE_DIR="~/backupsmongo"

# Remove old backup locally (if it exists)
echo "Limpiando directorio local de backups..." >> /var/backups/mongodb/debug_cron.log
rm -fr $BACKUP_DIR
mkdir -p $BACKUP_DIR

# Create MongoDB backup
echo "Ejecutando mongodump..." >> /var/backups/mongodb/debug_cron.log

# Choose one of these commands based on whether you need authentication
# Without authentication:
mongodump --host $MONGO_HOST --port $MONGO_PORT --db $MONGO_DB --out "$BACKUP_DIR/$FILENAME"

# With authentication (uncomment if needed):
#mongodump --host $MONGO_HOST --port $MONGO_PORT --username $MONGO_USER --password $MONGO_PASSWORD --authenticationDatabase admin --db $MONGO_DB --out "$BACKUP_DIR/$FILENAME"

DUMP_STATUS=$?
if [ $DUMP_STATUS -eq 0 ]; then
    echo "mongodump completado exitosamente" >> /var/backups/mongodb/debug_cron.log
else
    echo "Error en mongodump (código: $DUMP_STATUS)" >> /var/backups/mongodb/debug_cron.log
    exit 1
fi

# Compress the backup
echo "Comprimiendo backup..." >> /var/backups/mongodb/debug_cron.log
tar -czf "$BACKUP_DIR/${FILENAME}.tar.gz" -C "$BACKUP_DIR" "$FILENAME"
rm -rf "$BACKUP_DIR/$FILENAME"  # Remove uncompressed directory

# Clean up remote backup directory before transferring new backup
echo "Limpiando directorio remoto..." >> /var/backups/mongodb/debug_cron.log
sshpass -p "${REMOTE_PASSWORD}" ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} "rm -fr ${REMOTE_DIR}/* && mkdir -p ${REMOTE_DIR}"
SSH_STATUS=$?

if [ $SSH_STATUS -ne 0 ]; then
    echo "Error al limpiar directorio remoto (código: $SSH_STATUS)" >> /var/backups/mongodb/debug_cron.log
fi

# Transfer new backup file
echo "Iniciando transferencia SCP..." >> /var/backups/mongodb/debug_cron.log
sshpass -p "${REMOTE_PASSWORD}" scp -o StrictHostKeyChecking=no "$BACKUP_DIR/${FILENAME}.tar.gz" ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/
SCP_STATUS=$?

if [ $SCP_STATUS -eq 0 ]; then
    echo "Transferencia SCP completada exitosamente" >> /var/backups/mongodb/debug_cron.log
else
    echo "Error en la transferencia SCP (código: $SCP_STATUS)" >> /var/backups/mongodb/debug_cron.log
fi
