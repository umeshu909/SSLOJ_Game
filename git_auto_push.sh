#!/bin/bash

cd /home/ubuntu/SSLOJ_Game || exit

# Ajout et commit
git add .
git commit -m "Mise à jour journalière du server"

# Push (tu dois être dans une branche, pas en detached HEAD)
git push origin main

# Pull et réinitialisation du server
pm2 stop all
git pull origin main
npm install
npm run build
pm2 restart all
