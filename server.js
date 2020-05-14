const express = require("express");
const cors = require("cors");

const server = express();
const port = process.env.PORT;
server.use(express.json());
server.use(cors());

module.exports = {
  server,
  port,
};
