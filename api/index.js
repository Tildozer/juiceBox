const express = require('express');
const apiRouter = express.Router();

const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;

// set `req.user` if possible

apiRouter.use((req, res, next) => {
    if (req.user) {
      console.log("User is set:", req.user);
    }
  
    next();
  });
  
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    console.log(token)

    try {

      const { id } = jwt.verify(token, JWT_SECRET);
      console.log('id', id)
      if (id) {
        req.user = await getUserById(id);
        console.log(req.user)
        next();
      } else {
        next({name: "token err", message: 'bad token, try again later'})
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const postRouter = require('./posts');
apiRouter.use('/posts', postRouter);

const tagsRouter = require('./tags');
apiRouter.use('/tags', tagsRouter);

apiRouter.use((error, req, res, next) => {
    res.send({
      name: error.name,
      message: error.message
    });
  });
  
module.exports = apiRouter
