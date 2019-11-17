<template>
  <div class="playground">
    <div class="battle-ground" :style="battleGroundStyle">
      <div class="start-view" v-if="!isStarted">
        <div v-if="isLose">
          <h3 class="title">Score Game: {{ scoreGame }} Level</h3>
          <p>
            <a :href="twitterLink"
               v-if="twitterLink"
               class="twitter"
               target="_blank"
               rel="nofollow noopener">
              Tweet
            </a>
          </p>
          <button @click="startNewGame" class="success">New game</button>
        </div>
        <div v-else>
          <button
            v-if="isInitialGame"
            @click="startNewGame"
            class="success">
            New game
          </button>
          <button
            v-else
            @click="start"
            class="success">
            Continue
          </button>
        </div>
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
    <libra
      :rotate="rotate"
      :map-items="mapItems"
      :score-game="scoreGame"
      :is-show="isLose"/>
    <div>
      <p>
        <button @click="toggleStart">Space</button>
        - start/stop the game
      </p>
      <p>
        <button @click="startNewGame">Enter</button>
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
import shareTwitter from 'share-twitter';
import {
  mapActions, mapState, mapGetters,
} from 'vuex';
import { ITEM_SIZE, MAX_ANGLE } from '../constsItems';
import Item from './Item.vue';
import Libra from './Libra.vue';

