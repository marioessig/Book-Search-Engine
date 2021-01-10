// Import the models we need.
const { User } = require("../models");

const { signToken } = require("../utils/auth");

// Enable GraphQL authentication
const { AuthenticationError } = require("apollo-server-express");

// Define the resolvers that will serve the response.
// Below, 'params' is set to either a specified username or null.  If null, all users are returned.
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("books");

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
  },

  // Add the necessary mutations here (for the CRUD operations of Post, Put, and Delete)
  Mutation: {
    // Create a user - occurs with the 'sign-up' option
    addUser: async (parent, args) => {
      const user = await User.create(args); // a new user is created based on 'args'
      const token = signToken(user);

      return { token, user }; // return a new object combining the token and user data
    },

    // Login an existing user
    login: async (parent, { email, password }) => {
      // Find the user by 'email', and if not found throw fuzzy error
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      // If 'email' was found, verify password, throw fuzzy error on mismatch.
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },

    // Add a savedBook to a user
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          // Take the input type body as the argument
          { $addToSet: { savedBooks: args.input } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError("You need to be logged in!");
    },

    // Remove a savedBook from a user's storage
    removeBook: async (parent, args, context) => {
      //console.log("removeBook, context.user and args:", context.user, args);
      try {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: args.bookId } } },
            { new: true } // return the updated object
          );
          // .then (
          //    (res) => {console.log( "res: ", res )}
          // )

          return updatedUser;
        }

        throw new AuthenticationError("You need to be logged in!");
      } catch (err) {
        console.error("Failed in resolver to remove Book:", err);
      }
    },
  },
};

module.exports = resolvers;