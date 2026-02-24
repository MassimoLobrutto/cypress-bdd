import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor"
import { homePage } from "../../../pages/uiTests/angular/home-page"
import { navPage } from "../../../pages/uiTests/angular/nav-page";


Given("I navigate to Chambers new homepage", () => {
    homePage.navigateToHomepage();
})

When("I go to {string} and {string} from the top navigation and {string} page is displayed with correct {string} on Chambers", (menuItem, subMenuItem, text, url) => {
    navPage.selectAndVerifyMenuSubItem(menuItem, subMenuItem, text, url,);
})

Then("I am on chambers home page", () => {
    cy.url().should('include', 'chambers.com')
})