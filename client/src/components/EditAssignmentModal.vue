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

      <div class="display-2 grey--text text--darken-3">Edit Comments</div>
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
      <v-btn flat color="red" @click="handleCancelEdit">Cancel</v-btn>
      <v-btn
        flat
        class="yellow--text text--darken-2"
        :disabled="stackIsEmpty"
        @click="undoDelete"
      >
        Undo
      </v-btn>
      <v-btn
        flat
        color="success"
        @click="handleSaveEdits"
      >
        Save Changes
      </v-btn>
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
      // console.log('scopedRules: ', scopedRules);
      // console.log('scopedComments: ', scopedComments);
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
    }
  },
  created() {
    this.initScopedArrays();
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
