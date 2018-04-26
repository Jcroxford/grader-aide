<template>
  <div class="main-background">
    <div v-if="assignmentsExist" class="nav-offset container width-restrictor">
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex xs10 offset-xs1 v-for="assignment of assignments" :key="assignment._id">
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
                  offset-xs8
                  align-content-space-between
                  >
                  <v-btn
                    flat
                    color="green"
                    @click="navigateToAssignment(assignment._id)"
                  >
                    view Assignment
                  </v-btn>
                  <v-btn
                    flat
                    color="red"
                    @click="deleteAssignment(assignment._id)"
                  >
                    Delete
                  </v-btn>
                </v-flex>
              </v-card-title>
              <!-- <v-card-actions>
              </v-card-actions> -->
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <v-snackbar
        :timeout="timeout"
        bottom
        v-model="snackbar"
      >
        {{ deletedAssignment }}
      <v-btn color="yellow" dark flat @click.native="snackbar = false">Undo</v-btn>
      </v-snackbar>
    </div>
    <div v-if="!assignmentsExist">
      <h1 class="no-assignments display-1">No assignments exist for this course.
        <br> Please create one by clicking the button below.</h1>
    </div>
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
import * as assignmentApi from '@/apis/assignment-api';

export default {
  data() {
    return {
      assignments: [],
      snackbar: false,
      timeout: 5000,
      deletedAssignment: '',
      deletionStack: [],
      assignmentsExist: true
    };
  },
  methods: {
    navigateToAssignment(id) {
      this.$router.push(`/grade-assignment/${id}`);
    },
    deleteAssignment(id) {
      this.deletionStack.push(id);
      this.deletedAssignment = 'Deleted assignment.';
      this.snackbar = true;
    },
    createAssignment() {
      this.$router.push('/create-assignment/');
    }
  },
  created() {
    const self = this;
    assignmentApi.getAssignments(assignments => {
      if (assignments.length === 0) self.assignmentsExist = false;
      self.assignments = assignments;
    });
  }
};
</script>

<style scoped>
.main-background {
  /* background: linear-gradient(rgb(76, 175, 80) 50%, rgb(248, 250, 248) 0%); */
  background-color: rgb(245, 250, 245);
  position: fixed;
  background-attachment: fixed;
  width: 100%;
  height: 90vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: min-content;
  position: relative;
}
.nav-offset {
  margin-top: 75px;
}

.width-restrictor {
  max-width: 75%;
}

.assn-card-text {
  /* padding-left: 15px; */
}

.fab-button {
  margin-right: 35px;
  margin-bottom: 35px;
}

.no-assignments {
  text-align: center;
  margin-top: 40vh;
}
</style>
