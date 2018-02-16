# Stock Market App - FreeCodeCamp Project

User Stories

1. I can view a graph displaying the recent trend lines for each added stock.
2. I can add new stocks by their symbol name.
3. I can remove stocks.
4. I can see changes in real-time when any other user adds or removes a stock.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to have installed

```
Node.js v6.11.2 or greater
MongoDB v2.6.12 or greater
npm v3.10.10 or greater
```

### Installing

1. Click the fork button on the upper right hand corner of this repository.
2. Open the command line, navigate to the directory of your choice and type:

```
git clone https://github.com/yourUsername/pinterest-app.git
```

where 'yourUsername' is your github username.
Afterwards, install the dependencies by entering the following in the project directory:

```
npm install
```

Create a new .env file in the local repository directory with the following contents:

```
MONGO_URI=mongodb://localhost:27017/stockmarketapp
PORT=8080
APP_URL=http://localhost:8080/
```

Run MongoDB in a separate command line window by navigating to where MongoDB
is installed and enter the following:

```
mongod.exe
```

Start the server by navigating to the project directory and enter the following:

```
node server.js
```

You can then open the project in a browser by navigating to http://localhost:8080/