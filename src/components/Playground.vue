<template>
  <div class="playground">
    <div class="battle-ground"></div>
    <div class="libra-arm">
      test
    </div>
    <div class="libra-base">
      <div class="libra-base__description">test</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Playground',
  props: {
    msg: String,
  },
};
</script>

<style scoped lang="scss">
  .playground {
    margin: 1rem 0;
  }

  .battle-ground {
    color: red;
    height: 300px;
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
</style>
