<template>
  <div class="playground">
    <div class="battle-ground">
      <div class="start-view" @click="toggleStart" v-if="!isStarted">
        Start
      </div>
      <div class="battle-ground__player" v-show="player.figureType && isStarted">
        <item
          class="battle-ground__item"
          :figure="player.figureType"
          :weight="player.figureWeight"
          :style="playerPosition"
        />
      </div>
      <div class="battle-ground__computer" v-show="computer.figureType && isStarted">
        <item
          class="battle-ground__item"
          :figure="computer.figureType"
          :weight="computer.figureWeight"
          :style="computerPosition"/>
      </div>
    </div>
    <libra :rotate="rotate" :history-items="historyItems"/>
    <div>
      <p>
        <button @click="toggleStart">Space</button>
        - start/stop the game
      </p>
      <p>
        <button @click="newGame">Enter</button>
        - new game
      </p>
      <p>
        <button @click="moveLeft">Left</button>
        /
        <button @click="moveRight">Right</button>
        - moving item
      </p>
    </div>
  </div>
</template>

<script>
import {
  mapActions, mapState, mapGetters,
} from 'vuex';
import Item from './Item.vue';
import Libra from './Libra.vue';

export default {
  name: 'Playground',
  components: {
    Libra,
    Item,
  },
  computed: {
    playerPosition() {
      return {
        left: `${this.player.position * 40}px`,
        top: `${this.level * 40}px`,
      };
    },
    computerPosition() {
      return {
        left: `${this.computer.position * 40}px`,
        top: `${this.level * 40}px`,
      };
    },
    ...mapState({
      player: state => state.battleGround.player,
      computer: state => state.battleGround.computer,
      level: state => state.battleGround.level,
      historyItems: state => state.battleGround.history,
      isStarted: state => !!state.timeoutId,
    }),
    ...mapGetters({
      rotate: 'rotate',
    }),
  },
  created() {
    document.addEventListener('keydown', (event) => {
      // eslint-disable-next-line default-case
      switch (event.code) {
        case 'ArrowLeft':
          this.moveLeft();
          break;
        case 'ArrowRight':
          this.moveRight();
          break;
        case 'Space':
          this.toggleStart();
          break;
        case 'ArrowDown':
          this.start();
          break;
        case 'Enter':
          this.newGame();
          break;
      }
    });
  },
  methods: {
    toggleStart() {
      if (this.isStarted) {
        this.stop();
      } else {
        this.start();
      }
    },
    ...mapActions(['moveLeft', 'moveRight', 'nextStep', 'start', 'stop', 'newGame']),
  },
};
</script>

<style scoped lang="scss">
  .playground {
    margin: 1rem 0;
  }

  .battle-ground {
    position: relative;
    height: 320px;
    border-bottom: 1px solid red;
    background: linear-gradient(#bbb, transparent 1px),
    linear-gradient(90deg, #bbb, transparent 1px);
    background-size: 40px 40px;

    .battle-ground__item {
      position: absolute;
    }

    .battle-ground__player {
      position: absolute;
      width: 50%;
      height: 100%;
    }

    .battle-ground__computer {
      position: absolute;
      width: 50%;
      height: 100%;
      left: 50%;
    }
  }

  .start-view {
    height: 100%;
    background: #ffffffaa;
    padding: 3rem;
    box-sizing: border-box;
    text-align: center;
    font-size: 2rem;
    cursor: pointer;
  }
</style>
