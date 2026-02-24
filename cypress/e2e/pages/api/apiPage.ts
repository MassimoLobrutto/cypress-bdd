import BasePage from '../../helpers/basePage.js'
import { api } from "../../helpers/apiHelpers.js";

const baseApiUrl = 'https://restful-booker.herokuapp.com/booking/';
let payload = "";

export class ApiPage extends BasePage {

    createToken() {
        payload = `{
            "username" : "admin",
            "password" : "password123"
        }`
        api.addPayload(payload);
        api.postBearerToken("https://restful-booker.herokuapp.com/auth");
        cy.get('@lastResponse').then((result: any) => {
            expect(result.status).to.equal(200);
            cy.log(result.body.token)
            cy.wrap(result.body.token).as('token');
        })
    }

    getAllBookings() {
        api.getRequestNoAuth(baseApiUrl)
        cy.get('@lastResponse').then((result: any) => {
            cy.log(JSON.stringify(result.body))
            expect(result.status).to.equal(200);
        })
    }

    getSingleBooking(bookingId: string | number) {
        api.getRequestNoAuth(baseApiUrl + bookingId)
        cy.get('@lastResponse').then((result: any) => {
            cy.log(JSON.stringify(result.body))
            expect(result.status).to.equal(200);
        })
    }

    createBooking() {
        let firstname = "John";
        let lastname = "Wick";
        let totalprice = 1111;
        let depositpaid = true;
        let checkin = "2018-01-01";
        let checkout = "2019-01-01";
        let additionalneeds = "9mm Ammo";
        payload = `{
            "firstname" : "${firstname}",
            "lastname" : "${lastname}",
            "totalprice" : ${totalprice},
            "depositpaid" : ${depositpaid},
            "bookingdates" : {
                "checkin" : "${checkin}",
                "checkout" : "${checkout}"
            },
            "additionalneeds" : "${additionalneeds}"
        }`
        api.addPayload(payload);
        api.postRequestWithPayloadNoToken(baseApiUrl)
        cy.get('@lastResponse').then((result: any) => {
            cy.log(JSON.stringify(result.body))
            cy.log("Booking Id is " + result.body.bookingid)
            cy.wrap(result.body.bookingid).as('bookingId');
            expect(result.body.booking.firstname).to.equal(firstname);
            expect(result.body.booking.lastname).to.equal(lastname);
            expect(result.body.booking.depositpaid).to.equal(depositpaid);
            expect(result.body.booking.bookingdates.checkin).to.equal(checkin);
            expect(result.body.booking.bookingdates.checkout).to.equal(checkout);
            expect(result.body.booking.additionalneeds).to.equal(additionalneeds);
        })
    }

    updateBooking() {
        let firstname = "Jack";
        let lastname = "Reacher";
        let totalprice = 9999;
        let depositpaid = false;
        let checkin = "2020-01-01";
        let checkout = "2021-02-02";
        let additionalneeds = "7.62 Ammo";
        payload = `{
            "firstname" : ${firstname},
            "lastname" : ${lastname},
            "totalprice" : ${totalprice},
            "depositpaid" : ${depositpaid},
            "bookingdates" : {
                "checkin" : ${checkin},
                "checkout" : ${checkout}
            },
            "additionalneeds" : ${additionalneeds}
        }`
        this.createToken()
        api.addPayload(payload);
        cy.get('@bookingId').then((bookingId: any) => {
            api.putRequest(baseApiUrl + bookingId)
            cy.get('@lastResponse').then((result: any) => {
                cy.log("Booking Id is " + result.body.bookingid)
                cy.wrap(result.body.bookingid).as('bookingId');
                expect(result.body.booking.firstname).to.equal(firstname);
                expect(result.body.booking.lastname).to.equal(lastname);
                expect(result.body.booking.depositpaid).to.equal(depositpaid);
                expect(result.body.booking.bookingdates.checkin).to.equal(checkin);
                expect(result.body.booking.bookingdates.checkout).to.equal(checkout);
                expect(result.body.booking.additionalneeds).to.equal(additionalneeds);
            })
        })
    }

}
export const apiPage = new ApiPage();