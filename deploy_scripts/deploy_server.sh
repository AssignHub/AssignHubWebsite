#!/bin/bash

# Run shared script
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source $SCRIPT_DIR/shared.sh

# Define variables
ROOT_FOLDER_SERVER_LOCATION="/assignhub"

# Git pull on server and restart server process
echo "Deploying server..."
ssh $SERVER_HOST -i $AWS_KEY_LOCATION "cd $ROOT_FOLDER_SERVER_LOCATION && sudo git stash && sudo git pull && sudo pm2 restart server"
echo "Done!"