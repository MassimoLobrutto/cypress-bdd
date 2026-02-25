import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { apiController } from '../../helpers/api-helper';

Given(
  'I send a POST request to {string} with title {string} and body {string}',
  (path: string, title: string, body: string) => {
    // 1. Return the chain
    // 2. Alias immediately after the request
    return apiController
      .createPost(path, title, body)
      .as('apiResponse')
      .then(response => {
        cy.log(`📦 Response Body: ${JSON.stringify(response.body)}`);
        // Use standard chai assertion here
        expect(response.body.title).to.eq(title);
      });
  }
);

When('I send a GET request to {string}', (path: string) => {
  // Use 'return' to make sure Cypress waits for the GET to finish
  return apiController
    .getPost(path)
    .as('apiResponse')
    .then(response => {
      cy.log(`✅ GET Response Status: ${response.status}`);
    });
});

When('I send a PUT request to {string} with updated title {string}', (path: string, title: string) => {
  // 1. MUST use 'return'
  // 2. MUST re-alias at the end to "refresh" the memory
  return apiController
    .updatePost(path, title)
    .as('apiResponse')
    .then(response => {
      cy.log(`✅ PUT Response Status: ${response.status}`);
    });
});

When('I send a DELETE request to {string}', (path: string) => {
  return apiController
    .deletePost(path)
    .as('apiResponse')
    .then(response => {
      cy.log(`✅ DELETE Response Status: ${response.status}`);
    });
});

Then('the response status should be {int}', (statusCode: number) => {
  cy.get('@apiResponse').then((response: any) => {
    // cy.log is perfectly fine inside .then()
    cy.log(`🧪 Validating Status: Expected ${statusCode}, Got ${response.status}`);

    // Perform the assertion
    expect(response.status).to.eq(statusCode);
  });
});

Then('the response body should contain title {string}', (expectedTitle: string) => {
  cy.get('@apiResponse').then((response: any) => {
    cy.log(`🧪 Validating Title: Expected "${expectedTitle}", Got "${response.body.title}"`);
    expect(response.body.title).to.eq(expectedTitle);
  });
});

Then('the response body should contain id {int}', (expectedId: number) => {
  cy.get('@apiResponse').then((response: any) => {
    cy.log(`🧪 Validating ID: Expected ${expectedId}, Got ${response.body.id}`);
    expect(response.body.id).to.eq(expectedId);
  });
});
