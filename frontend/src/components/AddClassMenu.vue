<template>
  <v-menu
    transition="slide-x-transition"
    top
    right
    offset-x
    :close-on-content-click="false"
    :close-on-click="false"
    v-model="menu"
    min-width="300px"
    max-width="300px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :style="btnStyle"
        text
        block
        class="grey lighten-2 add-btn"
        v-bind="attrs"
        v-on="on"
      >+ Add Class</v-btn>
    </template>
    <component :is="`${school}AddClassMenu`" :colors="colors" :menu="menu" @close="menu = false" />
  </v-menu>
</template>

<style scoped>
  .add-btn {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>

<style>
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
    display: none; /* TODO: find the equivalent for firefox */
  }
  ::-webkit-input-placeholder { /* WebKit browsers */
    text-transform: none;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    text-transform: none;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    text-transform: none;
  }
  :-ms-input-placeholder { /* Internet Explorer 10+ */
    text-transform: none;
  }
  ::placeholder { /* Recent browsers */
    text-transform: none;
  }
</style>

<script>

import { CLASS_COLORS } from '@/constants'
import { mapState, mapGetters } from 'vuex'

import uscAddClassMenu from '@/components/school_specific/usc/AddClassMenuSearch'
import berkeleyAddClassMenu from '@/components/school_specific/berkeley/AddClassMenu'

export default {
  name: 'AddClassMenu',

  props: {
    btnStyle: { type: String, default: '' },
  },

  components: {
    uscAddClassMenu,
    berkeleyAddClassMenu,
  },

  data() {
    return {
      menu: false,
    }
  },

  computed: {
    ...mapState([ 'authUser' ]),
    ...mapGetters({ classes: 'termClasses' }),
    school() {
      if (process.env.NODE_ENV === 'development' && this.authUser.school == 'gmail') {
        return 'usc'
      }
      return this.authUser.school
    },
    colors() {
      let colors = [...CLASS_COLORS]
      for (let c of this.classes) {
        let i = colors.indexOf(c.color)
        if (i > -1) colors.splice(i, 1)
      }
      return colors
    },
  },
}
</script>