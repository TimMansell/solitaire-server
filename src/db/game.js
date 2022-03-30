import { initCards, checkGameState } from '#@/services/solitaire';
import { createISODate } from '#@/helpers/dates';
import 'dotenv/config';

export const getDeck = async (db, uid) => {
  const deck = await db
    .collection('decks')
    .findOne({ uid }, { projection: { cards: 1, _id: 0 } });

  return deck?.cards;
};

export const newDeck = async (db, uid) => {
  const date = createISODate();
  const cards = initCards();

  db.collection('decks').findOneAndUpdate(
    { uid },
    { $set: { uid, cards, date } },
    { upsert: true }
  );

  return cards;
};

export const saveNewGame = async (db, uid, game) => {
  const { moves, time } = game;
  const date = createISODate();

  const deck = await getDeck(db, uid);

  const { hasWon, hasLost } = checkGameState(moves, deck);

  await db.collection('games').insertOne({
    date,
    uid,
    moves: moves.length,
    time,
    won: hasWon,
    lost: hasLost,
    completed: true,
  });
};
