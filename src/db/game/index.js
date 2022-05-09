import { db } from '../setup';
import { initCards, checkGameState } from '#solitaire';
import { createISODate } from '../helpers/dates';

export const getDeckByUid = ({ uid }) =>
  db()
    .collection('decks')
    .findOne({ uid }, { projection: { _id: 0, uid: 0 } });

export const getUserNewDeck = async ({ uid }) => {
  const { value } = await db()
    .collection('decks')
    .findOneAndUpdate(
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

export const saveGameByUid = async ({ uid, moves, time }) => {
  const { cards } = await getDeckByUid({ uid });
  const gameResult = checkGameState({ cards, moves, time });

  return db()
    .collection('games')
    .insertOne({
      date: createISODate(),
      uid,
      ...gameResult,
    });
};
