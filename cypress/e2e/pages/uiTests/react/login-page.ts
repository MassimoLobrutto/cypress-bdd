const usernameInput = 'Username';
const passwordInput = 'Password';
const loginButton = 'Login';

export class SauceLabsLoginPage {
  loginToAdminDashboard(username: string, password: string) {
    if (username === '') {
      cy.findByPlaceholderText(usernameInput).clear();
    } else {
      cy.findByPlaceholderText(usernameInput).type(username);
    }
    cy.findByPlaceholderText(passwordInput).type(password);
    cy.findByRole('button', { name: loginButton }).click();
  }
}

export const sauceLabsLoginPage = new SauceLabsLoginPage();
