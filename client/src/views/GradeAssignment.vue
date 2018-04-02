<template>
  <div class="assignment-container main-background">
    <!-- popup for editing an assignment's rules and comments -->
    <edit-assignment-modal :display="displayEdit"></edit-assignment-modal>
    <v-container grid-list-md>
      <v-layout row>
        <v-flex xs10 offset-xs1>
          <v-card>
            <v-card-title primary-title>
              <v-layout row wrap>
                <v-flex xs12>
                  <p class="display-3">{{assignmentName}}</p>
                  <h5 class="title mb-3">total points possible {{totalPts}}</h5>
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
                      @click="displayEdit = !displayEdit"
                    >
                      <v-icon>mode_edit</v-icon>
                    </v-btn>
                  </v-expansion-panel>
                </v-flex>

                <v-flex xs6>
                  <v-card>
                    <v-card-text>
                      <v-list>
                        <v-subheader>Rules</v-subheader>
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
                        <v-subheader>Comments</v-subheader>
                        <template v-for="comment of selectedComments">
                          <v-list-tile :key="comment.id">
                            <v-list-tile-content>
                              {{comment.desc}}
                            </v-list-tile-content>
                          </v-list-tile>
                        </template>
                      </v-list>
                    </v-card-text>
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
import EditAssignmentModal from '@/components/EditAssignmentModal';

export default {
  data() {
    return {
      // persistant data
      assignmentName: 'Lab 1',
      totalPts: '9999',
      rules: [
        {
          id: 'ce5e019c-44e7-4c75-8309-496599bd7c64',
          pts: -1,
          desc: 'Test test test',
          checked: true
        },
        {
          id: '1678d1d2-fdec-41c7-8982-3d7e42eb4c99',
          pts: -5,
          desc: 'Hello World',
          checked: false
        },
        {
          id: 'bd2ab547-10c9-45e0-8169-c8e7355a5e4e',
          pts: 1,
          desc: 'Extra credit',
          checked: false
        }
      ],
      comments: [
        {
          id: '4163d23c-6bff-43ea-90b4-751012e52582',
          desc: 'This is comment one',
          checked: false
        },
        {
          id: '006bfd49-04de-408c-8817-b5733777fb23',
          desc: 'lorem ipsum',
          checked: false
        },
        {
          id: '241a2814-ec4f-448c-a8d8-6ebb7d4b35a2',
          desc: 'A bird in the hand is worth two in the bush',
          checked: false
        }
      ],
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
    // data manipulation methods
    selectAll() {
      this.rules = this.rules.map(rule => ({ ...rule, checked: true }));
      this.comments = this.comments.map(comment => ({ ...comment, checked: true }));
    },
    resetSelections() {
      this.rules = this.rules.map(rule => ({ ...rule, checked: false }));
      this.comments = this.comments.map(comment => ({ ...comment, checked: false }));
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
