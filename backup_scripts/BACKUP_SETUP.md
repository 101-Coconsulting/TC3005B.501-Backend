# Backup Script Instructions

## MariaDB
### Location
In the VM, create the backup script by running:
`sudo vim /usr/local/bin/backup-mariadb.sh`

### Shell Script
1. Add the following content to the script, changing the user and password as necessary:
```sh
BACKUP_DIR="/var/backups/mariadb"
mkdir -p $BACKUP_DIR
mysqldump -u your_user -p'your_password' travel_management > $BACKUP_DIR/travel_management_$(date +%Y%m%d).sql
```
2. Make the script an executable:
`sudo chmod +x /usr/local/bin/backup-mariadb.sh`

3. Schedule the script to run as you need:
`echo "@daily root /usr/local/bin/backup-mariadb.sh" | sudo tee -a /etc/crontab`


## MongoDB
In the VM, create the backup script by running:

