const timeOutLength = 15000;
import { db } from "./dbHelpers"
import { recurse } from 'cypress-recurse'

export default class BasePage {

  inspectObject(object: any) {
    var util = require('util');
    cy.log("INSPECTED OBJECT = " + util.inspect(object))
  }

  stubNewTabCheck(element: any) {
    cy.window().then(win => {
      cy.stub(win, 'open').as('open')
    })
    cy.get(element).first().click()
    cy.get('@open').should('have.been.called')
  }

  logIntoAD(url: string) {
    const secrets = Cypress.$('@secrets').get(0);
    cy.log("Logging into AD")
    const options = {
      username: "mass_l@hotmail.com",
      password: "genocide75",
      appUrl: url,
    };
    cy.task('aadLogin', options);
  }

  clickUntilGone(selector: any) {
    recurse(
      () => cy.get(selector).should(Cypress._.noop),
      Cypress._.isEmpty,
      {
        post() {
          cy.get(selector).should(() => { }).then($body => {
            if ($body.length === 1) {
              cy.get(selector).click({ force: true })
            }
          })
        },
        log: false,
        delay: 1000,
        limit: 70,
        timeout: 300000,
      },
    )
  }

  clearCookie() {
    cy.get('#onetrust-accept-btn-handler').should(() => { }).then(ele => {
      if (ele.length == 1) {
        cy.get('#onetrust-accept-btn-handler').click({ force: true })
      }
    })
  }

  //generates random email with syntax Math.floor([lower limit]] + Math.random() * [upper limit])
  randomNumber() {
    var result = Math.floor(100000 + Math.random() * 900000);
    return result;
  }

}