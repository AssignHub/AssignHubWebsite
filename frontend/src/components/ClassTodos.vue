<script lang="ts" setup>
import { computed } from 'vue';
import type { Class } from '@/types'

const props = defineProps({
    _class: { type: Object as () => Class, required: true }
})

const headerStyle = computed(() => {
    return {
        backgroundColor: props._class.color
    }
})

const bodyStyle = computed(() => {
    return {
        backgroundColor: `${props._class.color}80`
    }
})
</script>

<template>
    <div class="tw-h-64 tw-rounded-lg" :style="bodyStyle">
        <div class="tw-flex tw-items-center tw-w-full tw-text-white tw-rounded-t-lg tw-p-2 tw-relative"
            :style="headerStyle">
            <div class="tw-ml-2">
                {{ props._class.courseId }}

            </div>
            <v-btn class="tw-absolute tw-right-0 tw-top-0" flat icon size="small">
                <v-icon>mdi-plus</v-icon>
            </v-btn>

        </div>
    </div>
</template>