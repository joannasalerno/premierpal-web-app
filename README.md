# PremierPal-web-app

This is a web application called PremierPal, which allows fans of the English Premier League to view various statistics and information related to the teams and top players of the league. Users can also browse the nearest bars and pubs to each team's home venue to livestream matches and immerse themselves in the lively and fun match day atmosphere.

This application consists of two separate applications, a client React application and a server Express application. You will need to ensure that both are running for the application to work.

### How to Run:

#### Client

In the client directory, you will first need to run:

#### `npm install`

This will install the required dependencies for the project (in a folder called `node_modules`). Then, you will need to run:

#### `npm start`

This should open the client project in a browser window. If a browser window does not automatically open, go to http://localhost:3000 to view the project.

#### Server

The server is Dockerised, so you will need to pull and run the correct Docker image to start the server. You can also run the server locally by first running:

#### `npm install`

This will install the required dependencies (in a folder called `node_modules`). You can then run:

#### `npm start`

This will effectively start the server application. Go to http://localhost:3001, and if the page lists "PremierPal Server", then the server is up and running.

