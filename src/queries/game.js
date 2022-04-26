import { initCards, checkGameState } from '#@/services/solitaire';
import { createISODate } from '#@/helpers/dates';

export const checkGameStarted = ({ hasGameStarted }) =>
  JSON.parse(hasGameStarted);

export const getDeck = ({ db, uid }) =>
  db.collection('decks').findOne({ uid }, { projection: { _id: 0, uid: 0 } });

export const newDeck = async ({ db, uid }) => {
  const { value } = await db.collection('decks').findOneAndUpdate(
    { uid },
    { $set: { cards: initCards(), date: createISODate() } },
    {
      projection: { _id: 0, uid: 0 },
      upsert: true,
      returnDocument: 'after',
    }
  );

  return value;
};

export const saveGame = async ({ db, uid, moves, time }) => {
  const { cards } = await getDeck({ db, uid });
  const gameResult = checkGameState({ cards, moves, time });

  return db.collection('games').insertOne({
    date: createISODate(),
    uid,
    ...gameResult,
  });
};
