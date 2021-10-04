import { emitSocket, onSocket } from '@/services/websockets';
import { getStats, getLeaderboards } from '@/services/db';

const actions = {
  initStats({ commit, rootState }) {
    const { luid } = rootState.user;

    emitSocket('initCounts', luid);

    onSocket('getUserGameCount', (userStats) => {
      commit('SET_USER_GAME_COUNT', userStats);
    });

    onSocket('getGlobalCounts', (globalStats) => {
      commit('SET_GLOBAL_GAME_COUNT', globalStats);
      commit('SET_GLOBAL_PLAYER_COUNT', globalStats);
    });
  },
  async getStats({ commit, rootState }) {
    const { luid } = rootState.user;
    const { userStats, globalStats } = await getStats(luid);

    commit('SET_USER_STATS', userStats);
    commit('SET_GLOBAL_STATS', globalStats);
    commit('SET_GLOBAL_GAME_COUNT', globalStats);
  },
  clearStats({ commit }) {
    commit('CLEAR_STATS');
  },
  async getLeaderboards({ commit }, params) {
    commit('SET_LEADERBOARDS', []);

    const leaderboards = await getLeaderboards(params);

    commit('SET_LEADERBOARDS', leaderboards);
  },
};

export default actions;
