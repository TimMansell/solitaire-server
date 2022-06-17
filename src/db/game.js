import { db } from './setup';
import { initCards, checkGameState } from '#solitaire';
import { createISODate } from './helpers/dates';
import { getUserByUid } from '#db';

export const getUserNewDeck = async ({ uid, cards }) => {
  const {
    value: { deck },
  } = await db()
    .collection('users')
    .findOneAndUpdate(
      { uid },
      {
        $set: {
          deck: {
            cards: cards || initCards(),
            date: createISODate(),
          },
        },
      },
      {
        projection: { _id: 0, uid: 0 },
        upsert: true,
        returnDocument: 'after',
      }
    );

  return deck;
};

export const saveGame = async ({ uid, moves, time }) => {
  const {
    deck: { cards },
  } = await getUserByUid({ uid });
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
