Feature: Search Artists
  Scenario: Successfully find artists
    Given an artist name
    When searching for an artist
    Then the artist is returned

  Scenario:  Fuzzy Search for an artist
    Given search close to the artist
    When searching for an artist
    Then an artist matching the search is returned
