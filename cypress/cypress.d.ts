/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject> {
        loginToAAD: (username: string, password: string, url: string) => Chainable<any>;
        queryDb: (script: string, config: any) => Chainable<any>;
        findBySmartRole(role: string, name: string, options?: any): Chainable<JQuery<HTMLElement>>;
        findAllByRegExRole(role: string, name: string, options?: any): Chainable<JQuery<HTMLElement>>;
    }
}