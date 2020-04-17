import shuffle from 'lodash.shuffle';
import {
  isMoveValidVisible,
  isMoveValidCard,
  isMoveValidSuit,
  isMoveValidOrder,
  isMoveValidPosition,
  isMoveValidColumn,
  isCardValidSize,
  isValidKingMove,
  isValidFoundationMove,
} from './validation';
import { moveCardsFrom, moveCardsTo } from './helpers';

const cardsArray = {
  values: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
  suits: ['c', 's', 'h', 'd'],
};

const rules = {
  columns: [7, 7, 7, 7, 6, 6, 6, 6],
  foundationColumns: [1, 1, 1, 1],
};

const getFoundations = () => rules.foundationColumns;

const shuffleCards = () => {
  const { values, suits } = cardsArray;

  const deck = values.flatMap((value, index) => suits.map((suit) => {
    const card = {
      id: `${index}${suit}`,
      value,
      order: index + 1,
      suit,
      visible: false,
    };

    return card;
  }));

  const shuffledDeck = shuffle(deck);

  return shuffledDeck;
};

const setBoard = (shuffledCards) => {
  const showCards = (cards, offset = 0) => cards.map((card, index) => {
    if ((index + offset) % 2 === 0) {
      return {
        ...card,
        visible: true,
      };
    }

    return card;
  });

  const dealtCards = rules.columns.map((column, columnIndex, array) => {
    const startArray = array.slice(0, columnIndex);
    const endArray = array.slice(0, columnIndex + 1);

    const calcOffset = (accumulator, currentValue) => accumulator + currentValue;

    const startIndex = startArray.reduce(calcOffset, 0);
    const endIndex = endArray.reduce(calcOffset, 0);

    const cards = shuffledCards.slice(startIndex, endIndex).map((shuffledCard, index) => {
      const card = {
        ...shuffledCard,
        position: [columnIndex, index],
      };

      return card;
    });

    // Offset by one.
    if (columnIndex > 3) {
      return showCards(cards, 1);
    }

    return showCards(cards);
  });

  return dealtCards;
};

const checkValidCardMove = ({ board, selectedCards }) => {
  const [toMove, moveTo] = selectedCards;

  const isValidVisible = isMoveValidVisible(toMove, moveTo);
  const isValidCard = isMoveValidCard(toMove, moveTo);
  const isValidSuit = isMoveValidSuit(toMove, moveTo);
  const isValidOrder = isMoveValidOrder(toMove, moveTo);
  const isValidPosition = isMoveValidPosition(moveTo, board);
  const isValidColumn = isMoveValidColumn(toMove, moveTo);

  return isValidVisible && isValidCard && isValidSuit && isValidOrder && isValidPosition && isValidColumn;
};

const isBothCardsSelected = ({ selectedCards }) => {
  if (selectedCards.length === 2) {
    return true;
  }

  return false;
};

// const moveCards = ({ board, selectedCards }) => {
//   const [toMove, moveTo] = selectedCards;

//   const cardsToMove = moveCardsFrom(toMove, board);
//   const moveCardsToColumn = moveCardsTo(board, cardsToMove, moveTo.position[0]);
//   const removeCardsFromColumn = removeCardsFrom(toMove, board);

//   const colsToMove = {
//     from: toMove.position[0],
//     to: moveTo.position[0],
//   };

//   return {
//     colsToMove,
//     moveCardsToColumn,
//     removeCardsFromColumn,
//   };
// };

// const getMoveToColumnCards = (selectedColumn, cards) => {
//   // const columnCards = getSelectedCard(selectedColumn, cards);
//   const columnCards = cards[selectedColumn];

//   return columnCards;
// };

const moveCards = (selectedCardId, selectedColumn, cardsFrom, cardsTo) => {
  console.log('dfsafsda', selectedCardId, selectedColumn, cardsFrom, cardsTo);
  const cardFromColumn = moveCardsFrom(selectedCardId, cardsFrom);
  const cardsToColumn = moveCardsTo(selectedCardId, selectedColumn, cardsFrom, cardsTo);

  console.log('cardFromColumn', cardFromColumn);
  console.log('cardsToColumn', cardsToColumn);

  return {
    cardFromColumn,
    cardsToColumn,
  };
};

const revealHiddenCard = ({ board }) => {
  const { cards } = board;

  const updatedDeck = cards.map((column) => {
    const updatedCards = column.map((updatedCard, index) => {
      if (index === column.length - 1 && !updatedCard.visible) {
        return {
          ...updatedCard,
          visible: true,
          revealed: true,
        };
      }

      return updatedCard;
    });

    return updatedCards;
  });

  return updatedDeck;
};

// const moveCardToFoundation = ({ board, selectedCards }, column) => {
//   const [toMove] = selectedCards;
//   const { position } = toMove;

//   const removeCardsFromColumn = board.cards[position[0]].slice(0, position[1]);

//   return {
//     toMove,
//     column,
//     removeCardsFromColumn,
//   };
// };

const checkValidFoundationMove = ({ board, selectedCards }, column) => {
  const [toMove] = selectedCards;

  const isValidSize = isCardValidSize(toMove);
  const isValidFoundation = isValidFoundationMove(toMove, board, column);

  return isValidSize && isValidFoundation;
};

// const moveKingToColumn = ({ board, selectedCards }, column) => {
//   const [toMove] = selectedCards;

//   const cardsToMove = moveCardsFrom(toMove, board);
//   const moveCardsToColumn = moveCardsTo(board, cardsToMove, column);
//   // const removeCardsFromColumn = removeCardsFrom(toMove, board);

//   return {
//     toMove,
//     column,
//     moveCardsToColumn,
//     // removeCardsFromColumn,
//   };
// };

const checkValidKingMove = ({ board, selectedCards }, column) => {
  const [toMove] = selectedCards;

  const isValidSize = isCardValidSize(toMove);
  const isValidMove = isValidKingMove(toMove, board, column);

  return isValidSize && isValidMove;
};

export {
  shuffleCards,
  getFoundations,
  setBoard,
  isBothCardsSelected,
  checkValidCardMove,
  moveCards,
  revealHiddenCard,
  // moveCardToFoundation,
  checkValidFoundationMove,
  // moveKingToColumn,
  checkValidKingMove,
  // getMoveToColumnCards,
};
