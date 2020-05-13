const express = require("express");

const server = express();
const port = process.env.PORT;

module.exports = {
  server,
  port,
};
