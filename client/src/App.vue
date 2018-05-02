<template>
  <v-app>
    <nav-bar></nav-bar>
    <div id="app">
      <transition name="slide" mode="out-in">
        <router-view :key="$route.path" />
      </transition>
    </div>
  </v-app>
</template>

<script>
import axiosBase from '@/utils/requestBase';

import NavBar from '@/components/NavBar';

export default {
  name: 'App',
  components: {
    NavBar
  },
  methods: {
    // .then not needed because we only care if there is an error during authentication
    validateAuthToken() {
      axiosBase.get('/api/auth/validate-token').catch(() => {
        window.localStorage.removeItem('authorization');
        this.$router.push({ path: '/login' });
      });
    }
  },
  created() {
    this.validateAuthToken();
  }
};
</script>

<style>
.slide-enter-active {
  animation: slide-in 200ms ease-out forwards;
}
.slide-leave-active {
  animation: slide-out 200ms ease-out forwards;
}
@keyframes slide-in {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes slide-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-30px);
    opacity: 0;
  }
}
</style>
