import BasePage from '../../helpers/basePage.js'
import { db } from "../../helpers/dbHelpers.js";

export class HomePage extends BasePage {
dbTests() {
    db.queryDb("shield","shieldfaculty","SELECT * FROM facultydetails where firstname = 'fail'").then(result => {
        cy.log(result[0].firstname)        
    })
    db.queryDb("shield","shieldfaculty","SELECT * FROM facultydetails").then(result => {
        cy.log(result[0].surname)        
    })
    db.queryDb("shield","shieldfaculty","SELECT top (1) * FROM facultydetails").then(result => {
        cy.log(result[0].age)        
    })
    db.queryDb("shield","shieldstudent","SELECT * FROM studentdetails").then(result => {
        cy.log(result[0].firstname)        
    })
}

}
export const dbPage = new HomePage();