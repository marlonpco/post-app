const express = require('express');
const parser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');

const app = express();

// postapp:g9zGqV9h78gn8WU8
mongoose.connect("mongodb+srv://postapp:g9zGqV9h78gn8WU8@cluster-one-kompw.gcp.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to MongoDB-Atlas!');
  })
  .catch(() => {
    console.log('Connection failed: contact MongoDB site.');
  });

app.use(parser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS");
  next();
});

app.use('/api/posts', postRoutes);

module.exports = app;
