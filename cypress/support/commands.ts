// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-file-upload';
import 'cypress-iframe';
import '@testing-library/cypress/add-commands'
require('cypress-downloadfile/lib/downloadFileCommand');
import "cypress-real-events/support";

Cypress.Commands.add("queryDb", (script, config) => {
    if (!script) {
        throw new Error('Query must be set');
    }

    cy.task('queryDb', { script, config }, { timeout: 400000 }).then((response: any[]) => {
        let result = [];
        const flatten = r => Array.isArray(r) && r.length === 1 ? flatten(r[0]) : r;

        if (response) {
            for (let i in response) {
                result[i] = [];
                for (let c in (response[i] as any)) {
                    result[i][c] = (response[i] as any)[c].value;
                }
            }
            result = flatten(result);
        } else {
            result = response
        }

        const keysCount = Object.keys(result).length;
        const resultLength = result.length;

        if (keysCount === 0 && resultLength === 0) {
            result = [result];
        } else if (keysCount > 0 && resultLength === 0) {
            result = [result];
        }

        return result;
    });
});

import 'cypress-wait-until'

Cypress.Commands.add('findBySmartRole', (role: any, name: string, options = {}) => {
  // This logic is now hidden away and reusable
  const smartRegex = new RegExp(`^${name.replaceAll(/\s+/g, '\\s+')}`, "i");
  
  return cy.findByRole(role, { name: smartRegex, ...options });
});

// Optional: Add the "All" version too
Cypress.Commands.add('findAllByRegExRole', (role: any, name: string, options = {}) => {
  const smartRegex = new RegExp(`^${name.replaceAll(/\s+/g, '\\s+')}`, "i");
  
  return cy.findAllByRole(role, { name: smartRegex, ...options });
});