export default {
  name: 'Playground',
  data() {
    return {
      twitterLink: '',
      isInitialGame: true,
      isLose: false,
    };
  },
  components: {
    Libra,
    Item,
  },
  computed: {
    playerPosition() {
      return {
        left: `${this.player.position * ITEM_SIZE}px`,
        top: `${this.level * ITEM_SIZE}px`,
      };
    },
    computerPosition() {
      return {
        left: `${this.computer.position * ITEM_SIZE}px`,
        top: `${this.level * ITEM_SIZE}px`,
      };
    },
    battleGroundStyle() {
      return {
        'background-size': `${ITEM_SIZE}px ${ITEM_SIZE}px`,
      };
    },
    ...mapState({
      player: state => state.battleGround.player,
      computer: state => state.battleGround.computer,
      level: state => state.battleGround.level,
      isStarted: state => !!state.timeoutId,
    }),
    ...mapGetters({
      rotate: 'rotate',
      mapItems: 'mapItems',
      scoreGame: 'scoreGame',
    }),
  },
  created() {
    document.addEventListener('keydown', (event) => {
      if (this.isLose || this.isInitialGame) {
        // eslint-disable-next-line default-case
        switch (event.code) {
          case 'Space':
          case 'Enter':
            this.startNewGame();
            break;
        }
        return;
      }
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
          this.startNewGame();
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
    startNewGame() {
      this.twitterLink = '';
      this.isLose = false;
      this.isInitialGame = false;
      this.newGame();
      this.start();
    },
    ...mapActions(['moveLeft', 'moveRight', 'start', 'stop', 'newGame']),
  },
  watch: {
    rotate(value) {
      if (value > MAX_ANGLE || value < -MAX_ANGLE) {
        this.isLose = true;
        this.twitterLink = shareTwitter({
          text: `WOW! My Score Game: ${this.scoreGame} Level!`,
          url: 'https://vue-balance-teeter-totter.herokuapp.com/',
        });
        this.stop();
      }
    },
  },
};
</script>

<style scoped lang="scss">
  .playground {
    margin: 1rem 0;
  }

  .title {
    margin: 0;
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
  }

  .twitter {
    display: inline-block;
    color: #fff;
    background-color: #1da1f2;
    border: 1px solid #1da1f2;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
    text-decoration: none;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 16px;
    // animation
    // http://elrumordelaluz.github.io/csshake/
    animation-name: shake;
    animation-duration: 100ms;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;

    &:hover {
      animation: none;
    }
  }

  @keyframes shake {
    2% {
      transform: translate(1.5px, 1.5px) rotate(1.5deg)
    }
    4% {
      transform: translate(.5px, -.5px) rotate(.5deg)
    }
    6% {
      transform: translate(1.5px, 2.5px) rotate(1.5deg)
    }
    8% {
      transform: translate(.5px, 2.5px) rotate(.5deg)
    }
    10% {
      transform: translate(2.5px, 1.5px) rotate(.5deg)
    }
    12% {
      transform: translate(-.5px, -1.5px) rotate(-.5deg)
    }
    14% {
      transform: translate(1.5px, 2.5px) rotate(-.5deg)
    }
    16% {
      transform: translate(2.5px, -1.5px) rotate(1.5deg)
    }
    18% {
      transform: translate(2.5px, 2.5px) rotate(-.5deg)
    }
    20% {
      transform: translate(-.5px, -1.5px) rotate(1.5deg)
    }
    22% {
      transform: translate(-1.5px, -.5px) rotate(.5deg)
    }
    24% {
      transform: translate(2.5px, -1.5px) rotate(1.5deg)
    }
    26% {
      transform: translate(.5px, 2.5px) rotate(1.5deg)
    }
    28% {
      transform: translate(-.5px, 2.5px) rotate(-.5deg)
    }
    30% {
      transform: translate(.5px, 2.5px) rotate(1.5deg)
    }
    32% {
      transform: translate(-1.5px, -.5px) rotate(-.5deg)
    }
    34% {
      transform: translate(.5px, -.5px) rotate(.5deg)
    }
    36% {
      transform: translate(-1.5px, .5px) rotate(1.5deg)
    }
    38% {
      transform: translate(-1.5px, 1.5px) rotate(1.5deg)
    }
    40% {
      transform: translate(2.5px, .5px) rotate(.5deg)
    }
    42% {
      transform: translate(.5px, .5px) rotate(1.5deg)
    }
    44% {
      transform: translate(-.5px, .5px) rotate(.5deg)
    }
    46% {
      transform: translate(2.5px, 1.5px) rotate(1.5deg)
    }
    48% {
      transform: translate(2.5px, 1.5px) rotate(-.5deg)
    }
    50% {
      transform: translate(-1.5px, 2.5px) rotate(-.5deg)
    }
    52% {
      transform: translate(.5px, -1.5px) rotate(1.5deg)
    }
    54% {
      transform: translate(.5px, -1.5px) rotate(.5deg)
    }
    56% {
      transform: translate(1.5px, -1.5px) rotate(-.5deg)
    }
    58% {
      transform: translate(1.5px, .5px) rotate(.5deg)
    }
    60% {
      transform: translate(-.5px, .5px) rotate(.5deg)
    }
    62% {
      transform: translate(.5px, .5px) rotate(-.5deg)
    }
    64% {
      transform: translate(-1.5px, -.5px) rotate(1.5deg)
    }
    66% {
      transform: translate(-1.5px, 2.5px) rotate(-.5deg)
    }
    68% {
      transform: translate(-1.5px, 1.5px) rotate(.5deg)
    }
    70% {
      transform: translate(.5px, 1.5px) rotate(.5deg)
    }
    72% {
      transform: translate(-1.5px, 2.5px) rotate(.5deg)
    }
    74% {
      transform: translate(2.5px, .5px) rotate(-.5deg)
    }
    76% {
      transform: translate(.5px, -1.5px) rotate(1.5deg)
    }
    78% {
      transform: translate(.5px, 1.5px) rotate(.5deg)
    }
    80% {
      transform: translate(-.5px, -.5px) rotate(.5deg)
    }
    82% {
      transform: translate(1.5px, 1.5px) rotate(1.5deg)
    }
    84% {
      transform: translate(.5px, .5px) rotate(.5deg)
    }
    86% {
      transform: translate(-.5px, .5px) rotate(1.5deg)
    }
    88% {
      transform: translate(1.5px, .5px) rotate(1.5deg)
    }
    90% {
      transform: translate(-.5px, 2.5px) rotate(-.5deg)
    }
    92% {
      transform: translate(-1.5px, -1.5px) rotate(1.5deg)
    }
    94% {
      transform: translate(-1.5px, 2.5px) rotate(1.5deg)
    }
    96% {
      transform: translate(-1.5px, -1.5px) rotate(1.5deg)
    }
    98% {
      transform: translate(1.5px, -1.5px) rotate(1.5deg)
    }
    0%, 100% {
      transform: translate(0, 0) rotate(0)
    }
  }
</style>
