const inventoryItem = '.inventory_item';
const cartLink = '.shopping_cart_link';
const cartButton = 'Add to cart';

export class InventoryPage {
  addItemToCart(itemName: string) {
    cy.get(inventoryItem).contains(itemName).parents(inventoryItem).findByRole('button', { name: cartButton }).click();
  }

  goToCart() {
    cy.get(cartLink).click();
  }
}

export const inventoryPage = new InventoryPage();
