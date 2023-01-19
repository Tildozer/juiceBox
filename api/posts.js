const express = require('express');
const postRouter = express.Router();
const { requireUser } = require('./utils');
const { createPost, getu } = require('../db/index.js');

postRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/)
  const postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    postData.authorId = req.user.id; 
    postData.title = title;
    postData.content = content;
    const post = await createPost(postData);
    console.log(post);
    if (post) {
      res.send({ post });
    }
    else {
      next({name: 'create post error', message: 'no post'});
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postRouter.post('/', requireUser, async (req, res, next) => {
  res.send({ message: 'under construction' });
});

postRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");
  
    next(); 
  });
  
const { getAllPosts } = require('../db');

postRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();
  
    res.send({
      posts
    });
  });

module.exports = postRouter;