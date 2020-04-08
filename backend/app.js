const path = require('path');
const express = require('express');
const parser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();

// postapp:g9zGqV9h78gn8WU8/node-angular
const username = 'postapp';
const password = 'g9zGqV9h78gn8WU8';
const collection = 'node-angular';

const mongooseConfiguration = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
  autoIndex: true, // Do build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};
const urlConfiguration = "mongodb+srv://" + username + ":" + password +
  "@cluster-one-kompw.gcp.mongodb.net/" + collection + "?retryWrites=true&w=majority";

mongoose.connect(urlConfiguration, mongooseConfiguration)
  .then(() => {
    console.log('Connected to MongoDB-Atlas!');
  })
  .catch(() => {
    console.log('Connection failed: contact MongoDB site.');
  });

app.use(parser.json());
app.use(parser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS");
  next();
});

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
