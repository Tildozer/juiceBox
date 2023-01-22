const express = require("express");
const tagsRouter = express.Router();
const { getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

const { getAllTags } = require("../db");

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags,
  });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  const { tagName } = req.params;
  const route = encodeURIComponent(tagName);
  try {
    const posts = await getPostsByTagName(tagName);
    res.send({posts:posts});
   
  } catch ({ name, message }) {
    throw {name, message};
  }
});
module.exports = tagsRouter;
