<template>
  <div>
    <div class="assignment-container main-background">
      <div class="navbar-offset">
      <v-container grid-list-md>
        <v-layout row>
          <v-flex xs12>
            <v-card>
              <v-card-title primary-title>
                <v-layout row wrap>
                  <v-flex xs12>
                  <!-- INLINE assignment name editing -->
                    <p class="display-3" >{{ assignmentName }}</p>
                  <!-- INLINE total points editing -->
                    <h5
                      class="title mb-3"
                      >
                      Total points possible: {{totalPts}}
                    </h5>
                  <v-divider></v-divider>
                  </v-flex>

                </v-layout>
              </v-card-title>

              <v-card-text>
                <v-layout row wrap>
                  <!-- checklist -->
                  <v-flex xs6>
                        <div slot="header">
                          <v-icon class="mr-2">playlist_add_check</v-icon>
                           <span class="pr-5">Rules</span>
                        </div>
                        <v-card>
                          <v-card-text>
                            <v-checkbox
                              v-for="rule of rules"
                              :key="rule.id"
                              :label="handleDisplayRule(rule)"
                              v-model="rule.checked"
                              color="green"
                            ></v-checkbox>
                          </v-card-text>
                        </v-card>
                      <!-- actions -->
                      <v-btn
                        color="error"
                        :disabled="resettable"
                        @click="resetSelections"
                      >Reset</v-btn>
                  </v-flex>
                  <v-flex xs6>
                    <v-card>
                      <v-card-text>
                        <v-list>
                          <v-subheader><h2>Result</h2></v-subheader>
                          <template v-for="rule of selectedRules">
                            <v-list-tile :key="rule.id">
                              <v-list-tile-content>
                                <span class="rules-and-comments">{{handleDisplayRule(rule)}}</span>
                              </v-list-tile-content>
                            </v-list-tile>
                          </template>
                        </v-list>
                      </v-card-text>
                      <v-layout row>
                        <v-flex xs12>
                        <strong class="pts-received">{{ptsReceived}}</strong>
                        /{{totalPts}} possible
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      </div>
    </div>
    <div v-if="!assignmentId">

    </div>
  </div>
</template>

<script>
/* eslint-disable */
import EditAssignmentModal from '@/components/EditAssignmentModal';
import * as CourseApi from '@/apis/course-api.js';

export default {
  data() {
    return {
      // persistant data
      _id: null, //this one is needed for api update calls. assignmentId is needed for html above. I'm too lazy to change it.
      assignmentId: null,
      assignmentName: null,
      totalPts: null,
      assignmentEditable: false,
      totalPtsEditable: false,
      rules: [],
      comments: [],
      // gui state
      displayEdit: false,
      parentCourseId: null
    };
  },
  methods: {
    // gui methods
    handleDisplayRule({ pts, desc }) {
      const formattedPts = pts < 0 ? pts : `+${pts}`;

      return `${formattedPts} ${desc}`;
    },
    copyToClip() {
      let self = this;
      let checkedRules = self.selectedRules.map(function(rule) {
        return `\t${rule['pts']} ${rule['desc']}\n`;
      });
      let checkedComments = self.selectedComments.map(function(comment) {
        return `\t${comment['desc']}\n`;
      });

      return `Rules: \n${checkedRules} \nComments: \n${checkedComments}\n${
        this.ptsReceived
      } received out of ${this.totalPts} possible.`.replace(/,/g, ''); //.replace(/,/g, '') removes commas from the outputed list for cleaner output.
    },
    onCopy: function(e) {
      console.log('Copied: \n', e.text);
    },
    onError: function(e) {
      console.log('Failed to copy to clip.');
    },
    // data manipulation methods
    selectAll() {
      this.rules = this.rules.map(rule => ({
        ...rule,
        checked: true
      }));
      this.comments = this.comments.map(comment => ({
        ...comment,
        checked: true
      }));
    },
    resetSelections() {
      this.rules = this.rules.map(rule => ({
        ...rule,
        checked: false
      }));
      this.comments = this.comments.map(comment => ({
        ...comment,
        checked: false
      }));
    }
  },
  computed: {
    ptsReceived() {
      let ptsReceived = parseInt(this.totalPts);
      for (let rule of this.selectedRules) {
        ptsReceived += parseInt(rule.pts);
      }
      return ptsReceived;
    },
    selectedRules() {
      return this.rules.filter(rule => rule.checked);
    },
    selectedComments() {
      return this.comments.filter(comment => comment.checked);
    },
    allOptionsSelected() {
      return (
        this.selectedRules.length === this.rules.length &&
        this.selectedComments.length === this.comments.length
      );
    },
    resettable() {
      const atLeastOneUsed = this.selectedRules.length || this.selectedComments.length;
      return !atLeastOneUsed;
    }
  },
  created() {
    let self = this;
    const { courseId, assignmentId } = this.$route.params;

    self.parentCourseId = courseId;

    CourseApi.getAssignment(courseId, assignmentId, function(res) {
      self._id = res._id;
      self.assignmentId = res._id;
      self.assignmentName = res.name;
      self.totalPts = res.totalPts;
      self.rules = res.rules;
      self.comments = res.comments;
    });
  },
  components: {
    EditAssignmentModal
  }
};
</script>

<style scoped>
.main-background {
  background: linear-gradient(rgb(76, 175, 80) 50%, rgb(248, 250, 248) 0%);
  position: fixed;
  background-attachment: fixed;
}

.pts-received {
  font-size: 30px;
  margin-left: 30px;
}

.assignment-name-input {
  font-size: 44px !important;
}
.rules-and-comments {
  margin-left: 25px;
}

.assignment-container {
  height: 90vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: min-content;
  position: relative;
}
.navbar-offset {
  margin-top: 10vh;
  margin-bottom: 10vh;
}
</style>
