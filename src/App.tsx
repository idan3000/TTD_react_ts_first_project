import React, { useState } from "react";
import "./App.css";

import validator from "validator";

function App() {
  const [signUpInput, setSignUpInput] = useState({
    email: ``,
    password: ``,
    confirmPassword: ``,
  });
  const [error, setError] = useState(``);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setError(``);
    if (!validator.isEmail(signUpInput.email))
      return setError(`The email is invalid`);
    if (signUpInput.password.length < 5)
      return setError(
        `The Password you entered should contain 5 or more characters`
      );
    if (signUpInput.password !== signUpInput.confirmPassword)
      return setError(`The passwords don't match. Try again.`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpInput((oldInput) => {
      const inputState = { ...oldInput, [e.target.name]: e.target.value };
      return inputState;
    });
  };

  return (
    <div className="container my-5">
      <form role="form">
        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={signUpInput.email}
            onChange={handleChange}
          ></input>
        </div>
        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={signUpInput.password}
            onChange={handleChange}
          ></input>
        </div>
        <div>
          <label htmlFor="confirm-password" className="form-label">
            confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            className="form-control"
            value={signUpInput.confirmPassword}
            onChange={handleChange}
          ></input>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button className="btn btn_primary" onClick={handleClick}>
          submit
        </button>
      </form>
    </div>
  );
}

export default App;
