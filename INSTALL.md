# API Developer Technical Project -- Taylor Rogers 

## Requirements
To start, run, and test this API you will need:
* <a href="https://nodejs.org/en/download/" target="_blank">NodeJS</a> to start and run it. 
* To test it, and more easily simulate POST requests, I recommend the <a href="https://www.getpostman.com/apps" target="_blank">Postman</a> application. 

Download and install the above software and you're ready to begin.

Once downloaded, in terminal (or whatever your preferred command line/terminal emulator), `cd` into the directory containing this file, as well as `package.json`, `app.js` and `server.js`. Once there, type `npm install` to install dependencies.

After all dependencies have installed, use `npm start` to start the API. 

## Testing
In the Postman application, type `localhost:3000/` into the url bar at the top of the screen. 

To simulate the GET request, select GET from the dropdown, append `city/` or `city/:CityID/` to the above URL, and press SEND. The response JSON will appear below.

To simulate a POST request, select POST from dropdown, select Body under the URL bar, select raw, select JSON from the small dropdown menu, and type the json you want to send (you can copy and paste the one below). Then, type `localhost:3000/rank/` into the URL bar and press SEND. The response JSON will appear below.

## Example POST JSON
```
{
	"weights": {
		"walkability": 1.0,
		"job_growth": 1.0,
		"green_space": 2.5,
		"taxes": 0.5
	}
}
```