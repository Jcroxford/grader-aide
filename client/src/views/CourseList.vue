<template >
  <div class="main-background" >
    <div v-if="coursesExist" class="nav-offset container width-restrictor">
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex xs8 offset-xs2 v-for="course of courses" :key="course._id">
            <v-card>
              <v-card-title>
                <v-flex xs12>
                  <span class="display-1">{{ course.courseId }} - {{ course.courseName }}</span>
                    </v-flex>

                  <v-flex
                  xs4
                  >
                    <div class="assn-card-text">
                      Total students enrolled: 9001
                    </div>
                  </v-flex>

                  <v-flex
                  offset-xs8
                  align-content-space-between
                  >
                  <v-btn
                    flat
                    color="green"
                    @click="navigateToCourse(course._id)"
                  >
                    view Course
                  </v-btn>
                  <v-btn
                    flat
                    color="red"
                    @click="deleteCourse(course._id)"
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
        {{ deletedCourse }}
      <v-btn color="yellow" dark flat @click.native="snackbar = false">Undo</v-btn>
      </v-snackbar>
    </div>
    <div v-if="!coursesExist">
      <h1 class="no-courses display-1">You don't have any courses set up!
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
          @click="createCourse"
        >
          <v-icon color="white">add</v-icon>
        </v-btn>
      <span>Create course</span>
    </v-tooltip>
  </div>

</template>

<script>
import * as courseApi from '@/apis/course-api';

export default {
  data() {
    return {
      courses: [],
      snackbar: false,
      timeout: 5000,
      deletedCourse: '',
      deletionStack: [],
      coursesExist: true
    };
  },
  methods: {
    navigateToCourse(id) {
      this.$router.push(`/courses/${id}`);
    },
    deleteCourse(id) {
      this.deletionStack.push(id);
      this.deletedCourse = 'Deleted course.';
      this.snackbar = true;
    },
    createCourse() {
      this.$router.push('/create-course/');
    }
  },
  created() {
    const self = this;
    courseApi.getCourses(courses => {
      if (courses.length === 0) self.coursesExist = false;
      self.courses = courses;
    });
  }
};
</script>

<style scoped>
.main-background {
  /* background: linear-gradient(rgb(76, 175, 80) 50%, rgb(248, 250, 248) 0%); */
  background-color: rgb(240, 255, 240);
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

.no-courses {
  text-align: center;
  margin-top: 40vh;
}
</style>
