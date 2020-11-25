import foundations from '../../fixtures/boards/fullFoundation.json';
import noMovesKingColumn from '../../fixtures/boards/noMovesKingColumn.json';

describe('Game State', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('refreshing page shows same board state', () => {
    cy.setBoard(foundations).then(() => {
      cy.get('[data-test="card-Qs"]')
        .click()
        .should('have.class', 'card--is-selected');

      cy.reload();

      cy.get('[data-test="column-0"]')
        .children()
        .should('have.length', 2);

      cy.get('[data-test="columns"]').within(() => {
        cy.get('[data-test="card-placeholder"]').should('have.length', 7);
      });
    });
  });

  it('clicking on new game sets new board state', () => {
    cy.setBoard(foundations).then(() => {
      cy.get('[data-test="new-game-btn"]').click();

      cy.reload();

      cy.get('[data-test="columns"]').within(() => {
        cy.get('[data-test="card-placeholder"]').should('have.length', 0);
      });
    });
  });

  it('clicking on card then refreshing page should highlight card, then unhighlight card', () => {
    cy.setBoard(foundations).then(() => {
      cy.get('[data-test="card-Qs"]')
        .click()
        .should('have.class', 'card--is-selected');

      cy.reload();

      cy.get('[data-test="column-1"]').click();

      cy.get('[data-test="card-Qs"]').should('not.have.class', 'card--is-selected');
    });
  });

  it('refreshing page on game won shows game won state', () => {
    cy.setBoard(foundations).then(() => {
      cy.get('[data-test="card-Qs"]').clickTo('[data-test="foundation-3"]');
      cy.get('[data-test="card-Ks"]').clickTo('[data-test="foundation-3"]');

      cy.get('[data-test="game-won"]').should('be.visible');

      cy.reload();

      cy.get('[data-test="game-won"]').should('be.visible');
    });
  });

  it('refreshing page on game lost shows game lost state', () => {
    cy.setBoard(noMovesKingColumn).then(() => {
      cy.get('[data-test="card-Kc"]').clickTo('[data-test="column-1"]');
      cy.get('[data-test="card-Qc"]').clickTo('[data-test="card-Kc"]');

      cy.get('[data-test="game-lost"]').should('be.visible');

      cy.reload();

      cy.get('[data-test="game-lost"]').should('be.visible');
    });
  });

  it('refreshing page on how to play shows how to play', () => {
    cy.get('[data-test="game-rules-btn"]').click();

    cy.get('[data-test="rules-overlay"]').should('be.visible');

    cy.reload();

    cy.get('[data-test="rules-overlay"]').should('be.visible');
  });

  it('should pause when page is automatically hidden', () => {
    cy.document().then((doc) => {
      cy.stub(doc, 'visibilityState').value('hidden');
    });

    cy.document().trigger('visibilitychange');

    cy.wait(3000);

    cy.get('[data-test="game-paused"]').should('be.visible');
  });

  it('refreshing page on game paused shows game paused state', () => {
    cy.get('[data-test="pause-game-btn"]').click();

    cy.get('[data-test="game-paused"]').should('be.visible');

    cy.reload();

    cy.get('[data-test="game-paused"]').should('be.visible');
  });
});