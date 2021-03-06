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

  Scenario: Successfully get songs with an artist filter
    Given a valid artist id with multiple bands
    And an artist filter
    When getting songs
    Then a song list filtered on artist is returned

  Scenario Outline: Successfully get songs top X number of songs
    Given a valid artist id
    When getting top <number of songs> songs
    Then <number of songs> songs are returned

    Examples:
    | number of songs |
    | 1               |
    | 5               |
    | 111             |
