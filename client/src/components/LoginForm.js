// see SignupForm.js for comments
import React, { useState } from "react";

// These imports take the submitted data and send it to the server.
import { useMutation } from "@apollo/react-hooks";
import { LOGIN_USER } from "../utils/mutations";

// This import takes care of token validation/storage
import Auth from "../utils/auth";

import { Form, Button } from "react-bootstrap";

const LoginForm = () => {
  const [formState, setFormState] = useState({ email: "", password: "" });

  // returns the 'login' function
  const [login, { error }] = useMutation(LOGIN_USER);

  // Update the state based on any form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Submit the form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Use try/catch instead of promises to handle errors
    try {
      // Execute the 'login' mutation and pass in variable data from the form
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      email: "",
      password: "",
    });
  };

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        {/* <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert> */}
        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            onChange={handleChange}
            value={formState.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleChange}
            value={formState.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(formState.email && formState.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
      {error && <div>Login failed</div>}
    </>
  );
};

export default LoginForm;