import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor';
import { sauceLabsLoginPage } from '../../../pages/uiTests/react/login-page';

Given('I navigate to the saucelabs login page', () => {
  cy.visit('https://www.saucedemo.com/');
});

When('I login to the admin dashboard with username {string}', (username: string) => {
  sauceLabsLoginPage.loginToAdminDashboard(username, 'secret_sauce');
});

Then('I should see the {string} message', (message: string) => {
  cy.get('[data-test="error"]').should('contain', message);
});
