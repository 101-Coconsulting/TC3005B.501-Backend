#!/bin/bash

# Generate private key for CA 
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -out ca.key

# Generate root certificate for CA 
openssl req -x509 -new -nodes -key ca.key -sha256 -days 365 -out ca.crt -config openssl.cnf

# Generate private key for the server 
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -out server.key

# Create the Certificate Signing Request (CSR) and signing certificates using CA  
openssl req -new -key server.key -out server.csr -config openssl.cnf

# Sign certificates using CA 
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365 -sha256

echo "Certificates generated succesfully"
