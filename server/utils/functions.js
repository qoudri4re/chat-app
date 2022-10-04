/**
 * Intercepts requests on specified endpoints.
 * checks the jwt token on request headers, then sets req.token.
 * Token format -> Authorization <jwt token>
 */
function verifyHeaderToken(req, res, next) {
  //get the auth header value
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const jwtToken = bearer[1];
    req.token = jwtToken;
    next();
  } else {
    res.send({ error: "Invalid request token" });
  }
}

export { verifyHeaderToken };
