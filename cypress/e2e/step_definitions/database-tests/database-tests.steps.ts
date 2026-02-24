import { Given } from "@badeball/cypress-cucumber-preprocessor"
import { dbPage } from "../../pages/database/databasePage"

Given("I test the database", () => {
    dbPage.dbTests();
})