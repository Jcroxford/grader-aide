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
      this.$router.push(`/student/course/${this.parentCourse._id}/assignment/${id}`);
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
