<script setup lang="ts">
import { Class } from '~~/types';

// Props
const props = defineProps({
    _class: { type: Object as () => Class, required: true },
})

const statusIcons = new Map([
    [1, 'file-check'], [2, 'file-check'], [3, 'file-check'],],
) as Map<number, string>

const dialog = ref(false) 

</script>
    
<template>

    <v-dialog v-model="dialog">
        <template v-slot:activator="{ props }">
            <v-btn @click="" icon variant="text" class="tw-text-xl" v-bind="props">
                <v-icon>mdi-file-check</v-icon>
            </v-btn>
        </template>

        <v-card>
            <v-card-title class="tw-text-white tw-font-light" :style="{backgroundColor: props._class.color}">
                {{props._class.courseId}}</v-card-title>

            <v-card-text>
                <div class="tw-text-3xl tw-font-bold tw-mb-2">Parse syllabus</div>
                <div class="tw-mb-2">Upload any and all documents that contain assignment deadlines and exam dates.
                </div>
                <div
                    class="tw-h-64 tw-bg-very-light-blue tw-border-2 tw-border-blue tw-rounded-lg tw-border-dashed tw-flex tw-justify-center tw-text-blue tw-mb-2 tw-relative tw-cursor-pointer">
                    <div class="tw-m-auto tw-flex tw-flex-col tw-items-center">
                        <v-icon class="tw-text-5xl">mdi-cloud-upload</v-icon>
                        <div>Upload your syllabus
                        </div>
                        <div>(.pdf, screenshots, etc.)</div>
                    </div> 
                    <input type="file" class="tw-opacity-0 tw-absolute tw-top-0 tw-right-0 tw-w-full tw-h-full" />
                </div>
                <v-textarea outlined placeholder="Tell us anything special about your syllabus..."></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="dialog = false">Submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template> 