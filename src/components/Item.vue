<template>
  <div class="item" :class="[figure]" :style="style">
    <div class="item__description">
      {{ weight }}
    </div>
  </div>
</template>

<script>
import * as items from '../constsItems';

export default {
  name: 'Item',
  props: {
    figure: {
      type: String,
      default: items.SQUARE,
    },
    weight: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    scale() {
      return (50 + 5 * this.weight) / 100;
    },
    style() {
      return {
        transform: `scale(${this.scale})`,
      };
    },
  },
};
</script>

<style scoped lang="scss">
  .item {
    position: relative;
    text-align: center;
    width: 40px;
    height: 40px;
    color: white;

    &:before {
      content: "";
      position: absolute;
      display: block;
      background: #9a9eb0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }

    &.square:before {
    }

    &.circle:before {
      border-radius: 50%;
    }

    &.triangle:before {
      border: 20px solid transparent;
      border-bottom: 40px solid #9a9eb0;
      width: 0;
      height: 0;
      margin-top: -20px;
      background: none;
    }

    .item__description {
      position: absolute;
      width: 100%;
      font-size: 16px;
      bottom: 1px;
    }
  }
</style>
