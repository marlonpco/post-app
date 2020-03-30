const express = require('express');

const Post = require('../models/post');

const router = express.Router();

// routes - '/api/posts';

router.post('', (req, res, next) => {
  let post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(newPost => {
    res.status(201).json({
      message: 'Post(\#' + newPost._id + ') added successfully.',
      postId: newPost._id
    });
  });

});

router.patch('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Post(\#' + req.params.id + ') updated!'
    })
  });
})

router.get('', (req, res, next) => {
  Post.find()
    .then(fetchedPosts => {
      res.status(200).json({
        message: 'Posts successfully fetched!',
        posts: fetchedPosts
      });
    });

});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json({
        message: 'Post(\#' + post._id + ') fetched!',
        post: post
      })
    }else{
      res.status(404).json({
        message: 'Post not found!',
        post: null
      })
    }
  })
});

router.delete('/:id', (req, res, next) => {
  const postId = req.params.id;
  Post.deleteOne({_id: postId}).then(
    result => {
      console.log(result);
    }
  );
  res.status(200).json({
    message: 'Post with ' + postId + ' deleted.'
  });
});

module.exports = router;
