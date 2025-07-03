const express = require('express');
const cors = require('cors');
const membresRoutes = require('./routes/membres');
const tasksRoutes = require('./routes/task');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/membres', membresRoutes);
app.use('/api/tasks', tasksRoutes);

app.use(cors({
  origin: 'http://212.83.130.191',
  credentials: true
}));

module.exports = app;
