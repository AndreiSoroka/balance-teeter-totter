import Vue from 'vue';
import Vuex from 'vuex';
import * as items from '../constsItems';

const MAP_SIZE = 8;
const MAP_LEVELS = 7;
const ITEMS_ARRAY = Object.values(items);

function getRandomItem() {
  return ITEMS_ARRAY[Math.floor(Math.random() * ITEMS_ARRAY.length)];
}

Vue.use(Vuex);

const templateBattleGround = () => ({
  figureType: null,
  figureWeight: null,
  position: 4,
  history: [],
});

export default new Vuex.Store({
  state: {
    timeoutId: null,
    battleGround: {
      level: 0,
      count: 0,
      player: templateBattleGround(),
      computer: templateBattleGround(),
    },
  },
  mutations: {
    SET_TIMEOUT(state, value) {
      state.timeoutId = value;
    },
    NEW_GAME(state) {
      state.battleGround.player = templateBattleGround();
      state.battleGround.computer = templateBattleGround();
    },
    NEW_FIGURE(state) {
      state.battleGround.level = 0;
      state.battleGround.player.figureType = getRandomItem();
      state.battleGround.player.figureSize = Math.floor(Math.random() * 9) + 1;
      state.battleGround.player.level = 0;
      state.battleGround.player.position = 4;
      state.battleGround.computer.figureType = getRandomItem();
      state.battleGround.computer.figureSize = Math.floor(Math.random() * 9) + 1;
      state.battleGround.computer.level = 0;
      state.battleGround.computer.position = 4;
    },
    INCREASE_LEVEL(state) {
      state.battleGround.level += 1;
    },
    PLAYER_MOVE_LEFT(state) {
      state.battleGround.player.position -= 1;
      if (state.battleGround.player.position < 0) {
        state.battleGround.player.position = 0;
      }
    },
    PLAYER_MOVE_RIGHT(state) {
      state.battleGround.player.position += 1;
      if (state.battleGround.player.position > MAP_SIZE) {
        state.battleGround.player.position = MAP_SIZE;
      }
    },
    COMPUTER_MOVE(state) {
      // todo add AI
      const computerStep = Math.floor(Math.random() * 3) - 1;
      state.battleGround.computer.position += computerStep;
      if (state.battleGround.computer.position < 0) {
        state.battleGround.computer.position = 0;
      } else if (state.battleGround.computer.position > MAP_SIZE) {
        state.battleGround.computer.position = MAP_SIZE;
      }
    },
  },
  actions: {
    newGame({ commit }) {
      commit('NEW_GAME');
      commit('NEW_FIGURE');
    },
    moveLeft({ commit, state }) {
      if (!state.timeoutId) {
        return;
      }
      commit('PLAYER_MOVE_LEFT');
    },
    moveRight({ commit, state }) {
      if (!state.timeoutId) {
        return;
      }
      commit('PLAYER_MOVE_RIGHT');
    },
    nextStep({ state, commit, dispatch }) {
      if (!state.timeoutId) {
        return;
      }
      if (!state.battleGround.player.figureType) {
        dispatch('newGame');
      } else if (state.battleGround.level >= MAP_LEVELS) {
        // commit('SAVE_HISTORY');
        commit('NEW_FIGURE');
      } else {
        commit('INCREASE_LEVEL');
        commit('COMPUTER_MOVE');
      }
    },
    start({ commit, dispatch }) {
      const timeout = setTimeout(() => {
        dispatch('start');
      }, 1000);
      commit('SET_TIMEOUT', timeout);
      dispatch('nextStep');
    },
    stop({ state, commit }) {
      clearTimeout(state.timeoutId);
      commit('SET_TIMEOUT', null);
    },
  },
  getters: {
    speedGame() {
      return 1000;
    },
  },
});
