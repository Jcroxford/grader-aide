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
                  <!-- INLINE assignment name editing -->
                    <span class="display-1">
                      {{ course.courseId }} - {{ course.courseName }}</span>
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
                </v-flex>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div v-if="!coursesExist">
      <h1 class="no-courses display-1">You don't have any courses set up!
        <br> Please create one by clicking the button below.</h1>
    </div>
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
      courseEditable: false
    };
  },
  methods: {
    navigateToCourse(id) {
      this.$router.push(`student/courses/${id}`);
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
