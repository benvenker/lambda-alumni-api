const express = require('express');
const votes = require('./votesDb');
const checkJwt = require('../middleware/checkJwt');
const router = express.Router();

module.exports = router;
