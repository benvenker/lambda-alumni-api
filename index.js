require("dotenv").config();
const { server, port, checkJwt } = require("./server.js");
const posts = require("./data/db.js");
const comments = require("./data/db.js");
const users = require("./data/db.js");
const votes = require("./data/db.js");

server.listen(port, () => {
  console.log("Rnning on port 5000!");
  return { message: "welcome to the API" };
});

server.get("/", (req, res) => {
  res.send("<h1>Welcome to the Lambda Alumni API");
});

server.get("/posts", (req, res) => {
  return posts
    .find()
    .then((posts) => res.status(200).json(posts))
    .catch((err) => {
      res.status(500).json({
        message: `Error retrieving poasts: ${err}`,
      });
    });
});

server.get("/post/:id", (req, res) => {
  return posts
    .findById(req.params.id)
    .then((post) => {
      post === undefined
        ? res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." })
        : res.status(200).json(post);
    })
    .catch((err) =>
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." })
    );
});

server.get("/comments/:postId", checkJwt, (req, res) => {
  // console.log(req.params.postId);
  const postId = req.params.postId;
  return comments
    .findCommentByPostId(postId)
    .then((comments) => {
      postId === undefined
        ? res
            .status(404)
            .json({ message: "The specified post has no commments." })
        : res.status(200).json(comments);
    })
    .catch((err) =>
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." })
    );
});

server.post("/post/:id", (req, res) => {
  return comments
    .insertComment(req.body)
    .then((comment) => {
      comment === undefined
        ? res.status(404).json({ message: "There was nothing to insert." })
        : res.status(200).json(comment);
    })
    .catch((err) =>
      res.status(500).json({ error: "The comment failed to post." })
    );
});

server.post("/submit", checkJwt, (req, res) => {
  console.log(req.body);
  return posts
    .insert(req.body)
    .then((post) => {
      post === undefined
        ? res.status(404).json({ message: "There was nothing to postt." })
        : res.status(200).json(post);
    })
    .catch((err) => res.status(500).json({ error: "The post failed." }));
});

server.post("/users", (req, res) => {
  // return users.findByUsername(req.body.username);\
  return res.json(req);
});

server.post("/add-user", (req, res) => {
  console.log(req.body.username);
  if (req.body.username !== "") {
    return users.addUser(req.body.username).then((user) => {
      res.json(user);
    });
  } else if (req.body.username === "") {
    return null;
  }

  return req.body;
});

server.post("/upvote", (req, res) => {
  return votes.upVote(req.body).then((vote) => res.json(vote));
});

server.post("/votes", (req, res) => {
  return votes.getVotes(req.body.post_id).then((v) => res.json(v));
});
