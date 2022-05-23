import "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { type } from "@testing-library/user-event/dist/type";
import { click } from "@testing-library/user-event/dist/click";

interface Input {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const btnSubmit = () => click(screen.getByRole(`button`, { name: `submit` }));

const typeIntoInput = (input?: Input) => {
  const emailEl = screen.getByRole(`textbox`, {
    name: /email/i,
  }) as HTMLInputElement;
  const passwordEl = screen.getByLabelText(`Password`) as HTMLInputElement;
  const confirmPasswordEl = screen.getByLabelText(
    /confirm password/i
  ) as HTMLInputElement;
  if (input?.email) {
    emailEl.value = ``;
    type(emailEl, input.email);
  }
  if (input?.password) {
    passwordEl.value = ``;
    type(passwordEl, input.password);
  }
  if (input?.confirmPassword) {
    confirmPasswordEl.value = ``;
    type(confirmPasswordEl, input.confirmPassword);
  }
  return { emailEl, passwordEl, confirmPasswordEl };
};

const submitIn = (text: string) => {
  btnSubmit();
  expect(screen.queryByText(text)).toBeInTheDocument();
};
const submitNot = (text: string) => {
  btnSubmit();
  expect(screen.queryByText(text)).not.toBeInTheDocument();
};

describe(`App`, () => {
  beforeEach(() => render(<App />));
  describe(`pre run`, () => {
    test(`need to be a form`, () => {
      const formEl = screen.queryByRole(`form`);
      expect(formEl).toBeInTheDocument();
    });

    test(`need to have email password and confirm password empty`, () => {
      const { emailEl, passwordEl, confirmPasswordEl } = typeIntoInput();
      expect(emailEl.value).toBe(``);
      expect(passwordEl.value).toBe(``);
      expect(confirmPasswordEl.value).toBe(``);
    });
  });
  describe(`can type`, () => {
    test(`can type email`, () => {
      const { emailEl } = typeIntoInput({ email: `1@1.com` });
      expect(emailEl.value).toBe(`1@1.com`);
    });
    test(`can type password`, () => {
      const { passwordEl } = typeIntoInput({ password: `1234aA!~` });
      expect(passwordEl.value).toBe(`1234aA!~`);
    });
    test(`can type confirm password`, () => {
      const { confirmPasswordEl } = typeIntoInput({
        confirmPassword: `1234aA!~`,
      });
      expect(confirmPasswordEl.value).toBe(`1234aA!~`);
    });
  });
  describe(`error message`, () => {
    test(`invalid email show error message`, () => {
      const text = `The email is invalid`;
      const emailErrorMessage = screen.queryByText(text);
      expect(emailErrorMessage).not.toBeInTheDocument();
      submitIn(text);
      typeIntoInput({ email: `1@1.com` });
      submitNot(text);
    });
    test(`invalid password show error message`, () => {
      const text = `The Password you entered should contain 5 or more characters`;
      const passwordErrorMessage = screen.queryByText(text);
      expect(passwordErrorMessage).not.toBeInTheDocument();
      typeIntoInput({ password: `1234` });
      submitNot(text);
      typeIntoInput({ email: `1@1.com` });
      submitIn(text);
      typeIntoInput({ password: `12345` });
      submitNot(text);
    });
    test(`passwords dont match show error message`, () => {
      const text = `The passwords don't match. Try again.`;
      const confirmErrorMessage = screen.queryByText(text);
      expect(confirmErrorMessage).not.toBeInTheDocument();
      typeIntoInput({
        email: `1@1.com`,
        password: `1234`,
        confirmPassword: `123456`,
      });
      submitNot(text);
      typeIntoInput({ password: `12345` });
      submitIn(text);
      typeIntoInput({ confirmPassword: `12345` });
      submitNot(text);
    });
    test(`all valid input no error massage`, () => {
      typeIntoInput({
        email: `1@1.com`,
        password: `12345`,
        confirmPassword: `12345`,
      });
      btnSubmit();
      const emailErrorMessage = screen.queryByText(`The email is invalid`);
      const passwordErrorMessage = screen.queryByText(
        `The Password you entered should contain 5 or more characters`
      );
      const confirmErrorMessage = screen.queryByText(
        `The passwords don't match. Try again.`
      );
      expect(emailErrorMessage).not.toBeInTheDocument();
      expect(passwordErrorMessage).not.toBeInTheDocument();
      expect(confirmErrorMessage).not.toBeInTheDocument();
    });
  });
});
