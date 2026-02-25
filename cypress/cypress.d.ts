/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    loginToAAD: (username: string, password: string, url: string) => Chainable<any>;
    findByRegexRole(role: string, name: string, options?: any): Chainable<JQuery<HTMLElement>>;
    findAllByRegExRole(role: string, name: string, options?: any): Chainable<JQuery<HTMLElement>>;
  }
}
