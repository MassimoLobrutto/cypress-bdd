const firstNameInput = 'First Name';
const lastNameInput = 'Last Name';
const zipCodeInput = 'Zip/Postal Code';
const continueButton = 'Continue';
const finishButton = 'Finish';

export class CheckoutPage {
  fillInformation(firstname: string, lastname: string, zip: string) {
    cy.findByPlaceholderText(firstNameInput).type(firstname);
    cy.findByPlaceholderText(lastNameInput).type(lastname);
    cy.findByPlaceholderText(zipCodeInput).type(zip);
    cy.findByRegexRole('button', continueButton).click();
  }

  finishCheckout() {
    cy.contains('button', finishButton).click();
  }
}

export const checkoutPage = new CheckoutPage();
