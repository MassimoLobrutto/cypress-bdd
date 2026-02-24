export class CartPage {
  // Selectors as getter methods for cleaner access
  get cartItems() {
    return cy.get('.cart_item');
  }

  get checkoutButton() {
    // Cypress equivalent of getByRole('button', { name: 'Checkout' })
    return cy.contains('button', /checkout/i);
  }

  get continueShoppingButton() {
    return cy.contains('button', /continue shopping/i);
  }

  removeItem(itemName) {
    /**
     * Logic: Find the cart item containing the text, 
     * then find the 'Remove' button inside that specific row.
     */
    this.cartItems
      .contains(itemName)
      .parents('.cart_item') // Moves up to the container
      .find('button')
      .contains(/remove/i)
      .click();
  }

  checkout() {
    this.checkoutButton.click();
  }

  continueShopping() {
    this.continueShoppingButton.click();
  }
}

export const cartPage = new CartPage();