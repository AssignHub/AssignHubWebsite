#!/bin/bash

# Run shared script
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source $SCRIPT_DIR/shared.sh

# Define variables
ROOT_FOLDER_SERVER_LOCATION="/assignhub"

# Git pull on server, npm install, and restart server process
echo "Deploying server..."
ssh $SERVER_HOST -i $AWS_KEY_LOCATION "cd $ROOT_FOLDER_SERVER_LOCATION && sudo git stash && sudo git pull && cd server && sudo npm install && sudo pm2 restart server"
echo "Done!"

# SCP some miscellaneous gitignored files
scp -i $AWS_KEY_LOCATION -r $SCRIPT_DIR/../server/schools/waldorf/allowed_emails.json $SERVER_HOST:~/
ssh $SERVER_HOST -i $AWS_KEY_LOCATION "sudo mv ~/allowed_emails.json $ROOT_FOLDER_SERVER_LOCATION/server/schools/waldorf/"