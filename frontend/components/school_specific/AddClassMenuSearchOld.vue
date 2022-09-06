<script setup lang="ts">

// Variables.
const courseId = ref('')
const loading = ref(false)
const searchResults = ref([])
const sections = ref(null)
const searchPlaceholder = 'Course ID (e.g. EECS 126)'

// Functions.
function getSections() {
  console.log("Getting sections!");
}

// Computed.
// The class this assignment is associated with
const showSections = computed((): boolean => {
  return false
})

</script>
        
<template>

  <v-card class="tw-w-80">

    <!-- Term header -->
    <div class="tw-bg-gray">
      <div class="d-flex" style="align-items: center;" :style="true && { backgroundColor: 'rgba(120, 120, 120, 0.4)' }">
        <div class="px-2 tw-text-white text-overline">Fall 2022</div>
        <v-spacer />
        <v-btn @click="$emit('hide')" flat icon variant="text" small color="white">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Search class text field -->
    <v-expand-transition>
      <div v-if="true" class="tw-bg-white">
        <v-card-text>
          <v-text-field id="search-class-text-field" v-model="courseId" :placeholder="searchPlaceholder"
            prepend-inner-icon="mdi-magnify" autofocus solo dense hide-details autocomplete="off" class="mb-2"
            @keydown.enter="getSections" :disabled="loading" />
          <div class="d-flex">
            <v-btn block class="tw-bg-blue tw-text-white" :disabled="!courseId" :loading="loading" @click="getSections">
              Search</v-btn>
          </div>

        </v-card-text>
      </div>
    </v-expand-transition>

    <!-- "No classes found" message -->
    <div v-if="!showSections && searchResults.length === 0" class="pa-2 white tw-h-32">
      <v-fade-transition hide-on-leave>
        <div v-if="!loading" class="mt-4" style="text-align: center;">
          {{ !sections ? 'No classes found.' : 'No sections found for the given class.' }}</div>
        <v-skeleton-loader v-else type="list-item-three-line@4" />
      </v-fade-transition>
    </div>

  </v-card>

</template> 