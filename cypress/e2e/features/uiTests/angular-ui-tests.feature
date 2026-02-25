Feature: Chambers.com Meet the Team search functionality
  As a Chambers.com user
  I want to be able to perform various searches
  On the Meet the Team page
  So that I can find profiles of Chambers.com employees

  Background:
    Given I navigate to Chambers new homepage
    When I go to "Submissions" and "Research Team" from the top navigation and "Chambers Research Team" page is displayed with correct "the-research-team" on Chambers

  @regression
  Scenario Outline: Verify a team member can be searched by name
    When I search by "<name>"
    Then users with selected "<name>" are displayed

    Examples:
      | name   |
      | ALEX   |
      | NOBODY |

  @regression
  Scenario Outline: Verify a team member can be searched by guide
    When I search the region "<guide>"
    Then users from selected region "<guide>" are displayed

    Examples:
      | guide  |
      | Europe |
