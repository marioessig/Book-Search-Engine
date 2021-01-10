import React from "react";

// Import the Apollo components
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";

// Import the React-Router-Dom.  Note that 'BrowserRouter' is renamed to
// 'Router' in this 'import' command.
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Import the various pages of the site that are needed.
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";

// Establish a new connection to GraphQL using Apollo.  Also, retrieve the user token
// from localStorage before each request.
const client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem("id_token");

    // Set the HTTP headers for each request to include the token
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  uri: "/graphql",
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={SearchBooks} />
            <Route exact path="/saved" component={SavedBooks} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
