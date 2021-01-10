const express = require("express");
const path = require("path");

// Import the Apollo Server
const { ApolloServer } = require("apollo-server-express");

// Import the typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");

// Import the connection
const db = require("./config/connection");

// Import the middleware for authentication
const { authMiddleware } = require("./utils/auth");

const PORT = process.env.PORT || 3001;
const app = express();

// Create a new Apollo server and pass in the schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware, // these headers become the "context" for the 'resolvers'.
});

// Integrate the Apollo server with the Express application as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets (only used in production environment)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// If a request is made to a location on the server that doesn't have an explicit route defined,
// respond with the production-ready React front-end code.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Check the connection and start the server
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);

    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
db.on("error", (err) => {
  console.log("MongoDB connection error: ", err);
});