const usernameInput = "Username";
const passwordInput = "Password";
const loginButton = "Login";
const errorContainer = '[data-test="error"]';

export class SauceLabsLoginPage {

  loginToAdminDashboard(username: string, password: string) {
    cy.findByPlaceholderText(usernameInput).type(username);
    cy.findByPlaceholderText(passwordInput).type(password);
    cy.findByRole("button", { name: loginButton }).click();
  }
}

export const sauceLabsLoginPage = new SauceLabsLoginPage();
