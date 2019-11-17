import Vue from 'vue';
import Vuex from 'vuex';
import * as consts from '../constsItems';

const MAP_SIZE = 8;
const MAP_LEVELS = 7;
const ITEMS_ARRAY = [consts.SQUARE, consts.CIRCLE, consts.TRIANGLE];

function getRandomItem() {
  return ITEMS_ARRAY[Math.floor(Math.random() * ITEMS_ARRAY.length)];
}

Vue.use(Vuex);

const templateBattleGround = () => ({
  figureType: null,
  figureWeight: null,
  position: 4,
});

export default new Vuex.Store({
  state: {
    timeoutId: null,
    battleGround: {
      level: 0,
      count: 0,
      player: templateBattleGround(),
      computer: templateBattleGround(),
      history: {
        player: {
          power: 0,
          items: [],
        },
        computer: {
          power: 0,
          items: [],
        },
      },
    },
  },
  mutations: {
    SET_TIMEOUT(state, value) {
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
      state.timeoutId = value;
    },
    NEW_GAME(state) {
      state.battleGround.player = templateBattleGround();
      state.battleGround.computer = templateBattleGround();
      state.battleGround.history.player = {
        power: 0,
        items: [],
      };
      state.battleGround.history.computer = {
        power: 0,
        items: [],
      };
    },
    NEW_FIGURE(state) {
      state.battleGround.level = 0;
      state.battleGround.player.figureType = getRandomItem();
      state.battleGround.player.figureWeight = Math.floor(Math.random() * 9) + 1;
      state.battleGround.player.position = 4;
      state.battleGround.computer.figureType = getRandomItem();
      state.battleGround.computer.figureWeight = Math.floor(Math.random() * 9) + 1;
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
    SAVE_HISTORY(state) {
      const { player, computer, history } = state.battleGround;
      history.player.power += (MAP_SIZE - player.position + 1) * player.figureWeight;
      history.player.items.push({ ...player });
      history.computer.power += (computer.position + 1) * computer.figureWeight;
      history.computer.items.push({ ...computer });
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
        commit('SAVE_HISTORY');
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
    stop({ commit }) {
      commit('SET_TIMEOUT', null);
    },
  },
  getters: {
    speedGame() {
      return 1000;
    },
    rotate(state) {
      const { player, computer } = state.battleGround.history;

      if (player.power === computer.power) return 0;

      const moreOnPlayer = player.power > computer.power;

      const difference = Math.abs(player.power - computer.power);
      if (difference > consts.MAX_POWER) {
        return moreOnPlayer ? -consts.MAX_ANGLE - 1 : consts.MAX_ANGLE + 1;
      }

      return consts.MAX_ANGLE / consts.MAX_POWER * difference * (moreOnPlayer ? 1 : -1);
    },
  },
});
