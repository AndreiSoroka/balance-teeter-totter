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
          :weight="player.figureSize"
          :style="playerPosition"
        />
      </div>
      <div class="battle-ground__computer" v-show="computer.figureType && isStarted">
        <item
          class="battle-ground__item"
          :figure="computer.figureType"
          :weight="computer.figureSize"
          :style="computerPosition"/>
      </div>
    </div>
    <div class="libra-arm">
      test
    </div>
    <div class="libra-base">
      <div class="libra-base__description">test</div>
    </div>

    <div>
      <p>
        <button @click="toggleStart">Space</button>
        - start/stop the game
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

export default {
  name: 'Playground',
  components: { Item },
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
      isStarted: state => !!state.timeoutId,
    }),
    ...mapGetters([
      'speedGame',
    ]),
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
    ...mapActions(['moveLeft', 'moveRight', 'nextStep', 'start', 'stop']),
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
    margin-bottom: 50px;
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

  .libra-arm {

    &::after {
      content: "";
      display: block;
      height: 10px;
      background: #2c3e50;
    }
  }

  .libra-base {
    width: 0;
    height: 0;
    border: 50px solid transparent;
    border-bottom: 100px solid #2c3e50;
    margin: -50px auto 0;

    .libra-base__description {
      width: 100px;
      margin: 75px 0 0 -50px;
      color: white;
      text-align: center;
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
