import { Given } from '@badeball/cypress-cucumber-preprocessor';
import { databaseName } from '../../../support/commands';

Given('I query db and print results', () => {
  cy.env(['environment']).then(env => {
    cy.log(`### 🚀 Test Execution Context`);
    // Access the specific key from the returned object
    cy.log(`This is running on the **${env.env}** environment`);
    cy.log(`Urls will be http://${env.env}.website.com`);
  });
  // 1. Query the first DB
  cy.queryDb(databaseName.shieldfaculty, `SELECT * FROM facultydetails`).then(faculty => {
    // These logs now have access to the real data
    cy.log(`First faculty firstname: ${faculty[0].firstname}`);
    cy.log(`First faculty surname: ${faculty[0].surname}`);
  });

  // 2. Query the second DB
  cy.queryDb(databaseName.shieldstudent, `SELECT * FROM studentdetails`).then(students => {
    cy.log(`First student surname: ${students[0].surname}`);
    cy.log(`First student firstname: ${students[0].firstname}`);
  });
});
