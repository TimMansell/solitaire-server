import shuffle from 'lodash.shuffle';
import {
  isMoveValidCard,
  isMoveValidSuit,
  isMoveValidOrder,
  isMoveValidColumn,
  isValidKingMove,
  isMoveValidFoundationSuit,
  isMoveValidFoundationOrder,
} from './validation';
import { getSelectedCard, getLastCard, moveCardsFrom, moveCardsTo } from './helpers';

export default class Solitaire {
  constructor() {
    this.cards = {
      values: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
      suits: ['c', 's', 'h', 'd'],
    };

    this.rules = {
      columns: [7, 7, 7, 7, 6, 6, 6, 6],
      foundationColumns: [1, 1, 1, 1],
    };
  }

  shuffleCards() {
    const { values, suits } = this.cards;

    const deck = values.flatMap((value, index) =>
      suits.map((suit) => {
        const card = {
          id: `${index}${suit}`,
          value,
          order: index + 1,
          suit,
          visible: false,
        };

        return card;
      })
    );

    const shuffledDeck = shuffle(deck);

    this.shuffledCards = shuffledDeck;
  }

  setDeck(deck) {
    if (deck) {
      this.deck = deck;
    } else {
      this.deck = this.shuffledCards;
    }
  }

  setBoard() {
    const { columns } = this.rules;
    const { deck } = this;

    const showCards = (cards, offset = 0) =>
      cards.map((card, index) => {
        if ((index + offset) % 2 === 0) {
          return {
            ...card,
            visible: true,
          };
        }

        return card;
      });

    const dealtCards = columns.map((column, columnIndex, array) => {
      const startArray = array.slice(0, columnIndex);
      const endArray = array.slice(0, columnIndex + 1);

      const calcOffset = (accumulator, currentValue) => accumulator + currentValue;

      const startIndex = startArray.reduce(calcOffset, 0);
      const endIndex = endArray.reduce(calcOffset, 0);

      const cards = deck.slice(startIndex, endIndex).map((shuffledCard, index) => {
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

    this.boardCards = dealtCards;
  }

  setSelectedCard(id) {
    this.selectedCardId = id;
  }

  removeSelectedCard() {
    this.selectedCardId = null;
  }

  setMoveCards(selectedColumn, cardsFrom, cardsTo) {
    const { selectedCardId } = this;
    const cardFromColumn = moveCardsFrom(selectedCardId, cardsFrom);
    const cardsToColumn = moveCardsTo(selectedCardId, selectedColumn, cardsFrom, cardsTo);

    this.MovedCards = {
      cardFromColumn,
      cardsToColumn,
    };
  }

  isValidCardMove(selectedColumn, board) {
    const { selectedCardId } = this;

    const selectedCard = getSelectedCard(board, selectedCardId);
    const lastColumnCard = getLastCard(board, selectedColumn);

    // Relaxed validation for K to empty column
    if (!lastColumnCard) {
      const isValidKing = isValidKingMove(selectedCard, lastColumnCard);

      return isValidKing;
    }

    // General validation.
    const isValidCard = isMoveValidCard(selectedCard, lastColumnCard);
    const isValidSuit = isMoveValidSuit(selectedCard, lastColumnCard);
    const isValidOrder = isMoveValidOrder(selectedCard, lastColumnCard);
    const isValidColumn = isMoveValidColumn(selectedCard, lastColumnCard);

    return isValidCard && isValidSuit && isValidOrder && isValidColumn;
  }

  isValidFoundationMove(selectedColumn, board) {
    const { selectedCardId } = this;

    const selectedCard = getSelectedCard(board.cards, selectedCardId);
    const isValidFoundationSuit = isMoveValidFoundationSuit(selectedCard, selectedColumn, board);
    const isValidFoundationOrder = isMoveValidFoundationOrder(selectedCard, selectedColumn, board);

    return isValidFoundationSuit && isValidFoundationOrder;
  }

  getBoard() {
    return this.boardCards;
  }

  getFoundations() {
    return this.rules.foundationColumns;
  }

  getMovedCards() {
    return this.MovedCards;
  }
}
