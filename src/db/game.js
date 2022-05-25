import { db } from './setup';
import { initCards, checkGameState } from '#solitaire';
import { createISODate } from './helpers/dates';

export const getUserDeck = ({ uid }) =>
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

export const saveGame = async ({ uid, moves, time }) => {
  const { cards } = await getUserDeck({ uid });
  const gameResult = checkGameState({ cards, moves, time });

  await db()
    .collection('games')
    .insertOne({
      date: createISODate(),
      uid,
      ...gameResult,
    });

  return { uid };
};
