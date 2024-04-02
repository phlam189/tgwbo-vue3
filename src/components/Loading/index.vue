<template>
  <div class="loading" v-if="globalStore.loading">
    <div class="sk-circle">
      <div class="sk-circle1 sk-child"></div>
      <div class="sk-circle2 sk-child"></div>
      <div class="sk-circle3 sk-child"></div>
      <div class="sk-circle4 sk-child"></div>
      <div class="sk-circle5 sk-child"></div>
      <div class="sk-circle6 sk-child"></div>
      <div class="sk-circle7 sk-child"></div>
      <div class="sk-circle8 sk-child"></div>
      <div class="sk-circle9 sk-child"></div>
      <div class="sk-circle10 sk-child"></div>
      <div class="sk-circle11 sk-child"></div>
      <div class="sk-circle12 sk-child"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useGlobalStore } from '../../stores/global-store'
  const globalStore = useGlobalStore()
</script>

<style lang="scss">
  .loading {
    z-index: 99999 !important;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    position: fixed;
    width: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: rgba(0, 0, 0, 0.45);
    height: 100%;
    display: flex;
  }
</style>
