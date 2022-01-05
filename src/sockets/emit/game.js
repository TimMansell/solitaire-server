import { newDeck } from '@/db/game';

// eslint-disable-next-line import/prefer-default-export
export const emitNewGame = async ({ socket, db, uid }) => {
  const isMocked = process.env.NODE_ENV === 'test';

  try {
    const cards = await newDeck(db, uid, isMocked);

    socket.emit('newGame', cards);
  } catch (error) {
    console.log({ error });
  }
};
