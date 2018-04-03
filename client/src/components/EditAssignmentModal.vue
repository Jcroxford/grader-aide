<template>
<v-dialog :value="display" persistent max-width="1000px">
  <v-card>
    <v-card-text>
      <div class="display-2 grey--text text--darken-3">Edit Rules</div>
      <v-data-table :headers="ruleHeaders" :items="rules" hide-actions>
        <template slot="items" slot-scope="props">
          <td class="tbl-sm-col">
            <v-text-field v-model="props.item.pts" @blur="handleRuleEdited(props.item)"></v-text-field>
          </td>
          <td>{{ props.item.desc }}</td>
          <td class="tbl-sm-col">
            <v-icon class="red--text text--darken-2 clickable">delete</v-icon>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-btn flat color="red" @click="handleCancelEdit">Cancel</v-btn>
      <v-btn flat class="yellow--text text--darken-2">Undo</v-btn>
      <v-btn flat color="success">Save Changes</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  props: {
    display: {
      type: Boolean,
      required: true
    }
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
      ]
    };
  },
  methods: {
    handleCancelEdit() {
      this.$emit('close-modal');
    },
    // mutates rule in place
    handleRuleEdited(rule) {
      if (!!rule.pts) rule.pts = parseInt(rule.pts);

      // clean rule
      rule.desc = rule.desc.trim().replace(/\s+/g, ' ');
    }
  },
  created() {
    let self = this;
    setInterval(() => {
      console.log(self.rules);
    }, 10000);
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
