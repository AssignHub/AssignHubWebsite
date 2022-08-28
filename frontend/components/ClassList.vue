<script setup lang="ts">

import { useClassesStore } from '~~/stores/classes';

const classes = useClassesStore()
</script>

<template>
    <div class="tw-w-80 tw-shadow-lg tw-h-screen tw-flex tw-flex-col tw-items-start tw-p-5">
        <div class="tw-absolute -tw-right-5 tw-top-10 tw-bg-gray tw-rounded-r tw-h-10 tw-flex tw-items-center tw-cursor-pointer">
            <v-icon size="small">mdi-chevron-left</v-icon>
        </div>
        <div class="tw-text-2xl tw-font-bold tw-mb-5">Classes</div>
        <div class="tw-grid tw-w-full tw-gap-3">
            <ClassBar v-for="c in classes.array" :id="c._id" :class="c"></ClassBar>
            <v-btn class="tw-text-dark-gray tw-text-lg tw-w-32" @click="" variant="text" size="small">
                + Add Class
            </v-btn>
        </div>
    </div>
</template>