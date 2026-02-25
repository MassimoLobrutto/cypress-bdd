Feature: API CRUD Operations

  @apiTests
  @regression
  Scenario: Create, Read, Update, and Delete a post
    Given I send a POST request to "/posts" with title "BDD Test" and body "Playwright is awesome"
    Then the response status should be 201
    And the response body should contain title "BDD Test"

    When I send a GET request to "/posts/1"
    Then the response status should be 200
    And the response body should contain id 1

    When I send a PUT request to "/posts/1" with updated title "Updated BDD Test"
    Then the response status should be 200
    And the response body should contain title "Updated BDD Test"

    When I send a DELETE request to "/posts/1"
    Then the response status should be 200
