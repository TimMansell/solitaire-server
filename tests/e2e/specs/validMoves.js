import validMove from '../../fixtures/validMove.json';

const setDeck = (deck) => {
  const getStore = () => cy.window().its('app.$store');

  getStore().then((store) => {
    store.dispatch('dealTestCards', deck);
  });
};

describe('Valid moves', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should move 6d to 7d and 9d to 10d', () => {
    setDeck(validMove);

    // Test card from middle.
    cy.get('[data-test="column-3"]').within(() => {
      cy.get('[data-test="card-6d"]').should('be.visible');
    });

    cy.get('[data-test="card-6d"]').click();
    cy.get('[data-test="card-7d"]').click();

    cy.get('[data-test="column-2"]').within(() => {
      cy.get('[data-test="card-6d"]').should('be.visible');
    });

    // Test card from bottom.
    cy.get('[data-test="column-1"]').within(() => {
      cy.get('[data-test="card-9d"]').should('be.visible');
    });

    cy.get('[data-test="card-9d"]').click();
    cy.get('[data-test="card-10d"]').click();

    cy.get('[data-test="column-6"]').within(() => {
      cy.get('[data-test="card-9d"]').should('be.visible');
    });
  });
});
