import { db } from './setup';
import { initCards, checkGameState } from '#solitaire';
import { createISODate } from './helpers/dates';
import { getUserByUid } from '#db';
import { isTest } from '#src/main';

export const getUserNewDeck = async ({ uid, mockCards }) => {
  const shouldMockCards = isTest && mockCards;
  const cards = shouldMockCards ? mockCards : initCards();

  const { value } = await db()
    .collection('users')
    .findOneAndUpdate(
      { uid },
      {
        $set: {
          deck: {
            cards,
            date: createISODate(),
          },
        },
      },
      {
        projection: { _id: 0, cards: '$deck.cards' },
        upsert: true,
        returnDocument: 'after',
      }
    );

  return value;
};

export const saveGame = async ({ moves, time, ...params }) => {
  const { uid, cards } = await getUserByUid(params);
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
