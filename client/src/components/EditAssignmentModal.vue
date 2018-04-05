<template>
<v-dialog :value="display" persistent max-width="1000px">
  <v-card>
    <v-card-text>
      <div class="display-2 grey--text text--darken-3">Edit Rules</div>
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
              @keyup="checkAddRule(props.item.id)"
            ></v-text-field>
          </td>
          <td class="tbl-sm-col">
            <v-tooltip bottom v-if="!isLastRule(props.item.id)">
              <v-icon 
                class="red--text text--darken-2 clickable" 
                slot="activator"
                @click="deleteItem(props.item)"
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
      <v-btn flat color="red" @click="handleCancelEdit">Cancel</v-btn>
      <v-btn flat class="yellow--text text--darken-2" :disabled="stackIsEmpty">Undo</v-btn>
      <v-btn flat color="success" @click="handleSaveEdits">Save Changes</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
import { ObjectId } from 'bson';
export default {
  props: {
    display: { type: Boolean, required: true },
    rules: { type: Array, required: true },
    comments: { type: Array, required: true }
  },
  data() {
    return {
      // gui state
      ruleHeaders: [
        {
          text: 'Points',
          align: 'left',
          sortable: false,
          value: 'pts'
        },
        {
          text: 'Rule',
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
          text: 'Rule',
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
      // persistent data
      // props with nested arrays/objects are passed by reference
      // these props contain a deep copy rules/comments passed to
      // prevent parent from being updated until edits are saved
      scopedRules: [],
      scopedComments: []
    };
  },
  methods: {
    // ==================================================
    // shared/utilities functions
    // ==================================================
    deepCopy(arr) {
      return JSON.parse(JSON.stringify(arr));
    },
    deleteItem(item) {
      function isItemToBeRemoved(candidateItem) {
        return item.id !== candidateItem.id;
      }

      // these indeces represent potential splice candidates
      const ruleIndex = this.scopedRules.findIndex(isItemToBeRemoved);
      const commentIndex = this.scopedComments.findIndex(isItemToBeRemoved);
      const isRule = ~ruleIndex;

      isRule ? this.scopedRules.splice(index, 1) : this.scopedComments.splice(index, 1);

      const index = isRule ? ruleIndex : commentIndex;

      this.deleteStack.push({ item, index });

      console.log(this.scopedRules);
    },
    undoDelete() {
      let { item, index } = this.deleteStack.pop();
      // item is a rule if it has a pts option
      if (item.pts) {
        this.scopedRules.splice(index, 0, item);
      } else {
        // item is a comment
        this.scopedComments.splice(index, 0, item);
      }
    },
    resetEditableArrays() {
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
    isLastRule(id) {
      const idexOfRule = this.scopedRules.findIndex(rule => rule.id === id);

      return idexOfRule == this.scopedRules.length - 1;
    },
    // mutates rule in place
    handleRuleEdited(rule) {
      if (!!rule.pts) rule.pts = parseInt(rule.pts);

      // clean rule
      rule.desc = rule.desc.trim().replace(/\s+/g, ' ');
    },
    checkAddRule(ruleId) {
      if (this.isLastRule(ruleId))
        this.scopedRules.push({
          desc: '',
          pts: null,
          checked: false,
          id: new ObjectId().toString()
        });
    },
    // ==================================================
    // comment functions
    // ==================================================
    isLastComment(index) {
      return index == this.scopedComments.length - 1;
    },
    handleCommentEdited(comment) {
      comment.desc = comment.desc.trim().replace(/\s+/g, ' ');
    },
    checkAddComment(commentIndex) {
      if (this.isLastComment(commentIndex)) this.scopedComments.push({ desc: '', pts: null });
    }
  },
  computed: {
    stackIsEmpty() {
      return !this.deleteStack.length;
    }
  },
  created() {
    this.resetEditableArrays();
  }
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
.tbl-sm-col {
  width: 100px;
}
</style>
