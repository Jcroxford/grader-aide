<template>
  <div class="assignment-container main-background">
    <v-layout>
        <v-flex xs12 sm8 offset-sm2>
        <v-card class="navbar-offset">
            <v-card-title primary-title >
                <h3 class="display-2 grey--text text--darken-3">Create Assignment</h3>
            </v-card-title>
                <v-card-text>
                    <v-form>
                            <v-text-field
                            label="Assignment Name"
                            v-model="name"
                            required
                            ></v-text-field>
                            <v-text-field
                            label="Total Points Possible"
                            v-model="totalPts"
                            type="number"
                            required
                            ></v-text-field>


                    </v-form>
                    <p class="headline grey--text text--darken-3">Rules</p>
                    <v-data-table :headers="ruleHeaders" :items="scopedRules" hide-actions>
                        <template slot="items" slot-scope="props">
                        <td class="tbl-sm-col">
                            <v-text-field
                            color="success"
                            v-model="props.item.pts"
                            @blur="handleRuleEdited(props.item)"
                            type="number"
                            @keyup="checkAddRule(props.item.id)"
                            ></v-text-field>
                        </td>
                        <td>
                            <v-text-field
                            color="success"
                            v-model="props.item.desc"
                            @blur="handleRuleEdited(props.item)"
                            @keyup="checkAddRule(props.index)"
                            ></v-text-field>
                        </td>
                        <td class="tbl-sm-col">
                            <v-tooltip bottom v-if="!isLastRule(props.item.id)">
                            <v-icon
                                class="red--text text--darken-2 clickable"
                                slot="activator"
                                @click="deleteItem(props.item, props.index)"
                            >
                                delete
                            </v-icon>
                            <span>Delete</span>
                            </v-tooltip>
                        </td>
                        </template>
                    </v-data-table>

                    <p class="headline grey--text text--darken-3">Comments</p>
                    <v-data-table :headers="commentHeaders" :items="scopedComments" hide-actions>
                        <template slot="items" slot-scope="props">
                        <td>
                            <v-text-field
                            color="success"
                            v-model="props.item.desc"
                            @blur="handleCommentEdited(props.item)"
                            @keyup="checkAddComment(props.index)"
                            ></v-text-field>
                        </td>
                        <td class="tbl-sm-col">
                            <v-tooltip bottom v-if="!isLastRule(props.item.id)">
                            <v-icon
                                class="red--text text--darken-2 clickable"
                                slot="activator"
                                @click="deleteItem(props.item, props.index)"
                            >
                                delete
                            </v-icon>
                            <span>Delete</span>
                            </v-tooltip>
                        </td>
                        </template>
                    </v-data-table>
                    </v-card-text>

            <v-card-actions>
            <v-btn flat color="green" @click="createAssignment()">Create</v-btn>
            </v-card-actions>
        </v-card>
        </v-flex>
    </v-layout>
  </div>
</template>

<script>
/* eslint-disable */
import EditAssignmentModal from '@/components/EditAssignmentModal';
import * as CourseApi from '@/apis/course-api.js';

import { ObjectId } from 'bson';

export default {
  data() {
    return {
      assignmentID: null,
      name: null,
      totalPts: null,
      assignmentEditable: false,
      totalPtsEditable: false,
      parentCourseId: null,
      // gui state
      ruleHeaders: [
        {
          text: 'Points',
          align: 'left',
          sortable: false,
          value: 'pts'
        },
        {
          text: 'Description',
          align: 'left',
          sortable: false,
          value: 'desc'
        },
        {
          align: 'left',
          sortable: false,
          value: ''
        }
      ],
      commentHeaders: [
        {
          text: 'Description',
          align: 'left',
          sortable: false,
          value: 'desc'
        },
        {
          align: 'left',
          sortable: false,
          value: ''
        }
      ],
      deleteStack: [],
      scopedRules: [
        {
          desc: '',
          pts: null,
          checked: false,
          id: new ObjectId().toString()
        }
      ],
      scopedComments: [
        {
          desc: '',
          checked: false,
          id: new ObjectId().toString()
        }
      ]
    };
  },
  methods: {
    createAssignment() {
      let self = this;
      let newAssignment = {
        name: this.name,
        totalPts: this.totalPts,
        rules: this.validRules,
        comments: this.validComments
      };

      CourseApi.createAssignment(self.parentCourseId, newAssignment, function(res) {
        self.$router.push(`/course/${self.parentCourseId}/grade-assignment/${res.id}`);
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
    },
    initScopedArrays() {
      this.scopedRules = this.deepCopy(this.rules);
      this.scopedRules.push({ desc: '', pts: null, checked: false, id: new ObjectId().toString() });

      this.scopedComments = this.deepCopy(this.comments);
      this.scopedComments.push({ desc: '', id: new ObjectId().toString() });
    },
    handleSaveEdits() {
      const rules = this.deepCopy(this.scopedRules);
      rules.pop();
      const comments = this.deepCopy(this.scopedComments);
      comments.pop();

      this.$emit('save-edits', { rules, comments });
      this.$emit('close-modal');
    },
    handleCancelEdit() {
      this.$emit('close-modal');
    },
    // ==================================================
    // rule functions
    // ==================================================
    isLastRule(index) {
      return index === this.scopedRules.length - 1;
    },
    // mutates rule in place
    handleRuleEdited(rule) {
      if (rule.pts) rule.pts = parseInt(rule.pts, 10);

      // clean rule
      rule.desc = rule.desc.trim().replace(/\s+/g, ' ');
    },
    checkAddRule(ruleIndex) {
      if (this.isLastRule(ruleIndex)) {
        this.scopedRules.push({
          desc: '',
          pts: null,
          checked: false,
          id: new ObjectId().toString()
        });
      }
    },
    // ==================================================
    // comment functions
    // ==================================================
    isLastComment(index) {
      return index === this.scopedComments.length - 1;
    },
    handleCommentEdited(comment) {
      comment.desc = comment.desc.trim().replace(/\s+/g, ' ');
    },
    checkAddComment(commentIndex) {
      if (this.isLastComment(commentIndex)) {
        this.scopedComments.push({
          desc: '',
          pts: null,
          id: new ObjectId().toString()
        });
      }
    }
  },
  computed: {
    stackIsEmpty() {
      return !this.deleteStack.length;
    },
    validRules() {
      return this.scopedRules.filter(rule => rule.desc != '');
    },
    validComments() {
      return this.scopedComments.filter(comment => comment.desc != '');
    }
  },
  created() {
    const { courseId } = this.$route.params;
    this.parentCourseId = courseId;
    // CourseApi.getCourse(courseId, course => {
    //   self.parentCourseId = course;
    // });
  },
  components: {}
};
</script>

<style scoped>
.main-background {
  background: linear-gradient(rgb(76, 175, 80) 50%, rgb(248, 250, 248) 0%);
  position: fixed;
  background-attachment: fixed;
}

.assignment-container {
  height: 100vh;
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

.navbar-offset {
  margin-top: 10vh;
  margin-bottom: 15vh;
}
</style>
