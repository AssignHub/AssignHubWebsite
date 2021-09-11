<template>
  <v-menu :disabled="disabled">
    <template v-slot:activator="{ on, attrs }">
      <InputItem
        v-on="on"
        v-bind="attrs"
        class="pa-2"
        type="menu"
        cursor="pointer"
        showHover
      >
        <v-chip
          small 
          :color="classColor" 
          style="cursor: pointer;"
        >
          {{ value.courseId }}
        </v-chip>
      </InputItem>
    </template>
    <v-list :dense="dense">
      <v-list-item-group 
        :value="curClassIndex"
        @change="indexChanged"  
      >
        <v-list-item
          v-for="c in classes"
          :key="c._id"
        >
          <v-list-item-content style="flex: unset;">
            <v-chip small :color="c.color" style="cursor: pointer">
              {{ c.courseId }}
            </v-chip>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<style scoped>
.v-chip {
  cursor: pointer;
}
</style>

<script>
import InputItem from '@/components/InputItem'
import { mapGetters } from 'vuex'

export default {
  name: 'ClassSelectInput',

  emits: ['input'],

  props: {
    classes: {type: Array, required: true},
    disabled: {type: Boolean, default: false},
    dense: {type: Boolean, default: false},
    value: {}, /* The current class */
  },

  components: {
    InputItem,
  },

  computed: {
    ...mapGetters(['classColorById']),
    classColor() {
      return this.classColorById(this.value._id)
    },
    curClassIndex() {
      return this.classes.findIndex(c => c._id === this.value._id)
    },
  },

  methods: {
    indexChanged(i) {
      this.$emit('input', this.classes[i])
    },
  },
}
</script>