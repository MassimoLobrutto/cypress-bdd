const cartItem = '.cart_item';
const checkoutButton = 'Checkout';
const continueShoppingButton = 'Continue Shopping';

export class CartPage {
  removeItem(itemName: string) {
    cy.get(cartItem)
      .contains(itemName)
      .parents('.cart_item') // Moves up to the container
      .find('button')
      .contains(/remove/i)
      .click();
  }

  checkout() {
    cy.contains('button', checkoutButton).click();
  }

  continueShopping() {
    cy.contains('button', continueShoppingButton).click();
  }
}

export const cartPage = new CartPage();
