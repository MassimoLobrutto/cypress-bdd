import BasePage from "../../../helpers/basePage.js";

const nameFieldText = "Search by first or last name";

class ResearchTeamPage extends BasePage {
  enterName(name) {
    cy.findByPlaceholderText(nameFieldText).type(name, { delay: 0 });
  }

  selectGuide(guide) {
    cy.get("select").first().select(guide);
  }
}

export const researchTeam = new ResearchTeamPage();
