<template>
  <v-app>
    <nav-bar></nav-bar>
    <div id="app">
      <router-view/>
    </div>
  </v-app>
</template>

<script>
import NavBar from '@/components/NavBar';

export default {
  name: 'App',
  components: {
    NavBar
  }
};
</script>

<style>
</style>
