<template>
  <div class="assignment-container main-background">
    <!-- popup for editing an assignment's rules and comments -->
    <edit-assignment-modal
      v-if="displayEdit"
      :display="displayEdit"
      :rules="rules"
      :comments="comments"
      @close-modal="displayEdit = false"
      @save-edits="handleSaveEdits"
    ></edit-assignment-modal>
    <v-container grid-list-md>
      <v-layout row>
        <v-flex xs10 offset-xs1>
          <v-card>
            <v-card-title primary-title>
              <v-layout row wrap>
                 <v-flex xs12>
                <!-- INLINE assignment name editing -->
                <template v-if="!assignmentEditable">
                  <p class="display-3" @click="assignmentEditable = true">{{ assignmentName }}</p>
                </template>
                <template v-else>
                  <input class="display-3" style="display: block;" v-model="assignmentName" v-on:keyup.enter="updateAssignmentName()" v-on:blur="updateAssignmentName()">
                </template>

                <!-- INLINE total points editing -->
                <template v-if="!totalPtsEditable">
                  <h5 class="title mb-3" @click="totalPtsEditable = true">Total points possible: {{totalPts}}</h5>
                </template>
                <template v-else>
                  <h5 style="display:inline;" class="title mb-3">Total Points Possible:
                    <input style="width:100px; font-size:24px;" type="number" v-model="totalPts" v-on:keyup.enter="updateTotalPts()" v-on:blur="updateTotalPts()" />
                  </h5>
                </template>
                
                <v-divider></v-divider>
                </v-flex>

              </v-layout>
            </v-card-title>

            <v-card-text>
              <v-layout row wrap>
                <!-- checklist -->
                <v-flex xs6>
                  <v-expansion-panel>
                    <!-- rules -->
                    <v-expansion-panel-content>
                      <div slot="header">
                        <v-icon class="mr-2">playlist_add_check</v-icon>Rules
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
                    </v-expansion-panel-content>

                    <!-- comments -->
                    <v-expansion-panel-content>
                      <div slot="header">
                        <v-icon class="mr-2">comment</v-icon>Comments
                      </div>
                      <v-card>
                        <v-card-text>
                          <v-checkbox
                            v-for="comment of comments"
                            :key="comment.id"
                            :label="comment.desc"
                            v-model="comment.checked"
                            color="green"
                          ></v-checkbox>
                        </v-card-text>
                      </v-card>
                    </v-expansion-panel-content>

                    <!-- actions -->
                    <v-btn
                      class="text-sm-left"
                      color="success"
                      @click="selectAll"
                      :disabled="allOptionsSelected"
                    >
                      All
                    </v-btn>
                    <v-btn
                      color="error"
                      :disabled="resettable"
                      @click="resetSelections"
                    >Reset</v-btn>
                    <v-btn
                      color="yellow"
                      light
                      @click="displayEdit = true"
                    >
                      <v-icon>mode_edit</v-icon>
                    </v-btn>
                  </v-expansion-panel>
                </v-flex>

                <v-flex xs6>
                  <v-card>
                    <v-card-text>
                      <v-list>
                        <v-subheader><h2>Rules</h2></v-subheader>
                        <template v-for="rule of selectedRules">
                          <v-list-tile :key="rule.id">
                            <v-list-tile-content>
                              {{handleDisplayRule(rule)}}
                            </v-list-tile-content>
                          </v-list-tile>
                        </template>
                      </v-list>
                      <v-divider></v-divider>

                      <v-list>
                        <v-subheader><h2>Comments</h2></v-subheader>
                        <template v-for="comment of selectedComments">
                          <v-list-tile :key="comment.id">
                            <v-list-tile-content>
                              {{comment.desc}}
                            </v-list-tile-content>
                          </v-list-tile>
                        </template>
                      </v-list>
                    </v-card-text>
                    <v-layout row>
                      <v-flex xs12>
                        <!-- <v-tooltip bottom> -->
                          <v-btn
                            type="button"
                            class="right"
                            color="green"
                            light
                            v-clipboard:copy="copyToClip()"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError">
                          <v-icon>content_copy</v-icon>
                        </v-btn>                          
                        <!-- <span>Copy to Clipboard</span>
                      </v-tooltip> -->
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
</template>

<script>
/* eslint-disable */
import EditAssignmentModal from '@/components/EditAssignmentModal';
import * as AssignmentAPI from '@/apis/assignment-api.js';

export default {
  created() {
    console.log(process.env.NODE_ENV);
  },
  data() {
    return {
      // persistant data
      assignmentID: null,
      assignmentName: null,
      totalPts: null,
      assignmentEditable: false,
      totalPtsEditable: false,
      rules: [],
      comments: [],
      // gui state
      displayEdit: false
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

      return `Rules: \n${checkedRules} \nComments: \n${checkedComments}`.replace(/,/g, ''); //.replace(/,/g, '') removes commas from the outputed list for cleaner output.
    },
    onCopy: function(e) {
      console.log('Copied: \n', e.text);
    },
    onError: function(e) {
      console.log('Failed to copy to clip.');
    },
    // data manipulation methods
    selectAll() {
      this.rules = this.rules.map(rule => ({ ...rule, checked: true }));
      this.comments = this.comments.map(comment => ({ ...comment, checked: true }));
    },
    resetSelections() {
      this.rules = this.rules.map(rule => ({ ...rule, checked: false }));
      this.comments = this.comments.map(comment => ({ ...comment, checked: false }));
    },
    updateAssignmentName() {
      //console.log(event);
      this.assignmentEditable = false;
      if (event.type == 'blur') {
        this.updateAssignmentInDB();
      }
    },
    updateTotalPts() {
      //console.log(event);
      this.totalPtsEditable = false;
      if (event.type == 'blur') {
        this.updateAssignmentInDB();
      }
    },
    updateAssignmentInDB() {
      let self = this;
      if (self.assignmentID != null) {
        AssignmentAPI.updateAssignment(self, function(res) {
          //self.updateAllAssignmentsList();
          //todo fix the line above with assignment switcher
        }); //don't need to do anything once complete, just update in db
      } else {
        //new assignment needs to be created in database.

        AssignmentAPI.createAssignment(self, function(res) {
          self.assignmentID = res.data.assignmentId;
          //self.updateAllAssignmentsList();
          //todo fix the line above with assignment switcher
        }); //don't need to do anything once complete, just update in db
      }
    },
    updateAllAssignmentsList() {
      let self = this;

      AssignmentAPI.getAssignments(function(response) {
        self.allAssignments = response;
      });
    },
    handleSaveEdits({ rules, comments }) {
      this.rules = rules;
      this.comments = comments;
    }
  },
  computed: {
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

    AssignmentAPI.getAssignments(function(response) {
      self.allAssignments = response;
      AssignmentAPI.getAssignment(self.allAssignments[0]._id, function(res) {
        //console.log('res: ', res);
        //fill view with valid data from first object returned from line above.
        self.assignmentID = res._id;
        self.assignmentName = res.assignmentName;
        self.totalPts = res.totalPts;
        self.rules = res.rules;
        self.comments = res.comments;
      });
    });
  },
  components: {
    EditAssignmentModal
  }
};
</script>

<style scoped>
.main-background {
  background: linear-gradient(rgb(76, 175, 80) 50%, rgb(250, 250, 250) 0%);
  position: fixed;
  background-attachment: fixed;
}

.assignment-name-input {
  font-size: 44px !important;
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
</style>
