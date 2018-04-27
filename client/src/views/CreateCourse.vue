<template>
  <div class="course-container main-background">
    <v-layout>
        <v-flex xs12 sm6 offset-sm3>
        <v-card>
            <v-card-title primary-title >
                <h3 class="display-2 grey--text text--darken-3">Create Course</h3>
            </v-card-title>
                <v-card-text>
                  <v-form>
                    <v-text-field
                    name="courseName"
                    label="Name (e.g. 'Web 3')"
                    v-model="courseName"
                    single-line
                    required
                    ></v-text-field>
                    <v-text-field
                    name="courseId"
                    label="ID (e.g. 'CS 4690')"
                    v-model="courseId"
                    single-line
                    required
                    ></v-text-field>
                  </v-form>
                </v-card-text>
            <v-card-actions>
            <v-btn flat color="green" @click="createCourse">Create</v-btn>
            </v-card-actions>
        </v-card>
        </v-flex>
    </v-layout>
  </div>
</template>

<script>
/* eslint-disable */
import * as CourseAPI from '@/apis/course-api.js';

import { ObjectId } from 'bson';

export default {
  data() {
    return {
      courseName: null,
      courseId: null,
      deleteStack: []
    };
  },
  methods: {
    createCourse() {
      let self = this;
      let newCourse = {
        courseName: self.courseName,
        courseId: self.courseId,
        assignments: [],
        studentsEnrolled: []
      };
      CourseAPI.createCourse(newCourse, function(res) {
        self.$router.push(`/courses/${res.id}/create-assignment`);
      });
    },
    deepCopy(arr) {
      return JSON.parse(JSON.stringify(arr));
    },
    deleteItem(item, index) {
      this.deleteStack.push({ item, index });

      function isItemToBeRemoved(candidateItem) {
        return item.id !== candidateItem.id;
      }

      this.scopedRules = this.scopedRules.filter(isItemToBeRemoved);
      this.scopedComments = this.scopedComments.filter(isItemToBeRemoved);
    },
    undoDelete() {
      const { item, index } = this.deleteStack.pop();
      // item is a rule if it has a pts option
      if (item.pts) {
        this.scopedRules.splice(index, 0, item);
      } else {
        // item is a comment
        this.scopedComments.splice(index, 0, item);
      }
    }
  },
  computed: {
    stackIsEmpty() {
      return !this.deleteStack.length;
    }
  },
  created() {},
  components: {}
};
</script>

<style scoped>
.main-background {
  background: linear-gradient(rgb(76, 175, 80) 50%, rgb(248, 250, 248) 0%);
  position: fixed;
  background-attachment: fixed;
}

.course-container {
  height: 90vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: min-content;
  position: relative;
}
.custom-textfield {
  width: 800px !important;
}
</style>
