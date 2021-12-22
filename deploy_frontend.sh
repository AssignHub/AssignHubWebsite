#!/bin/bash

# Check arguments
if [ $# -ne 2 ]
then
  echo "ERROR: Incorrect number of arguments! USAGE: deploy_frontend.sh SERVER_HOST AWS_KEY_LOCATION"
  exit 1
fi

SERVER_HOST="$1"
AWS_KEY_LOCATION="$( pwd )/$2"
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
DEPLOY_BRANCH="master" # The branch to deploy
DIST_FOLDER_SERVER_LOCATION="~/dist" #"/assignhub/frontend/dist/" # The location of the dist folder on the server

# Check if aws key file exists
if test ! -f "$AWS_KEY_LOCATION"
then
  echo "ERROR: File \"$AWS_KEY_LOCATION\" does not exist!"
  exit 1
fi

# Check if on correct branch
cd $SCRIPT_DIR/frontend
CUR_BRANCH="$( git rev-parse --abbrev-ref HEAD )"
if [ "$CUR_BRANCH" != "$DEPLOY_BRANCH" ]
then
  echo "ERROR: Current branch is not \"$DEPLOY_BRANCH\". Please switch the current branch to \"$DEPLOY_BRANCH\" before deploying."
  exit 1
fi

# Build frontend
echo "Building frontend..."
npm install
npm run build

# Delete old build 
echo -n "Deleting old dist folder..."
ssh $SERVER_HOST -i $AWS_KEY_LOCATION "rm -rf $DIST_FOLDER_SERVER_LOCATION"
echo "Done!"

# Transfer build to server
echo "Transferring build to server..."
scp -i $AWS_KEY_LOCATION -r $SCRIPT_DIR/frontend/dist $SERVER_HOST:$DIST_FOLDER_SERVER_LOCATION

echo "Done!"