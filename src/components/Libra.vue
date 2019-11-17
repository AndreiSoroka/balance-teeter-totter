<template>
  <div class="libra">
    <div
      class="libra-arms"
      :style="{transform: `rotate(${rotate/2}deg)`}">
      <div
        v-for="(list, index) in items"
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
      <div class="libra-base__description">{{ ~~(rotate*100)/100 }}</div>
    </div>
  </div>
</template>

<script>
import Item from './Item.vue';

const WIDTH = 40;

export default {
  name: 'Libra',
  components: { Item },
  props: {
    rotate: {
      type: Number,
      default: 0,
    },
    historyItems: {
      type: Object,
      require: true,
    },
  },
  computed: {
    playerItems() {
      return this.historyItems.player.items;
    },
    computerItems() {
      return this.historyItems.computer.items;
    },
    items() {
      const { playerItems, computerItems } = this;
      if (!playerItems.length || !computerItems.length) {
        return [];
      }

      const mapItems = (new Array(18))
        .fill(0)
        .map(() => ([]));

      // eslint-disable-next-line no-restricted-syntax
      for (const item of playerItems) {
        const currentPosition = mapItems[item.position];
        currentPosition.push({
          ...item,
          top: (currentPosition.length + 1) * -WIDTH,
        });
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const item of computerItems) {
        const currentPosition = mapItems[9 + item.position];
        currentPosition.push({
          ...item,
          top: (currentPosition.length + 1) * -WIDTH,
        });
      }

      return mapItems;
    },
  },
};
</script>

<style lang="scss" scoped>
  .libra {
    pointer-events: none;
    opacity: 0.3;
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
      margin: 75px 0 0 -50px;
      color: white;
      text-align: center;
    }
  }
</style>
