// 1. THIRD PARTY PLUGINS (Load Testing Library FIRST)
import '@testing-library/cypress/add-commands';
import 'cypress-real-events';
import 'cypress-azure-keyvault';
// Use import instead of require for consistency in v14
import 'cypress-xpath';
import 'cypress-plugin-tab';

// 2. YOUR CUSTOM COMMANDS (Load this AFTER testing-library)
import './commands';

// --- Existing logic below ---

Cypress.on('uncaught:exception', (err, runnable, promise) => {
  if (promise !== undefined) return false;

  const ignoredErrors = [
    'False is not defined',
    'angular is not defined',
    'Invalid or unexpected token',
    'GS_googleAddAdSenseService is not defined',
    'Error: A',
    'TypeError:',
    'Failed to load external resource',
    'consents is not defined',
  ];

  if (ignoredErrors.some(msg => err.message.includes(msg))) {
    return false;
  }
});

function loginViaAAD(username, password, url) {
  cy.visit(url);

  cy.origin('login.microsoftonline.com', { args: { username } }, ({ username }) => {
    cy.get('input[type="email"]').type(username, { log: false });
    cy.get('input[type="submit"]').click();
  });

  cy.origin('login.microsoftonline.com', { args: { password } }, ({ password }) => {
    cy.get('input[type="password"]').type(password, { log: false });
    cy.get('input[type="submit"]').click();
    // Optional: Wait for the "Stay signed in?" prompt if it appears
    cy.get('#idBtn_Back', { timeout: 10000 }).click();
  });
}

Cypress.Commands.add('loginToAAD', (username, password, url) => {
  const log = Cypress.log({
    displayName: 'Azure AD',
    message: [`🔐 ${username}`],
    autoEnd: false,
  });
  log.snapshot('before');
  loginViaAAD(username, password, url);
  log.snapshot('after');
  log.end();
});

beforeEach(() => {
  const now = new Date();
  cy.setCookie('OptanonAlertBoxClosed', now.toISOString());
});

afterEach(() => {
  cy.window().then(win => {
    // window.gc is enabled via cypress.config.ts / launch options
    if (typeof (win as any).gc === 'function') {
      for (let i = 0; i < 5; i++) (win as any).gc();
    }
  });
});

// Hide Fetch/XHR requests from the command log
const topApp = window.top;
if (topApp && !topApp.document.head.querySelector('[data-hide-command-log-requests]')) {
  const style = topApp.document.createElement('style');
  style.innerHTML = `
    .command-name-request, 
    .command-name-xhr { display: none !important; }
  `;
  style.dataset.hideCommandLogRequests = '';
  topApp.document.head.appendChild(style);
}
