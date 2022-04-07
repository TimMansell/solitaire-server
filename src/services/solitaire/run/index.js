import { runGameMoves } from './run';
import { isBoardEmpty } from '../board';
import { checkHasMoves } from '../moves';

// eslint-disable-next-line import/prefer-default-export
export const checkGameState = (game, deck) => {
  const { moves } = game;
  const { cards, foundation } = runGameMoves(moves, deck);

  const isGameFinished = isBoardEmpty({ cards });

  const hasMoves = checkHasMoves({
    cards,
    foundation,
  });

  const hasWon = isGameFinished && !hasMoves;
  const hasLost = !isGameFinished && !hasMoves;

  return { moves: moves.length, won: hasWon, lost: hasLost, completed: true };
};
