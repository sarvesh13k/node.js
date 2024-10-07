const express = require('express');
const taskController = require('./controllers/taskController');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Task Route
app.post('/api/v1/task', taskController.processTask);

module.exports = app;
