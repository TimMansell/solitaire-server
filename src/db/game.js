import { db } from './setup';
import { initCards, checkGameState } from '#solitaire';
import { createISODate } from './helpers/dates';

export const getUserDeck = async ({ uid }) => {
  const { deck } = await db()
    .collection('users')
    .findOne({ uid }, { projection: { _id: 0, uid: 0 } });

  return deck;
};

export const getUserNewDeck = async ({ uid }) => {
  const {
    value: { deck },
  } = await db()
    .collection('users')
    .findOneAndUpdate(
      { uid },
      { $set: { deck: { cards: initCards(), date: createISODate() } } },
      {
        projection: { _id: 0, uid: 0 },
        upsert: true,
        returnDocument: 'after',
      }
    );

  return deck;
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
