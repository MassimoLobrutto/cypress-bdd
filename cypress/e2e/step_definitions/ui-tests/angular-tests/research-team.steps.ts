import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { researchTeam } from '../../../pages/uiTests/angular/research-team-page';

Cypress.config('defaultCommandTimeout', 20000);

When('I search by {string}', name => {
  researchTeam.enterName(name);
});

When('I search the region {string}', guide => {
  researchTeam.selectGuide(guide);
});

Then('users with selected {string} are displayed', (personName: string) => {
  if (personName == 'NOBODY') {
    cy.log(`No results found for ${personName}`);
    cy.contains('There are no results matching your criteria. Please try searching again').should('be.visible');
  } else {
    cy.findAllByRegExRole('heading', personName).should('have.length.at.least', 1).and('be.visible');
  }
});

Then('users from selected region {string} are displayed', (guide: string) => {
  cy.findAllByRegExRole('heading', guide).should('have.length.at.least', 1).and('be.visible');
});
