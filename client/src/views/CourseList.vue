<template >
  <div class="main-background" >
    <div v-if="coursesExist" class="nav-offset container width-restrictor">
            <h1 class="display-1 centerize">All Courses</h1>

      <v-container grid-list-md class="bottom-buffer">
        <v-layout row wrap>
          <v-flex xs10 offset-xs1 v-for="course of courses" :key="course._id">
            <v-card>
              <v-card-title>
                <v-flex xs12>
                  <span class="display-1">{{ course.courseId }} - {{ course.courseName }}</span>
                    </v-flex>

                  <v-flex
                  xs4
                  >
                    <div class="assn-card-text">
                      Total students enrolled: {{course.studentsEnrolled.length}}
                    </div>
                  </v-flex>

                  <v-flex
                  offset-xs7
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
                    @click="deleteCourse(course)"
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
    <v-snackbar
      :timeout="timeout"
      bottom
      v-model="snackbar"
    >
      {{ deletedCourse }}
      <v-btn color="yellow" dark flat @click.native="undoDeleteCourse">Undo</v-btn>
    </v-snackbar>
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
      deletionStack: []
    };
  },
  methods: {
    navigateToCourse(id) {
      this.$router.push(`/courses/${id}`);
    },
    deleteCourse(courseToDelete) {
      this.deletionStack.push(courseToDelete);
      this.deletedCourse = `${courseToDelete.courseName} deleted.`;
      this.snackbar = true;
      this.courses = this.courses.filter(course => course._id !== courseToDelete._id);

      setTimeout(this.deleteCoursesInDB, 6000);
    },
    undoDeleteCourse() {
      this.courses.push(this.deletionStack.pop());
      this.snackbar = false;
    },
    deleteCoursesInDB() {
      // eslint-disable-next-line
      for (const course of this.deletionStack) {
        courseApi.deleteCourse(course);
      }
      this.deletionStack = [];
    },
    createCourse() {
      this.$router.push('/create-course/');
    }
  },
  created() {
    const self = this;
    courseApi.getCourses(courses => {
      self.courses = courses;
    });
  },
  computed: {
    coursesExist() {
      return this.courses.length > 0;
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

.assn-card-text {
  /* padding-left: 15px; */
}

.fab-button {
  margin-right: 35px;
  margin-bottom: 35px;
}

.centerize {
  text-align: center;
  margin-bottom: 5vh;
}

.no-courses {
  text-align: center;
}

.bottom-buffer {
  margin-bottom: 10vh;
}
</style>
