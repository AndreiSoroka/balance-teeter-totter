<template>
  <div id="app">
    <header>
      <h2>Balance teeter-totter</h2>
    </header>
    <div class="wrapper">
      <Playground/>
    </div>
    <footer>
      <div class="wrapper">
        Github:
        <a href="https://github.com/AndreiSoroka/balance-teeter-totter"
           target="_blank"
           rel="nofollow noopener">
          AndreiSoroka/balance-teeter-totter
        </a>
      </div>
    </footer>
  </div>
</template>

<script>
import Playground from './components/Playground.vue';

export default {
  name: 'app',
  components: {
    Playground,
  },
};
</script>

<style lang="scss">
  @import "~normalize.css";

  body {
    background: #efefef;
    min-width: 720px;
  }

  a {
    color: #42b983;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .wrapper {
    max-width: 721px;
    margin: 0 auto;
  }

  header {
    text-align: center;
    padding: 10px;
  }

  footer {
    margin: 2rem 0 0;
    padding: 10px;
  }

  button {
    cursor: pointer;
    background: white;
    padding: 5px;
    color: #2c3e50;
    border: 1px solid #9a9eb0;
    border-radius: 3px;
  }
</style>
