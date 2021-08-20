import { mockUid, mockPlayerName } from '@/mockData';
import { newUser, gameWon, gameLost, gameQuit } from '../mutations';

jest.mock('../apollo');

const gameParams = {
  luid: mockUid,
  time: 10,
  moves: 50,
};

describe('DB service mutations', () => {
  it('newUser', async () => {
    const { response } = await newUser(mockUid);
    const { createUser } = response;

    expect(createUser).toEqual({ name: mockPlayerName });
  });

  it('gameWon', async () => {
    const { response } = await gameWon(gameParams);
    const { wonGame } = response;

    expect(wonGame).toEqual({
      outcome: 'Won',
    });
  });

  it('gameLost', async () => {
    const { response } = await gameLost(gameParams);
    const { lostGame } = response;

    expect(lostGame).toEqual({
      outcome: 'Lost',
    });
  });

  it('gameQuit', async () => {
    const { response } = await gameQuit(gameParams);
    const { quitGame } = response;

    expect(quitGame).toEqual({
      outcome: 'Gave Up',
    });
  });
});
