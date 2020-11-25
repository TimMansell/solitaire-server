import db from '@/services/db';

const actions = {
  async getGlobalStatsCount({ commit }) {
    const { error, response } = await db.getGlobalStatsCount();

    if (!error) {
      commit('SET_GLOBAL_STATS', { ...response });
    }
  },
  async getGlobalStats({ commit }) {
    const { error, response } = await db.getGlobalStats();

    if (!error) {
      commit('SET_FULL_STATS', { ...response });
      commit('SET_GLOBAL_STATS', { ...response });
    }
  },
  async getUserStatsCount({ commit, rootState }) {
    const { suid } = rootState.user;
    const { error, response } = await db.getUserStatsCount(suid);

    if (!error) {
      commit('SET_USER_STATS', { ...response });
    }
  },
  async getUserStats({ commit, rootState }) {
    const { suid } = rootState.user;
    const { error, response } = await db.getUserStats(suid);

    if (!error) {
      commit('SET_FULL_STATS', { ...response });
      commit('SET_USER_STATS', { ...response });
    }
  },
  toggleStats({ commit, state }) {
    const showStats = !state.showStats;

    commit('SHOW_STATS', showStats);
  },
};

export default actions;