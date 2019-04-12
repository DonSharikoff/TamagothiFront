export const state = () => ({
  token: {
    token_type: '',
    expires_in: '',
    access_token: '',
    refresh_token: ''
  }
});

export const getters = {
  token(state) {
    return state.token;
  }
};

export const actions = {
  setToken: ({commit}, data) => {
    commit('SET_TOKEN', data);
  },
  async login({ dispatch, commit}, {username, password}) {
    try {
      const token = await this.$axios.post('http://tamagotchi/api/login', {username, password});
      dispatch('setToken', token.data);
    } catch (e) {
      dispatch('application/setError', e.response.data, {root:true});
    }
  },

  async register({ dispatch, commit}, data) {
    try {
      const token = await this.$axios.post('http://tamagotchi/api/v1/registration', data);
      dispatch('setToken', token.data);
    } catch (e) {
      dispatch('application/setError', e.response.data.message, {root:true});
    }
  },
};

export const mutations = {
  'SET_TOKEN'(state, token) {
    state.token = token;
  },
};
