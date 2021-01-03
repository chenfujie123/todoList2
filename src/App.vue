<template>
  <div id="app">
    <head-for-md></head-for-md>
  </div>
</template>

<script>
import HeadForMd from "./components/HeadForMd";
export default {
  name: 'App',
  components: {
    HeadForMd
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
