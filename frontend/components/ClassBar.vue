<!-- Displays a singular class -->
<script setup lang="ts">
import { Class } from '~~/types';

// Props
const props = defineProps({
    _class: { type: Object as () => Class, required: true },
})

const statusImages = new Map([
    [1, '~~/assets/upload.png'], [2, '~~/assets/upload.png'], [3, '~~/assets/upload.png'],],
) as Map<number, string>

</script>

<template>
    <div class="tw-w-full tw-flex tw-justify-between tw-rounded-lg tw-p-2 tw-items-center tw-text-white" :style="{backgroundColor: props._class.color}">
        <div class="tw-text-lg">{{props._class.courseId}}</div>
        <div>
            <v-btn @click="" icon variant="text" size="small">
                <img src="~~/assets/upload.png" />
            </v-btn>
            <v-btn flat icon variant="text" size="medium">
                <v-icon>mdi-dots-vertical</v-icon>

                <v-menu activator="parent" location="end">
                    <v-list>
                        <v-list-item @click="">
                            <v-list-item-title>Edit color</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="" class="tw-text-red">
                            <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-btn>
        </div>
    </div>
</template>