<template>
    <div>
        <v-toolbar dark color="green" absolute="true">
        <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
        <v-toolbar-title class="clickable">Grader-Aide</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat>View Submissions</v-btn>
          <v-btn flat>Login</v-btn>
        </v-toolbar-items>
    </v-toolbar>
    </div>
</template>


<script>
export default {
  data() {
    return {
      isLoggedIn: false
    };
  },
  methods: {},
  computed: {},
  created() {},
  components: {}
};
</script>

<style>
.clickable {
  cursor: pointer;
}
</style>
