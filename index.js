require("dotenv").config();
const { server, port } = require("./server.js");

server.listen(port, () => {
  console.log("Rnning on port 5000!");
  return { message: "welcome to the API" };
});

server.get("/", (req, res) => {
  res.send("<h1>Welcome to the Lambda Alumni API");
});
