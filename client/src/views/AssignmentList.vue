<template>
  <div class="nav-offset">
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 v-for="assignment of assignments" :key="assignment._id">
          <v-card>
            <v-card-title>
              <span class="display-1">{{ assignment.assignmentName }}</span>
            </v-card-title>
            <v-card-actions>
              <v-btn
                flat
                color="green"
                @click="navigateToAssignment(assignment._id)"
              >
                view Assignment
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import * as assignemntApi from '@/apis/assignment-api';

export default {
  data() {
    return {
      assignments: []
    };
  },
  methods: {
    navigateToAssignment(id) {
      this.$router.push(`/grade-assignment/${id}`);
    }
  },
  created() {
    const self = this;
    assignemntApi.getAssignments(assignments => {
      self.assignments = assignments;
    });
  }
};
</script>

<style scoped>
.nav-offset {
  margin-top: 75px;
}
</style>

