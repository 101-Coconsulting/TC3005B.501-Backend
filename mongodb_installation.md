# MongoDB Installation Guide for Debian

This guide provides step-by-step instructions for installing MongoDB on Debian systems, specifically addressing common dependency issues with newer Debian versions.

## Prerequisites

- A Debian-based system (this guide focuses on Debian Bookworm)
- Root or sudo privileges
- Internet connection

## Installation Steps

### 1. Remove any incorrect repository configuration

If you previously attempted to install MongoDB using Ubuntu repositories, remove those configurations:

```bash
sudo rm -f /etc/apt/sources.list.d/mongodb-org-6.0.list
```

### 2. Import the MongoDB public GPG key

```bash
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor
```

### 3. Create a list file for MongoDB

```bash
echo "deb [signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg] http://repo.mongodb.org/apt/debian bullseye/mongodb-org/6.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

### 4. Install libssl1.1 dependency

MongoDB requires libssl1.1, which may not be available in newer Debian repositories. Install it from Debian Bullseye repositories:

```bash
# Create a temporary sources list file for Debian Bullseye
echo "deb http://security.debian.org/debian-security bullseye-security main" | sudo tee /etc/apt/sources.list.d/bullseye-security.list

# Update package lists
sudo apt update

# Install libssl1.1 from Bullseye
sudo apt install -y libssl1.1

# Remove the temporary sources list
sudo rm /etc/apt/sources.list.d/bullseye-security.list

# Update package lists again
sudo apt update
```

### 5. Install MongoDB packages

```bash
sudo apt-get install -y mongodb-org
```

### 6. Start and enable MongoDB service

```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 7. Verify MongoDB is running

```bash
sudo systemctl status mongod
```

You should see output indicating that the service is active (running).

### 8. Test MongoDB connection

```bash
mongosh
```
If you see the MongoDB shell prompt, the installation was successful. You can exit the shell by typing `exit`.

### 9. Setup bind IP

Change your bind ip by running:
`sudo vim /etc/mongod.conf`


## Configuring MongoDB for Your Project

After installation, update your project's `.env` file with the correct MongoDB connection information:

```
MONGO_URI=mongodb://localhost:27017
DB_NAME=travel_management
```
