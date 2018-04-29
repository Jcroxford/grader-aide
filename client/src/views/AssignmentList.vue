<template>
  <div class="main-background">
    <div v-if="assignmentsExist && loaded" class="nav-offset container width-restrictor">
      <h1 class="display-1 centerize">{{parentCourse.courseName}} assignments</h1>
      <v-container grid-list-md class="bottom-buffer">
        <v-layout row wrap>
          <v-flex xs10 offset-xs1 v-for="assignment of assignments" :key="assignment._id">
            <v-card>
              <v-card-title>
                <v-flex xs12>
                  <span class="display-1">{{ assignment.name }}</span>
                    </v-flex>

                  <v-flex
                  xs4
                  >
                    <div class="assn-card-text">
                      Total points: {{assignment.totalPts}}
                    </div>
                  </v-flex>
                  <!-- <v-flex
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
                  </v-flex> -->

                  <v-flex
                  offset-xs7
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
                    @click="deleteAssignment(assignment)"
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


    </div>
    <div v-if="!assignmentsExist && loaded">
      <h1 class="no-assignments display-1">No assignments exist for {{parentCourse.courseName}}.
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
    <v-snackbar
      :timeout="timeout"
      bottom
      v-model="snackbar"
    >
      {{ deletedAssignment }}
      <v-btn color="yellow" dark flat @click.native="undoDeleteAssignment">Undo</v-btn>
    </v-snackbar>
  </div>

</template>

<script>
import * as courseApi from '@/apis/course-api';

export default {
  data() {
    return {
      assignments: [],
      snackbar: false,
      timeout: 5000,
      deletedAssignment: '',
      deletionStack: [],
      parentCourse: null,
      loaded: false
    };
  },
  methods: {
    navigateToAssignment(id) {
      this.$router.push(`/course/${this.parentCourse._id}/grade-assignment/${id}`);
    },
    deleteAssignment(assignmentToDelete) {
      this.deletionStack.push(assignmentToDelete);
      this.deletedAssignment = `${assignmentToDelete.name} deleted.`;
      this.snackbar = true;
      this.assignments = this.assignments.filter(
        assignment => assignment._id !== assignmentToDelete._id
      );

      setTimeout(this.deleteAssignmentsInDB, 6000);
    },
    undoDeleteAssignment() {
      this.assignments.push(this.deletionStack.pop());
      this.snackbar = false;
    },
    deleteAssignmentsInDB() {
      // eslint-disable-next-line
      for (const assignment of this.deletionStack) {
        courseApi.deleteAssignment(this.parentCourse._id, assignment._id);
      }
      this.deletionStack = [];
    },
    createAssignment() {
      this.$router.push(`/courses/${this.parentCourse._id}/create-assignment/`);
    }
  },
  created() {
    const self = this;
    const { courseId } = this.$route.params;

    courseApi.getCourse(courseId, course => {
      self.parentCourse = course;
      self.assignments = course.assignments;
      self.loaded = true;
    });
  },
  computed: {
    assignmentsExist() {
      return this.assignments.length > 0;
    }
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

.centerize {
  text-align: center;
  margin-bottom: 5vh;
}

.fab-button {
  margin-right: 35px;
  margin-bottom: 35px;
}

.no-assignments {
  text-align: center;
}

.bottom-buffer {
  margin-bottom: 10vh;
}
</style>
