import BasePage from "../../../helpers/basePage.js";

const global = "guides-rankings";
const products = "products";
const articleEvents = "articles_events";

class NavPage extends BasePage {
  selectAndVerifyMenuSubItem(menuItem, subMenuItem, text, urlText) {
    switch (menuItem) {
      case "Global":
        //click main header
        cy.get("a[id='navmen_" + global + "'] span")
          .contains(menuItem)
          .should("be.visible")
          .click()
          .get("a[title='" + subMenuItem + "'] span")
          .contains(subMenuItem)
          .should("be.visible")
          .click();

        //click subheader and verify same
        this.verifyBreadcrumbText(text);
        this.verifyUrlText(urlText);
        break;

      case "Products":
        //click on main header
        cy.get("a[id='navmen_" + products + "'] span")
          .contains(menuItem)
          .should("be.visible")
          .click();

        //check if subheader are below categary because they are external links
        if (
          subMenuItem == "Global Practice Guides" ||
          subMenuItem == "Diversity & Inclusion" ||
          subMenuItem == "Chambers Associate" ||
          subMenuItem == "Chambers Student"
        ) {
          cy.get(
            ".dropdown-menu[aria-labelledby='navmen_" +
              products +
              "'] a[title='" +
              subMenuItem +
              "'] span",
          )
            .contains(subMenuItem)
            .should("be.visible");
          cy.get(
            ".dropdown-menu[aria-labelledby='navmen_" +
              products +
              "'] a[title='" +
              subMenuItem +
              "']",
            { timeout: 30000 },
          ).within(() => {
            cy.root().then((link) => {
              cy.request(link.prop("href")).its("status").should("eq", 200);
            });
          });
        } else {
          //if they are not external links then check here
          cy.get("a[title='" + subMenuItem + "'] span")
            .contains(subMenuItem)
            .should("be.visible")
            .click();
          this.verifyBreadcrumbText(text);
          this.verifyUrlText(urlText);
        }
        break;

      case "Content & Events":
        //click on main header
        cy.findByRole("button", { name: "Content & Events" })
          .should("be.visible")
          .click();

        //check if subheader are below categary because they are external links
        if (
          subMenuItem == "Global Practice Guides" ||
          subMenuItem == "Diversity and Inclusion"
        ) {
          cy.get(
            ".dropdown-menu[aria-labelledby='navmen_" +
              articleEvents +
              "'] a[title='" +
              subMenuItem +
              "'] span",
          )
            .contains(subMenuItem)
            .should("be.visible");
          cy.get(
            ".dropdown-menu[aria-labelledby='navmen_" +
              articleEvents +
              "'] a[title='" +
              subMenuItem +
              "']",
            { timeout: 30000 },
          ).within(() => {
            cy.root().then((link) => {
              cy.request(link.prop("href")).its("status").should("eq", 200);
            });
          });
        } else {
          //if they are not external links then check here
          cy.contains(subMenuItem).should("be.visible").click();
          this.verifyBreadcrumbText(text);
          this.verifyUrlText(urlText);
        }
        break;

      case "Submissions":
        cy.contains(menuItem).should("be.visible").click();
        cy.contains(subMenuItem).should("be.visible").click();
        break;
    }
  }

  //reusable methods
  verifyBreadcrumbText(breadcrumbText) {
    if (breadcrumbText != "NA") {
      cy.get("body", { timeout: 30000 }).should("contain", breadcrumbText, {
        timeout: 30000,
      });
      cy.get("span.text-secondary", { timeout: 10000 })
        .should("be.visible")
        .should("contain", breadcrumbText);
    }
  }

  verifyUrlText(urlText) {
    cy.url().should("contain", urlText);
  }
}

export const navPage = new NavPage();
