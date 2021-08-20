import { mockUid, mockHistory, mockPlayerName } from '@/mockData';
import actions from '../actions';

const { initUser, getUser, createUser, getAllGames } = actions;

let commit;

jest.mock('@/services/user');

describe('User Store', () => {
  beforeEach(() => {
    localStorage.clear();

    commit = jest.fn();
  });

  describe('initUser', () => {
    it('should create a new user id', async () => {
      const state = {
        luid: mockUid,
      };

      await initUser({ commit, state });

      expect(commit).toHaveBeenCalledWith('SET_USER_ID', mockUid);
    });

    it('should get user id from local storage', async () => {
      const state = {
        luid: mockUid,
      };

      localStorage.setItem('luid', mockUid);

      await initUser({ commit, state });

      expect(commit).toHaveBeenCalledWith('SET_USER_ID', mockUid);
    });
  });

  describe('getUser', () => {
    it('should return an existing user', async () => {
      const state = {
        luid: mockUid,
      };

      await getUser({ commit, state });

      expect(commit).toHaveBeenCalledWith('SET_USER_NAME', mockPlayerName);
      expect(commit).toHaveBeenCalledWith('SET_USER_EXISTS', true);
    });

    it('should not return an existing user', async () => {
      const state = {
        luid: '123',
      };

      await getUser({ commit, state });

      expect(commit).toHaveBeenCalledWith('SET_USER_NAME', '');
      expect(commit).toHaveBeenCalledWith('SET_USER_EXISTS', false);
    });
  });

  describe('createUser', () => {
    it('should return an existing user name for user who does not have lastest store', async () => {
      const state = {
        luid: mockUid,
        existsOnServer: false,
      };

      await createUser({ commit, state });

      expect(commit).toHaveBeenCalledWith('SET_USER_NAME', mockPlayerName);
    });

    it('should return a new user name', async () => {
      const state = {
        luid: '123',
        existsOnServer: false,
      };

      await createUser({ commit, state });

      expect(commit).toHaveBeenCalledWith('SET_USER_NAME', 'New Player Name');
    });
  });

  describe('getAllGames', () => {
    it('should games', async () => {
      const state = {
        luid: mockUid,
      };

      const params = { offset: 0, limit: 25 };

      await getAllGames({ commit, state }, params);

      expect(commit).toHaveBeenCalledWith('SET_USER_GAMES', mockHistory);
    });
  });
});
