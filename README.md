# grader-aide

## Getting Started

remember **Don't load html file using the file:// protocol**
If you don't have node installed, follow these steps to get a server running locally.

1) clone the repo
```
git clone https://github.com/UVU-CS4690-2018/grader-aide.git
```

2) [install node](https://nodejs.org/en/)

3) install dependencies
```
npm install
```

4) run the server
```
npm start
```

## Built With Love By the CS4690 crew


### team notes
**to get mongo db container running**
- make sure you have docker running
- if you don't have a mongo-data directory at root run this command `$ mkdir ~/mongo-data`
- run this command `$ chmod +x ./start-mongo.sh && chmode +x ./stop-mongo.sh`
- now you can start the mongo container by running `./start-mongo.sh` from the project root and stop the container by running `./stop-mongo.sh`

**example server config.json**
to use the docker container, for dev and testing, you can just copy this json exactly and add it to `config/config.json`
```json
{
  "development": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://localhost:27017/grader-aide-dev",
    "JWT_SECRET": "its working....its working"
  },
  "test": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://localhost:27017/grader-aide-test",
    "JWT_SECRET": "its working....its working"
  }
}
```
