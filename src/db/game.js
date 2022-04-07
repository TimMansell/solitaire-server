import { initCards } from '#@/services/solitaire';
import { createISODate } from '#@/helpers/dates';
import 'dotenv/config';

export const getDeck = ({ db, uid }) =>
  db.collection('decks').findOne({ uid }, { projection: { _id: 0 } });

export const newDeck = async ({ db, uid }) => {
  const date = createISODate();
  const cards = initCards();

  const { value } = await db.collection('decks').findOneAndUpdate(
    { uid },
    { $set: { cards, date } },
    {
      projection: { _id: 0 },
      upsert: true,
      returnDocument: 'after',
    }
  );

  return value;
};

export const saveNewGame = ({ db, uid }, game) => {
  const date = createISODate();

  db.collection('games').insertOne({
    date,
    uid,
    ...game,
  });
};
