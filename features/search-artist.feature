Feature: Search Artists
  Scenario: Sucessfully find artists
    Given an artist name
    When searching for an artist
    Then the artist is returned
