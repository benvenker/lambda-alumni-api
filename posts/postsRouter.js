const express = require('express');
const posts = require('./postsDb');
const checkJwt = require('../middleware/checkJwt');
const router = express.Router();

router.get('/', (req, res) => {
  const { page, items } = req.query;

  return posts
    .find(items, page)
    .then(posts => res.status(200).json(posts))
    .catch(err => {
      res.status(500).json({
        message: `Error retrieving poasts: ${err}`,
      });
    });
});

router.get('/popular', (req, res) => {
  const itemsPerPage = req.query.items;
  const page = req.query.page;
  return posts
    .getMostPopular(itemsPerPage, page)
    .then(posts => res.status(200).json(posts))
    .catch(err => {
      res.status(500).json({
        message: `Error retrieving poasts: ${err}`,
      });
    });
});

// Retrieve a post by id
router.get('/:id', (req, res) => {
  return posts
    .findById(req.params.id)
    .then(post => {
      post === undefined
        ? res
            .status(404)
            .json({ message: 'The post with the specified ID does not exist.' })
        : res.status(200).json(post);
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' })
    );
});

// Edit a post
router.put('/:id', (req, res) => {
  return posts
    .edit({ id: req.params.id, ...req.body })
    .then(post => {
      post === undefined
        ? res
            .status(404)
            .json({ message: 'The post to update could not be found' })
        : res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json({ error: 'The post could not be updated' });
    });
});

// Delete a post by ID
router.delete('/:id', (req, res) => {
  return posts.deletePost({ id: req.params.id }).catch(err => console.log(err));
});

// Create a new post
router.post('/', checkJwt, (req, res) => {
  console.log(req.body);
  return posts
    .insert(req.body)
    .then(post => {
      post === undefined
        ? res.status(404).json({ message: 'There was nothing to postt.' })
        : res.status(200).json(post);
    })
    .catch(err => res.status(500).json({ error: 'The post failed.' }));
  // res.send({ message: "endpoit hit" });
});

// Upvote a post
router.post('/upvote', (req, res) => {
  return votes.upVote(req.body).then(vote => res.json(vote));
});

// Text search the posts
router.post('/search', (req, res) => {
  return posts
    .searchText(req.body)
    .then(results => {
      console.log(results);
      results === undefined
        ? res.status(404).json({ message: 'No results matched your search' })
        : res.status(200).json(results);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: `Failed to execute search, server error: ${err}` });
    });
});

module.exports = router;
