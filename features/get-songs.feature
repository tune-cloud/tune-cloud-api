Feature: Get Songs
  Scenario: Successfully get songs for an artist
    Given a valid artist id
    When getting songs
    Then songs are returned
