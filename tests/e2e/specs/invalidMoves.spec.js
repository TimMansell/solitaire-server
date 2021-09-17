import fullGameDeck from '../../fixtures/decks/fullGame.json';

describe('Invalid moves', () => {
  beforeEach(() => {
    cy.mockApi({
      mockDeck: fullGameDeck,
      mockInitial: true,
    });

    cy.visitApp();
  });

  afterEach(() => {
    cy.clearTest();
  });

  describe('using drag and drop', () => {
    it('should not move 9♥ to 4♣ (invalid value & suit)', () => {
      cy.dragFromTo('card-9♥', 'card-4♣');

      cy.get('[data-test="column-7"]').shouldNotContain(['9♥']);
    });

    it('should not move 2♠ to 4♣ (lower value and invalid suit)', () => {
      cy.dragFromTo('card-2♠', 'card-4♣');

      cy.get('[data-test="column-7"]').shouldNotContain(['2♠']);
    });

    it('should not move 6♥ to 4♣ (higher value and invalid suit)', () => {
      cy.dragFromTo('card-6♥', 'card-4♣');

      cy.get('[data-test="column-7"]').shouldNotContain(['6♥']);
    });

    it('should not move 3♦ to 4♣ (valid value and invalid suit)', () => {
      cy.dragFromTo('card-3♦', 'card-4♣');

      cy.get('[data-test="column-7"]').shouldNotContain(['3♦']);
    });

    it('should not move 8♣ to 4♣ (invalid value and valid suit)', () => {
      cy.dragFromTo('card-8♣', 'card-4♣');

      cy.get('[data-test="column-1"]').shouldNotContain(['8♣']);
    });
  });

  describe('using clicks', () => {
    it('should not move 9♥ to 4♣ (invalid value & suit)', () => {
      cy.clickFromTo('9♥', '4♣');

      cy.get('[data-test="column-7"]').shouldNotContain(['9♥']);
    });

    it('should not move 2♠ to 4♣ (lower value and invalid suit)', () => {
      cy.clickFromTo('2♠', '4♣');

      cy.get('[data-test="column-7"]').shouldNotContain(['2♠']);
    });

    it('should not move 6♥ to 4♣ (higher value and invalid suit)', () => {
      cy.clickFromTo('6♥', '4♣');

      cy.get('[data-test="column-7"]').shouldNotContain(['6♥']);
    });

    it('should not move 3♦ to 4♣ (valid value and invalid suit)', () => {
      cy.clickFromTo('3♦', '4♣');

      cy.get('[data-test="column-7"]').shouldNotContain(['3♦']);
    });

    it('should not move 8♣ to 4♣ (invalid value and valid suit)', () => {
      cy.clickFromTo('8♣', '4♣');

      cy.get('[data-test="column-1"]').shouldNotContain(['8♣']);
    });
  });
});
