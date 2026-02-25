Feature: Test Database methods
  As a database user
  I want to be able to search on the database
  So that I can verify database helper methods are working correctly

  @databaseTests
  @regression
  Scenario: Verify database query results are printed correctly
    Given I query db and print results
