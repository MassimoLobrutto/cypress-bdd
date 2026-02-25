import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { sauceLabsLoginPage } from '../../../pages/uiTests/react/login-page';
import { inventoryPage } from '../../../pages/uiTests/react/inventory-page';
import { checkoutPage } from '../../../pages/uiTests/react/checkout-page';
import { cartPage } from '../../../pages/uiTests/react/cart-page';

const password = 'secret_sauce';

When('I login as a {string} user', (userType: string) => {
  const usernames = {
    standard: 'standard_user',
    problem: 'problem_user',
    visual: 'visual_user',
  };
  sauceLabsLoginPage.loginToAdminDashboard(usernames[userType] || userType, password);
  // example of sharing data between steps
  cy.wrap('shared variable set in Given step').as('sharedText');
  cy.log('Shared object successfully set in Given step');
});

When('I add {string} to the cart', (itemName: string) => {
  inventoryPage.addItemToCart(itemName);
});

When('I checkout with information {string}, {string}, {string}', (firstName: string, lastName: string, zip: string) => {
  inventoryPage.goToCart();
  cartPage.checkout();
  checkoutPage.fillInformation(firstName, lastName, zip);
  checkoutPage.finishCheckout();
});

Then('the order should be successful', () => {
  cy.findByText('Thank you for your order!').should('be.visible');
  cy.get('@sharedText').then(sharedText => {
    cy.log(sharedText + ' now retrieved and printed in final step');
  });
});

Then('the login should happen within {int} seconds', threshold => {
  const start = Date.now();

  // 1. If this is a custom command, we want to make sure the chain starts here
  sauceLabsLoginPage.loginToAdminDashboard('performance_glitch_user', 'secret_sauce');

  // 2. Return the chain starting from cy.url()
  return cy
    .url()
    .should('include', '/inventory.html')
    .then(() => {
      const end = Date.now();
      const duration = (end - start) / 1000;

      cy.log(`### ⏱️ Performance: Login took ${duration.toFixed(2)}s`);

      // Also send to your new terminal log for the CLI demo!
      cy.task('terminalLog', `Performance: ${duration.toFixed(2)}s (Threshold: ${threshold}s)`);

      cy.wrap(duration).should('be.lessThan', threshold);
    });
});

When('I go to the cart page', async ({ inventoryPage }) => {
  inventoryPage.goToCart();
});

When('I click checkout', async ({ cartPage }) => {
  cartPage.checkout();
});

Then('I should see a broken image for the products', () => {
  cy.get('img[src*="sl-404"]').first().should('be.visible');
});
