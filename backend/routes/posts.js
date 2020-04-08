const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const auth = require('../auth/checkAuth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storageConfiguration = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = null;
    if(!isValid){
      error = new Error('Invalid mime type');;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    let filename = name + '-' + Date.now() + '.' + extension;
    cb(null, filename);
  }
});

// routes - '/api/posts';
router.post('', auth, multer({storage: storageConfiguration}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  let imagePath = url + '/images/' + req.file.filename;
  let post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  post.save().then(newPost => {
    res.status(201).json({
      message: 'Post(\#' + newPost._id + ') added successfully.',
      post: {
        ...newPost,
        id: newPost._id
      }
    });
  });

});

router.patch('/:id', auth, multer({storage: storageConfiguration}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  let userId = req.userData.userId;

  if(req.file){
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }

  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({_id: req.params.id, creator: userId}, post)
    .then(result => {
      if(result.nModified <= 0){
        return res.status(401).json({
          message: 'User not authorized.'
        });
      }
      res.status(200).json({
        message: 'Post(\#' + req.params.id + ') updated!'
      });
    });
})

router.delete('/:id', auth, (req, res, next) => {
  const postId = req.params.id;
  let userId = req.userData.userId;
  Post.deleteOne({_id: postId, creator: userId})
    .then(
      result => {
        if(result.deletedCount <= 0){
          res.status(401).json({
            message: 'User not authorized.'
          });
        }
        res.status(200).json({
          message: 'Post with ' + postId + ' deleted.'
        });
      });

});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let documents;
  if(pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.then(fetchedPosts => {
      documents = fetchedPosts;
      return Post.countDocuments();
    }).then(count => {
      res.status(200).json({
        message: 'Posts successfully fetched!',
        posts: documents,
        count: count
      });
    });

});

router.get('/totalCount', (req, res, next) => {
  Post.find().then(data => {
      res.status(200).json({
        message: 'Posts-size successfully fetched!',
        size: data.length
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

module.exports = router;
