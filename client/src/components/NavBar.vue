<template>
  <div>
    <v-toolbar dark color="green" absolute>
      <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
      <v-toolbar-title class="clickable">Grader-Aide</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>View Submissions</v-btn>
        <v-btn flat>All Assignments</v-btn>
        <v-btn flat v-if="isAuthenticated">Login</v-btn>
        <v-btn flat v-else>Logout</v-btn>
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

<style>
.clickable {
  cursor: pointer;
}
</style>
