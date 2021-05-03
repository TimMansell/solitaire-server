import db from '@/services/db';

const actions = {
  async initApp({ dispatch }) {
    dispatch('initGame');

    dispatch('checkAppVersion');
    await dispatch('initServerUser');

    dispatch('getStatsCount');
  },
  restartApp({ dispatch, commit }, isCompleted) {
    if (!isCompleted) {
      dispatch('setGameQuit');
    }

    dispatch('restartGame');

    commit('RESTART_APP');
  },
  async checkAppVersion({ commit, state }) {
    const { version } = state;

    const {
      error,
      response: {
        version: { number },
      },
    } = await db.getAppVersion();

    if (!error) {
      const versionMatch = version === number;

      commit('SET_VERSION_MATCH', versionMatch);
    }
  },
  setGameState({ commit, dispatch }, hasWon) {
    if (hasWon) {
      dispatch('setGameWon');
    } else {
      dispatch('setGameLost');
    }

    commit('SET_GAME_WON', hasWon);
    commit('SET_GAME_LOST', !hasWon);
  },
  setGameWon({ dispatch, state, rootState }) {
    const { luid } = rootState.user;
    const { game } = state;

    db.gameWon({ luid, ...game });

    dispatch('setUserHasPlayed');
  },
  setGameLost({ dispatch, state, rootState }) {
    const { luid } = rootState.user;
    const { game } = state;

    db.gameLost({ luid, ...game });

    dispatch('setUserHasPlayed');
  },
  setGameQuit({ dispatch, state, rootState }) {
    const { luid } = rootState.user;
    const { game } = state;

    db.gameQuit({ luid, ...game });

    dispatch('setUserHasPlayed');
  },
  setGameInactive({ commit }) {
    const isGamePaused = {
      isPaused: true,
      isActive: false,
    };

    commit('SET_GAME_PAUSED', isGamePaused);
  },
  toggleGamePaused({ commit, state }) {
    const { isPaused } = state.isGamePaused;

    const isGamePaused = {
      isPaused: !isPaused,
      isActive: true,
    };

    commit('SET_GAME_PAUSED', isGamePaused);
  },
  setTimerPaused({ commit }, isPaused) {
    commit('SET_TIMER_PAUSED', isPaused);
  },
  updateTimer({ commit }) {
    commit('UPDATE_GAME_TIME');
  },
  toggleRules({ commit, state }) {
    const showRules = !state.showRules;

    commit('SHOW_RULES', showRules);
  },
  toggleNewGame({ commit, state }) {
    const showNewGame = !state.showNewGame;

    commit('SHOW_NEW_GAME', showNewGame);
  },
  incrementMoves({ commit }) {
    commit('INCREMENT_MOVES');
  },
};

export default actions;
