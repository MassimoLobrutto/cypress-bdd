// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
require('cypress-xpath')
require('cypress-plugin-tab');
import "cypress-real-events";
import './commands'
import "cypress-azure-keyvault";

Cypress.on('uncaught:exception', (err, runnable, promise) => {
  // when the exception originated from an unhandled promise
  // rejection, the promise is provided as a third argument
  // you can turn off failing the test in this case
  if (promise !== undefined) {
    return false
  }
  if (err.message.includes('False is not defined')) {
    return false
  }
  if (err.message.includes('angular is not defined')) {
    return false
  }
  if (err.message.includes('Invalid or unexpected token')) {
    return false
  }
  if (err.message.includes('GS_googleAddAdSenseService is not defined')) {
    return false
  }
  if (err.message.includes('Error: A')) {
    return false
  }
  if (err.message.includes('TypeError:')) {
    return false
  }
  if (err.message.includes('Failed to load external resource')) {
    return false
  }
  if (err.message.includes('consents is not defined')) {
    return false
  }
  // we still want to ensure there are no other unexpected
  // errors, so we let them fail the test
})

function loginViaAAD(username, password, url) {
  cy.visit(url)

  // Login to your AAD tenant.
  cy.origin(
    'login.microsoftonline.com',
    {
      args: {
        username,
      },
    },
    ({ username }) => {
      cy.get('input[type="email"]').type(username, {
        log: false,
      })
      cy.get('input[type="submit"]').click()
    }
  )

  // depending on the user and how they are registered with Microsoft, the origin may go to live.com
  cy.origin(
    'login.microsoftonline.com',
    {
      args: {
        password,
      },
    },
    ({ password }) => {
      cy.get('input[type="password"]').type(password, {
        log: false,
      })
      cy.get('input[type="submit"]').click()
      cy.get('#idBtn_Back').click()
    }
  )
}

Cypress.Commands.add('loginToAAD', (username, password, url) => {
  const log = Cypress.log({
    displayName: 'Azure Active Directory Login',
    message: [`🔐 Authenticating | ${username}`],
    autoEnd: false,
  })
  log.snapshot('before')

  loginViaAAD(username, password, url)

  log.snapshot('after')
  log.end()
})

beforeEach(() => {
  const now = new Date()
  cy.setCookie("OptanonAlertBoxClosed", now.toISOString())
})

afterEach(() => {
  cy.window().then(win => {
    // window.gc is enabled with --js-flags=--expose-gc chrome flag
    // window.gc is enabled for electron with ELECTRON_EXTRA_LAUNCH_ARGS=--js-flags=--expose_gc
    if (typeof win.gc === 'function') {
      // run gc multiple times in an attempt to force a major GC between tests
      win.gc();
      win.gc();
      win.gc();
      win.gc();
      win.gc();
    }
  });
});

// Hide Fetch/XHR requests from the command log
const app = window.top;

if (!app.document.head.querySelector('[data-hide-command-log-requests]')) {
  const style = app.document.createElement('style');
  style.innerHTML = `
    .command-name-request, 
    .command-name-xhr { display: none; }
  `;
  style.dataset.hideCommandLogRequests = '';
  app.document.head.appendChild(style);
}