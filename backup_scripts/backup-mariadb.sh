BACKUP_DIR="/var/backups/mariadb"
mkdir -p $BACKUP_DIR
mysqldump -u your_user -p'your_password' travel_management >$BACKUP_DIR/travel_management_$(date +%Y%m%d).sql
