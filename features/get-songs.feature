Feature: Get Songs
  Scenario: Successfully get songs for an artist
    Given a valid artist id
    When getting songs
    Then songs are returned

  Scenario: Successfully get songs with a song filter
    Given a valid artist id
    And a song filter
    When getting songs
    Then a filtered song list is returned
