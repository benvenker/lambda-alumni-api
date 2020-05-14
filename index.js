require("dotenv").config();
const { server, port } = require("./server.js");
const posts = require("./db.js");

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
