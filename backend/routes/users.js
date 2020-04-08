const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
        completeName: req.body.completeName
      });
      user.save()
        .then(newUser => {
          res.status(201).json({
            message: 'User(\#' + newUser._id + ') added successfully.',
            user: {
              ...newUser._doc,
              id: newUser._doc._id
            }
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        });
    });

});

router.post('/login', (req, res, next) => {
  let userData;
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user){
        return res.status(401).json({
          message: 'Authentication failed!'
        });
      }
      userData = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if(!result){
        return res.status(401).json({
          message: 'Authentication failed!'
        });
      }

      const token = jwt.sign({
        email: userData.email, userId: userData._id},
        'postapp:g9zGqV9h78gn8WU8:node-angular',
        { expiresIn: '1h' });

      res.status(200).json({
        authToken: token,
        expiresIn: 3600,
        userId: userData._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Authentication failed!'
      });
    });
});

module.exports = router;
