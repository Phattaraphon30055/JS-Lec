const express = require('express');
const Sequelize = require('sequelize');
const app = express();

// Parse incoming requests
app.use(express.json());

// Set DB URL
const dbUrl = 'http://node75878-env-6349498.proen.app.ruk-com.cloud:11822/';

// Create a connection to the database
const sequelize = new Sequelize(dbUrl);
