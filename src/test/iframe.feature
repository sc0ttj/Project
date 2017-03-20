Feature: iFrame wrapper
  Some Visual Journalism projects are delivered via iframes and live inside CPS pages.
  These projects may also by syndicated to third-party sites - so must apply BBC branding where appropriate and work cross-domain.

  Scenario: BBC branding
    Given I am looking at an iframed bespoke
    And I am looking at it from a non-BBC domain
    Then BBC branding should be applied

  Scenario: iFrame scaffold is initialised
    Given I am looking at an iframed bespoke
    When the page has finished loading
    Then the iframe should have been initialised

  Scenario: Viewport is resized
    Given I am looking at an iframed bespoke
    When the width of the viewport is resized
    Then the iframe should resize accordingly

  Scenario: Size of the iFrame content changes
    Given I am looking at an iframed bespoke
    When the size of the iframe content changes
    Then the iframe should resize to the height of its content

  Scenario: Wrapper classes - iframe
    Given I am looking at an iframed bespoke
    Then I should see the selector '.bbc-news-vj-wrapper'
    And I should see the selector '.bbc-news-vj-wrapper--iframe'
    And I should NOT see the selector '.bbc-news-vj-wrapper--full-width'

  Scenario: Wrapper determines whether or not we're on the BBC Site
    Given I am looking at an iframed bespoke
    And I am on a BBC domain
    Then I should see the selector '.bbc-news-vj-onbbcdomain'
    But if I am NOT on a BBC domain
    Then I should NOT see the selector '.bbc-news-vj-onbbcdomain'
