const express = require('express');
const users = require('./usersDb');
const checkJwt = require('../middleware/checkJwt');
const router = express.Router();

module.exports = router;
