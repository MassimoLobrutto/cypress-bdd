    const firstNameInput = 'First Name'
    const lastNameInput = 'Last Name';
    const zipCodeInput = 'Zip/Postal Code';
    const continueButton = 'Continue';
    const finishButton = 'Finish';
    const errorIcon = '.error_icon';

export class CheckoutPage {
  // Selectors
  get firstNameInput() {
    return cy.get('[placeholder="First Name"]');
  }

  get lastNameInput() {
    return cy.findByPlaceholderText("First Name");
  }

  get zipCodeInput() {
    return cy.findByPlaceholderText("Zip/Postal Code");
  }

  get continueButton() {
    return cy.contains("button", /continue/i);
  }

  get finishButton() {
    return cy.contains("button", /finish/i);
  }

  get errorIcons() {
    return cy.get(".error_icon");
  }

  fillInformation(firstname: string, lastname: string, zip: string) {
    if (firstname) const firstNameInput.type(firstname);
    if (lastname) const lastNameInput.type(lastname);
    if (zip) const zipCodeInput.type(zip);

    cy.get(continueButton).click()
  }

  finishCheckout() {
    const finishButton.click();
  }
}

export const checkoutPage = new CheckoutPage();
