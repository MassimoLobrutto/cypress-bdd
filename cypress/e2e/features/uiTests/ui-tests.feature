Feature: Playwright BDD Scenario Outline Example
  As a tester
  I want to be able to login with accounts in different sattes
  So that I can verify the correct post logon messages are displayed

  Background:
    Given I navigate to the saucelabs login page

  @uiTests
  @regression
  Scenario Outline: Login to to sauce labs
    When I login to the admin dashboard with username "<username>"
    Then I should see the "<expectedMessage>" message

    Examples:
      | username        | expectedMessage                                             |
      | locked_out_user | Sorry, this user has been locked out.                       |
      | incorrect_user  | Username and password do not match any user in this service |
      |                 | Username is required                                        |

  @uiTests
  @regression
  Scenario: Standard user completes a purchase
    When I login as a "standard" user
    And I add "Sauce Labs Backpack" to the cart
    And I checkout with information "Alex", "Coggins", "12345"
    Then the order should be successful

  @uiTests
  @regression
  Scenario: Problem user sees broken assets
    When I login as a "problem" user
    Then I should see a broken image for the products

  @uiTests
  @regression
  Scenario: Performance user experiences latency
    Then the login should happen within 6 seconds
