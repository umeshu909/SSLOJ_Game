#!/bin/bash

cd /chemin/vers/ton/repo || exit

# Ajout et commit
git add .
git commit -m "Mise à jour journalière du server"

# Push (tu dois être dans une branche, pas en detached HEAD)
git push origin main
