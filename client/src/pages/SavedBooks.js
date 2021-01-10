import React from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/react-hooks";

import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);

  const [removeBook] = useMutation(REMOVE_BOOK); // returns the ' removeBook' function

  const userData = data?.me || {};

  // If the data hasn't loaded yet, say so
  if (loading) {
    return <h2>Still loading data ...</h2>;
  }

  // Create the function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      //console.log( "About to remove bookId: ", bookId );
      await removeBook({
        variables: { bookId },
      });

      // Assume this works and delete the book's ID from local storage.
      removeBookId(bookId);
      //console.log( "Have removed book from DB and local storage, ID is: ", bookId );
    } catch (err) {
      console.error(err);
    }

    // If the data hasn't loaded yet, say so
    if (loading) {
      return <h2>Still loading data ...</h2>;
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <p className="small">
                    Link:{" "}
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {book.link}
                    </a>
                  </p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;