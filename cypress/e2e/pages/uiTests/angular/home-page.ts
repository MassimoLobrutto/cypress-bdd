import BasePage from '../../../helpers/basePage.js'

export class HomePage extends BasePage {

    navigateToHomepage() {
        cy.visit(`https://www.chambers.com/`);
        super.clearCookie()
    }
}
export const homePage = new HomePage();