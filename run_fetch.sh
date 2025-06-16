#!/bin/bash
# Charge l’environnement NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Se place dans le dossier du script
cd /home/ubuntu/SSLOJ_Game

# Exécution du script avec le bon Node
/home/ubuntu/.nvm/versions/node/v20.19.2/bin/node fetchPatchNote.js >> patchnote.log 2>&1
