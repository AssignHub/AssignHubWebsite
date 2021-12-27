# AssignHubWebsite - https://assignhub.app
Source code for AssignHub, including the server and Vue frontend

A live demo of the website can be found here: [DEMO](https://assignhub.github.io/demo "AssignHub Demo")

![demo preview](https://i.imgur.com/wkL8CXj.jpg "Demo Preview")

## Getting Started
### Frontend
1. `cd frontend` 
2. `npm install`
3. `npm run serve`
### Backend
1. Install redis-server. https://redis.io/topics/quickstart
2. Start the redis-server service: `sudo service redis-server restart`
3. Install mongodb 
4. Start mongodb service
5. `cd server`
6. `npm run devStart`
### To test authenticated API routes without using the frontend
1. Make sure you are in development mode `NODE_ENV === 'development'`
2. Make a request to the specified route with a `testUserId` parameter (either in the url query parameters or in the json body) specifying the user you would like to test the route on, e.g.
```
GET http://localhost:3000/classes/mine?testUserId=123456789012345678901234
```
```
POST http://localhost:3000/friends/create-request
Content-Type: application/json

{
  "testUserId": "current-users-id",
  "userId": "prospective-friends-id"
}
```

## Deployment
### Frontend
1. `cd frontend`
2. `sudo pm2 stop server`
3. `sudo npm run build`
4. `sudo pm2 start server`
### Backend
1. `sudo pm2 restart server`