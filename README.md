# Transaction List Full Stack App

This project is using ReactJS at Frontend and ExpressJS with MongoDB at Backend.

Run this command to install the packages required to run the project:

1. `npm install`
2. Go to the both server and client folder and run `npm install`

## Backend Setup

The Database configuration is present in the server/config/dbConfig.js file. There you can set the db credentials details.

To see DB with fake data go to the folder seeders and run this command

`node seedDatabase.js`

The backend will be running on port 3001 by default.

## Frontend Setup

1. For styling we are using bootstrap and SCSS.
2. For doing API call Axios is being used

After installing the packages go to the root folder and run this command to start both backend and frontend:

`npm start`
