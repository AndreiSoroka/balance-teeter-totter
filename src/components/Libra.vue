<template>
  <div class="libra" :class="{'libra-show': isShow}">
    <div
      class="libra-arms"
      :style="{transform: `rotate(${rotate/2}deg)`}">
      <div
        v-for="(list, index) in mapItems"
        :key="index"
        :style="{left: `${index*40}px`}"
        class="libra-rows">
        <item
          v-for="(item, index) in list"
          :key="index"
          class="libra__row-item"
          :figure="item.figureType"
          :weight="item.figureWeight"
          :style="{top: `${item.top}px`}"
        />
      </div>
    </div>
    <div class="libra-base">
      <div class="libra-base__description">Level:<br/>{{ scoreGame > 0 ? scoreGame : 0 }}</div>
    </div>
  </div>
</template>

<script>
import Item from './Item.vue';

export default {
  name: 'Libra',
  components: { Item },
  props: {
    rotate: {
      type: Number,
      default: 0,
    },
    mapItems: {
      type: Array,
      require: true,
    },
    scoreGame: {
      type: Number,
      default: 0,
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
  .libra {
    pointer-events: none;
    opacity: 0.3;
    transition: 1s;

    &.libra-show {
      opacity: 0.5;
    }
  }

  .libra-arms {
    transition: 1s;

    &::after {
      content: "";
      display: block;
      height: 10px;
      background: #2c3e50;
    }
  }

  .libra-arm {
    position: absolute;
    width: 50%;

    &.player {
    }

    &.computer {
      left: 50%;
    }
  }

  .libra-rows {
    position: absolute;
  }

  .libra__row-item {
    position: absolute;
  }

  .libra-base {
    width: 0;
    height: 0;
    border: 50px solid transparent;
    border-bottom: 100px solid #2c3e50;
    margin: -50px auto 0;

    .libra-base__description {
      width: 100px;
      margin: 55px 0 0 -50px;
      color: white;
      text-align: center;
    }
  }
</style>
