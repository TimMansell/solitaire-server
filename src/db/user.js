import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import shuffle from 'lodash.shuffle';
import { formatTime } from '#@/helpers/times';
import { formatNumber } from '#@/helpers/numbers';
import { gameOutcome } from '#@/helpers/game';

export const createUser = async ({ db, uid }) => {
  const [first, second] = shuffle([adjectives, colors, animals]);

  const name = uniqueNamesGenerator({
    dictionaries: [first, second],
    separator: '',
    style: 'capital',
    length: 2,
  });

  const { value } = await db.collection('users').findOneAndUpdate(
    { uid },
    { $set: { name } },
    {
      projection: { _id: 0, uid: 0 },
      upsert: true,
      returnDocument: 'after',
    }
  );

  return value;
};

export const getUser = ({ db, uid }) =>
  db.collection('users').findOne({ uid }, { projection: { _id: 0, uid: 0 } });

export const getAllUsers = ({ db }) =>
  db
    .collection('users')
    .find({}, { projection: { _id: 0 } })
    .toArray();

export const getUserGames = ({ db, uid, offset, limit }) =>
  db
    .collection('games')
    .aggregate([
      { $match: { uid } },
      {
        $facet: {
          played: [{ $count: 'count' }],
          games: [
            { $sort: { date: -1 } },
            { $skip: offset },
            { $limit: limit },
            { $project: { _id: 0, uid: 0 } },
          ],
        },
      },
      { $unwind: '$played' },
    ])
    .map(({ played: { count }, games }) =>
      games.map(({ date, won, lost, moves, time }, index) => ({
        number: formatNumber(count - offset - index),
        date,
        time: date,
        outcome: gameOutcome({ won, lost }),
        moves,
        duration: formatTime(time),
      }))
    )
    .toArray();
