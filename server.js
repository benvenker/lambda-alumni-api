const express = require("express");

const server = express();
const port = process.env.PORT;
server.use(express.json());

module.exports = {
  server,
  port,
};
