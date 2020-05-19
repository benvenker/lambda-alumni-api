const express = require("express");
const cors = require("cors");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
  // Dynamically provide a signing key based on the Kid in the header
  // and the signing keys provideed by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://benvenker.auth0.com/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_DOMAIN,

  // THis must match the algorihtm selected in the Auth0 dashboard under your app's advanced settings
  // under this Auth0 tab
  algorithms: ["RS256"],
});

const server = express();
const port = process.env.PORT;
server.use(express.json());
server.use(cors());

module.exports = {
  server,
  port,
  checkJwt,
};
