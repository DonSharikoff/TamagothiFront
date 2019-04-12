export const state = () => ({
  error: null,
});

export const getters = {
  error(state) {
    return state.error;
  }
};

export const actions = {
  setError: ({commit}, error) => {
    commit('SET_ERROR', error);
  },
};

export const mutations = {
  'SET_ERROR'(state, error) {
    state.error = error;
  },
};
