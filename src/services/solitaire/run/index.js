import { runGameMoves } from './run';
import { isBoardEmpty } from '../board';
import { checkHasMoves } from '../moves';

// eslint-disable-next-line import/prefer-default-export
export const checkGameState = (game, deck) => {
  const { moves, time } = game;
  const { cards, foundation } = runGameMoves(moves, deck);

  const isGameFinished = isBoardEmpty({ cards });

  const hasMoves = checkHasMoves({
    cards,
    foundation,
  });

  const hasWon = isGameFinished && !hasMoves;
  const hasLost = !isGameFinished && !hasMoves;

  return {
    moves: moves.length,
    time,
    won: hasWon,
    lost: hasLost,
    completed: true,
  };
};
