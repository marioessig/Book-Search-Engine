// Import the GraphQL (gql) tagged template function
const { gql } = require("apollo-server-express");

// Create our typeDefs
const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Query {
    me: User
  }

  # Note 'books' are part/children of 'users'
  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  # This 'input type' is used in the 'mutation' below.
  input savedBook {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  # Define the authentication token.  Auth must return a token, but user data is optional.
  type Auth {
    token: ID!
    user: User
  }

  # The addUser mutation is a 'post', requiring three arguments, returning an 'Auth' object
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: savedBook!): User
    removeBook(bookId: ID!): User
  }
`;

// Export the typeDefs
module.exports = typeDefs;