import fullGameDeck from '../../fixtures/decks/fullGame.json';
import quitGameDeck from '../../fixtures/decks/quitGame.json';
import quitGameMoves from '../../fixtures/moves/quitGame.json';
import emptyColumnDeck from '../../fixtures/decks/emptyColumn.json';
import emptyColumnMoves from '../../fixtures/moves/emptyColumn.json';

describe('Game State', () => {
  afterEach(() => {
    cy.clearTest();
  });

  it('should pause when page is automatically hidden', () => {
    cy.visitApp({ mockDeck: fullGameDeck });

    cy.document().then((doc) => {
      cy.stub(doc, 'visibilityState').value('hidden');
    });

    cy.document().trigger('visibilitychange');

    cy.get('[data-test="game-paused"]').should('be.visible');
  });

  it('refreshing page shows same board state', () => {
    cy.visitApp({ mockDeck: fullGameDeck });

    cy.get('[data-test^="card-9♠"]')
      .click()
      .should('have.class', 'card--is-selected');

    cy.reload();

    cy.get('[data-test^="card-9♠"]')
      .should('have.class', 'card--is-selected')
      .click()
      .should('not.have.class', 'card--is-selected');

    cy.get('[data-test="column-0"] [data-test^="card"]')
      .eq(6)
      .then(($card) => $card.attr('data-test'))
      .should('contain', 'card-9♠');

    cy.get('[data-test="column-2"] [data-test^="card"]')
      .eq(4)
      .then(($card) => $card.attr('data-test'))
      .should('contain', 'card-J♦');

    cy.get('[data-test="column-5"] [data-test^="card"]')
      .eq(1)
      .then(($card) => $card.attr('data-test'))
      .should('contain', 'card-A♣');

    cy.wait('@waitForInitialDataAPI');
  });

  it('should show correct games, time, and moves on page refresh', () => {
    cy.visitApp({ mockDeck: quitGameDeck });

    cy.runGameWithClicks(quitGameMoves);

    cy.get('[data-test="stats"]')
      .as('stats')
      .text()
      .then(($value) => {
        cy.wrap($value).as('cachedStats');
      });

    cy.get('[data-test="timer"]')
      .as('timer')
      .text()
      .then(($value) => {
        cy.wrap($value).as('cachedTimer');
      });

    cy.get('[data-test="moves"]')
      .as('moves')
      .text()
      .then(($value) => {
        cy.wrap($value).as('cachedMoves');
      });

    cy.reload();

    cy.get('@cachedStats').then(($stats) => {
      cy.get('@stats')
        .text()
        .should('equal', $stats);
    });

    cy.get('@cachedTimer').then(($timer) => {
      cy.get('@timer')
        .text()
        .should('equal', $timer);
    });

    cy.get('@cachedMoves').then(($moves) => {
      cy.get('@moves')
        .text()
        .should('equal', $moves);
    });

    cy.pauseGame();

    cy.checkGameSummaryValues({ moves: 10 });
  });

  it('clicking on new game sets new board state', () => {
    cy.visitApp({ mockDeck: emptyColumnDeck });

    cy.runGameWithClicks(emptyColumnMoves);

    cy.startNewGame();

    cy.get('[data-test="columns"]').within(() => {
      cy.get('[data-test="column-card-placeholder"]').should('not.exist');
    });

    cy.wait('@waitForCreateUserAPI');
  });
});
