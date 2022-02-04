import { initCards, checkGameState } from '../services/solitaire';
import { createISODate } from '../helpers/dates';
import 'dotenv/config';

export const newDeck = async (db, uid) => {
  const date = createISODate();
  const cards = initCards();

  db.collection('decks').findOneAndUpdate(
    { uid },
    { $set: { uid, cards, date, hasPlayed: false } },
    { upsert: true }
  );

  return cards;
};

export const saveNewGame = async (db, uid, game) => {
  const { moves, time } = game;
  const date = createISODate();

  // Find users deck.
  const { value } = await db
    .collection('decks')
    .findOneAndUpdate(
      { uid, hasPlayed: false },
      { $set: { hasPlayed: true } },
      { projection: { cards: 1 } }
    );

  const { cards } = value;
  const { isGameFinished, hasMoves } = checkGameState(moves, cards);

  await db.collection('games').insertOne({
    date,
    uid,
    moves: moves.length,
    time,
    won: isGameFinished && !hasMoves,
    lost: !isGameFinished && !hasMoves,
    completed: true,
  });
};
