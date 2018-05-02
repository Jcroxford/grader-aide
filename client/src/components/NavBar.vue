<template>
  <div  class="nav-bottom-offest">
    <v-toolbar dark color="green" absolute>
      <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
      <v-toolbar-title class="clickable" @click="navigateHome">Grader-Aide</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat @click="navigateHome" v-if="isAdmin">All Courses</v-btn>
        <v-btn flat @click="navigateStudentHome" v-if="isStudent">View My Courses</v-btn>
        <v-btn flat v-if="isAuthenticated" @click="destrouAuthToken">Logout</v-btn>
        <v-btn flat v-else>Login</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import { getUserAuthType } from '@/utils/checkAuth';

export default {
  data() {
    return {
      authType: ''
    };
  },
  methods: {
    // best solution to for checking tkn auth for the navbar without using vuex or some other state
    configAuthTypeForNav() {
      const type = getUserAuthType();

      this.authType = type;
    },
    destrouAuthToken() {
      window.localStorage.removeItem('authorization');
      this.$router.push({ path: '/login' });
    },
    navigateHome() {
      this.$router.push({ path: '/' });
    },
    navigateStudentHome() {
      this.$router.push({ path: '/student' });
    }
  },
  computed: {
    isAuthenticated() {
      return this.isAdmin || this.isStudent;
    },
    isAdmin() {
      return this.authType === 'admin';
    },
    isStudent() {
      return this.authType === 'student';
    }
  },
  watch: {
    $route() {
      this.configAuthTypeForNav();
    }
  },
  created() {
    this.configAuthTypeForNav();
  }
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
}

.nav-bottom-offest {
  margin-bottom: 25px;
}
</style>
