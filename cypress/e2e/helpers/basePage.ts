import { recurse } from 'cypress-recurse';

export default class BasePage {
  inspectObject(object: any) {
    const util = require('node:util');
    cy.log('INSPECTED OBJECT = ' + util.inspect(object));
  }

  stubNewTabCheck(element: any) {
    cy.window().then(win => {
      cy.stub(win, 'open').as('open');
    });
    cy.get(element).first().click();
    cy.get('@open').should('have.been.called');
  }

  clickUntilGone(selector: any) {
    recurse(() => cy.get(selector).should(Cypress._.noop), Cypress._.isEmpty, {
      post() {
        cy.get(selector)
          .should(() => {})
          .then($body => {
            if ($body.length === 1) {
              cy.get(selector).click({ force: true });
            }
          });
      },
      log: false,
      delay: 1000,
      limit: 70,
      timeout: 300000,
    });
  }

  clearCookie() {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    cy.get('#onetrust-accept-btn-handler', { timeout: 10000 })
      .should(() => {})
      .then(ele => {
        if (ele.length == 1) {
          cy.get('#onetrust-accept-btn-handler').click({ force: true });
        }
      });
  }

  //generates random email with syntax Math.floor([lower limit]] + Math.random() * [upper limit])
  randomNumber() {
    const result = Math.floor(100000 + Math.random() * 900000);
    return result;
  }
}
