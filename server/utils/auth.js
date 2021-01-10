const jwt = require("jsonwebtoken");

const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  // Create the authentication token
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  // Setup the middleware to verify the token
  authMiddleware: function ({ req }) {
    // Allow token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // Separate the "Bearer" from the "<tokenvalue>"
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // If there is no token, return the request object as is
    if (!token) {
      return req;
    }

    try {
      // Decode and attach user data to request object. Note that the 'secret' here must match the 'secret' used
      // in 'signToken', otherwise the object won't be decoded and an error will result.
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token from (\\server\\utils\\auth.js)");
    }

    // return updated request object
    return req;
  },
};