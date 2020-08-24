import actions from '../actions';

const {
  initGame,
  restartGame,
  trackNewGame,
  checkGameState,
  setFoundations,
  setBoard,
  setCard,
  moveCardsToColumn,
  moveCardToFoundation,
  autoMoveCardToFoundation,
} = actions;

const commit = jest.fn();
const dispatch = jest.fn();

const mockResponse = {
  _id: 123,
  gameNumber: 2,
};

jest.mock('@/services/solitaire', () => ({
  init: () => jest.fn(),
  isEmptyBoard: () => true,
  getFoundationCards: () => [],
  getBoardCards: () => [],
  hasMoves: () => false,
  setSelectedCard: () => 1,
  findEmptyFoundationColumn: () => 0,
  isValidCardMove: () => true,
  moveCards: () => jest.fn(),
  isValidFoundationMove: () => true,
  moveCardsToFoundation: () => jest.fn(),
  setBoard: () => jest.fn(),
  setFoundation: () => jest.fn(),
}));

jest.mock('@/services/db', () => ({
  newGame: () => ({
    response: mockResponse,
  }),
  gameCompleted: () => jest.fn(),
  gameWon: () => jest.fn(),
}));

describe('Solitaire Store', () => {
  it('initGame - new game', async () => {
    const state = {
      isNewGame: true,
    };

    await initGame({ commit, dispatch, state });

    expect(dispatch).toHaveBeenCalledWith('trackNewGame');
  });

  it('restartGame', () => {
    const state = {
      game: {
        id: 1,
        moves: 10,
      },
    };

    restartGame({ commit, state }, false);

    expect(commit).toHaveBeenCalledWith('RESTART_GAME');
  });

  it('trackNewGame', async () => {
    const rootState = {
      user: {
        suid: 123,
      },
    };

    await trackNewGame({ commit, dispatch, rootState });

    expect(dispatch).toHaveBeenCalledWith('setUserStats', { gameNumber: mockResponse.gameNumber });
    // eslint-disable-next-line no-underscore-dangle
    expect(commit).toHaveBeenCalledWith('SET_GAME', { id: mockResponse._id });
  });

  it('checkGameState', () => {
    const state = {
      game: {
        id: 1,
        moves: 10,
      },
    };

    checkGameState({ commit, state });

    expect(commit).toHaveBeenCalledWith('SET_GAME_WON', true);
    expect(commit).toHaveBeenCalledWith('SET_GAME_LOST', false);
  });

  it('setFoundations', () => {
    setFoundations({ commit });

    expect(commit).toHaveBeenCalledWith('SET_FOUNDATIONS', []);
  });

  it('setBoard', () => {
    setBoard({ commit });

    expect(commit).toHaveBeenCalledWith('SET_BOARD', []);
  });

  it('setCard - select', () => {
    const state = {
      selectedCard: 2,
    };

    setCard({ commit, state }, 1);

    expect(commit).toHaveBeenCalledWith('SELECT_CARD', 1);
  });

  it('setCard - unselect', () => {
    const state = {
      selectedCard: 1,
    };

    setCard({ commit, state, dispatch }, 1);

    expect(dispatch).toHaveBeenCalledWith('unselectCard');
  });

  it('moveCardsToColumn', () => {
    moveCardsToColumn({ commit, dispatch });

    expect(dispatch).toHaveBeenCalledWith('setBoard');
    expect(dispatch).toHaveBeenCalledWith('checkGameState');
    expect(dispatch).toHaveBeenCalledWith('unselectCard');
    expect(commit).toHaveBeenCalledWith('INCREMENT_MOVES');
  });

  it('moveCardToFoundation', () => {
    moveCardToFoundation({ commit, dispatch });

    expect(dispatch).toHaveBeenCalledWith('setBoard');
    expect(dispatch).toHaveBeenCalledWith('setFoundations');
    expect(dispatch).toHaveBeenCalledWith('checkGameState');
    expect(dispatch).toHaveBeenCalledWith('unselectCard');
    expect(commit).toHaveBeenCalledWith('INCREMENT_MOVES');
  });

  it('autoMoveCardToFoundation', () => {
    autoMoveCardToFoundation({ dispatch });

    expect(dispatch).toHaveBeenCalledWith('moveCardToFoundation', 0);
  });
});
