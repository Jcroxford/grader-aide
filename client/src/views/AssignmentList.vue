<template>
  <div class="nav-offset container width-restrictor">
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 v-for="assignment of assignments" :key="assignment._id">
          <v-card>
            <v-card-title>
              <v-flex xs12>
                <span class="display-1">{{ assignment.assignmentName }}</span>
                  </v-flex>

                <v-flex
                xs4
                >
                  <div class="assn-card-text">
                    Total points: 69
                  </div>
                </v-flex>
                <v-flex
                xs4
                >
                  <div class="assn-card-text">
                    Class Average: 69%
                  </div>
                </v-flex>
                <v-flex
                xs4
                >
                  <div class="assn-card-text">
                    Due Date: 6/9/1969
                  </div>
                </v-flex>

                <v-flex
                offset-xs9
                align-content-space-between
                >
                <v-btn
                  flat
                  color="green"
                  @click="navigateToAssignment(assignment._id)"
                >
                  view Assignment
                </v-btn>
              </v-flex>
            </v-card-title>
            <!-- <v-card-actions>
            </v-card-actions> -->
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-tooltip left>
        <v-btn
          fab
          bottom
          light
          right
          color="green"
          fixed
          slot="activator"
          class="fab-button"
          @click="createAssignment"
        >
          <v-icon color="white">add</v-icon>
        </v-btn>
      <span>Create assignment</span>
    </v-tooltip>
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
    },
    createAssignment() {
      this.$router.push('/grade-assignment/new');
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

.width-restrictor {
  max-width: 75%;
}

.fab-button {
  margin-right: 35px;
  margin-bottom: 35px;
}
</style>
