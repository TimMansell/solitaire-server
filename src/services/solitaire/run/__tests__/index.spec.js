import { checkGameState } from '../index';

import fullGameDeck from '../../../../../tests/fixtures/decks/fullGame.json';
import fullGameMoves from '../../../../../tests/fixtures/moves/fullGame.json';
import incompleteGameDeck from '../../../../../tests/fixtures/decks/incompleteGame.json';
import incompleteGameMoves from '../../../../../tests/fixtures/moves/incompleteGame.json';
import quitGameDeck from '../../../../../tests/fixtures/decks/quitGame.json';
import quitGameMoves from '../../../../../tests/fixtures/moves/quitGame.json';

describe('run', () => {
  describe('checkGameState', () => {
    it('should be won game', () => {
      const { hasWon, hasLost } = checkGameState(fullGameMoves, fullGameDeck);

      expect(hasWon).toBe(true);
      expect(hasLost).toBe(false);
    });

    it('should be lost game', () => {
      const { hasWon, hasLost } = checkGameState(
        incompleteGameMoves,
        incompleteGameDeck
      );

      expect(hasWon).toBe(false);
      expect(hasLost).toBe(true);
    });

    it('should be quit game', () => {
      const { hasWon, hasLost } = checkGameState(quitGameMoves, quitGameDeck);

      expect(hasWon).toBe(false);
      expect(hasLost).toBe(false);
    });
  });
});
