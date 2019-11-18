import Vue from 'vue';
import Vuex from 'vuex';
import * as consts from '../constsItems';

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
      state.battleGround.count = 0;
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
      state.battleGround.computer.position = 4;
      state.battleGround.computer.figureWeight = Math.floor(Math.random() * 9) + 1;

      const isFriendly = state.battleGround.count < 18 && Math.round(Math.random());
      if (isFriendly) {
        state.battleGround.computer.figureWeight = Math.floor(
          (state.battleGround.computer.figureWeight
            + state.battleGround.player.figureWeight) / 2,
        );
      }
    },
    INCREASE_LEVEL(state) {
      state.battleGround.level += 1;
    },
    INCREASE_COUNT(state) {
      state.battleGround.count += 1;
    },
    PLAYER_MOVE_LEFT(state) {
      state.battleGround.player.position -= 1;
      if (state.battleGround.player.position < 0) {
        state.battleGround.player.position = 0;
      }
    },
    PLAYER_MOVE_RIGHT(state) {
      state.battleGround.player.position += 1;
      if (state.battleGround.player.position > consts.MAP_SIZE) {
        state.battleGround.player.position = consts.MAP_SIZE;
      }
    },
    COMPUTER_MOVE(state) {
      // todo add AI
      const computerStep = Math.floor(Math.random() * 3) - 1;
      state.battleGround.computer.position += computerStep;
      if (state.battleGround.computer.position < 0) {
        state.battleGround.computer.position = 0;
      } else if (state.battleGround.computer.position > consts.MAP_SIZE) {
        state.battleGround.computer.position = consts.MAP_SIZE;
      }
    },
    SAVE_HISTORY(state) {
      const { player, computer, history } = state.battleGround;
      history.player.power += (consts.MAP_SIZE - player.position + 1) * player.figureWeight;
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
    nextStep({ state, commit }) {
      if (!state.timeoutId) {
        return;
      }
      if (state.battleGround.level >= consts.MAP_LEVELS) {
        commit('SAVE_HISTORY');
        commit('INCREASE_COUNT');
        commit('NEW_FIGURE');
      } else {
        if (state.battleGround.count) {
          commit('INCREASE_LEVEL');
        }
        commit('COMPUTER_MOVE');
        commit('INCREASE_COUNT');
      }
    },
    start({ commit, dispatch, getters }) {
      const timeout = setTimeout(() => {
        dispatch('start');
      }, getters.speedGame);
      commit('SET_TIMEOUT', timeout);
      dispatch('nextStep');
    },
    stop({ commit }) {
      commit('SET_TIMEOUT', null);
    },
  },
  getters: {
    speedGame(state) {
      const speed = 1000 - state.battleGround.count * 10;
      return speed > 100 ? speed : 100;
    },
    rotate(state) {
      // If I understand task
      const { player, computer } = state.battleGround.history;

      if (player.power === computer.power) return 0;

      const moreOnPlayer = player.power > computer.power;

      const difference = Math.abs(player.power - computer.power);
      if (difference > consts.MAX_POWER) {
        return moreOnPlayer ? -consts.MAX_ANGLE - 1 : consts.MAX_ANGLE + 1;
      }

      return consts.MAX_ANGLE / consts.MAX_POWER * difference * (moreOnPlayer ? -1 : 1);
    },
    scoreGame(state) {
      return Math.floor((state.battleGround.count - 1) / (consts.MAP_LEVELS + 1));
    },
    mapItems(state) {
      const playerItems = state.battleGround.history.player.items;
      const computerItems = state.battleGround.history.computer.items;

      if (!playerItems.length || !computerItems.length) {
        return [];
      }

      const mapItems = (new Array((consts.MAP_SIZE + 1) * 2))
        .fill(0)
        .map(() => ([]));

      // eslint-disable-next-line no-restricted-syntax
      for (const item of playerItems) {
        const currentPosition = mapItems[item.position];
        currentPosition.push({
          ...item,
          top: (currentPosition.length + 1) * -consts.ITEM_SIZE,
        });
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const item of computerItems) {
        const currentPosition = mapItems[consts.MAP_SIZE + 1 + item.position];
        currentPosition.push({
          ...item,
          top: (currentPosition.length + 1) * -consts.ITEM_SIZE,
        });
      }

      return mapItems;
    },
  },
});
