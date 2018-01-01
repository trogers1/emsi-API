//Import 'http' from NodeJS, require it, and store it in constant 'http'
const http = require('http');
//Import './app' .js file from NodeJS, require it, and store it in constant 'app'
const app = require('./app'); //automatically looks for .js files.

//Now, wes set up the port in which this project will run. This can be changed later when actually attached to a theoretical web app. Most servers allow us to 'inject' an environmental variable and will be set by the server we use.
const port = process.env.PORT || 3000;

//Here we create the server and pass a "listener", which is in our ./app folder.
//the listener is used everytime we recieve a request and is responsible for giving a response
const server = http.createServer(app);

//starts the server using our designated port argument.
server.listen(port);