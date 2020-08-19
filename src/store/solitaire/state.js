// Return state as function so we can reset it.
const state = () => ({
  board: {
    cards: [],
    foundation: [],
  },
  selectedCardId: null,
  isGameWon: false,
  isGameLost: false,
  hasMoves: true,
  game: {
    id: null,
    moves: 0,
  },
});

export default state;
