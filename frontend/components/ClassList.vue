<script setup lang="ts">

import { useClassesStore } from '~~/stores/classes';

const classes = useClassesStore()

const showClasses = ref(true)

function toggleClasses(): void {
    showClasses.value = !showClasses.value
}
</script>

<template>
    <div class="tw-flex">
        <v-expand-x-transition>
            <div v-if="showClasses">
                <div class="tw-shadow-xl tw-h-screen tw-flex tw-flex-col tw-items-start tw-p-5">
                    <div class="tw-w-80 tw-overflow-hidden">
                        <div class="tw-text-2xl tw-font-bold tw-mb-5">Classes</div>
                        <div class="tw-grid tw-w-full tw-gap-3">
                            <ClassBar v-for="c in classes.array" :id="c._id" :_class="c"></ClassBar>
                            <v-btn class="tw-text-dark-gray tw-text-lg tw-w-32" @click="" variant="text" size="small">
                                + Add Class
                            </v-btn>
                        </div>
                    </div>
                </div>
            </div>
        </v-expand-x-transition>

        <div class="tw-bg-light-gray tw-mt-10 tw-rounded-r tw-h-10 tw-flex tw-items-center tw-cursor-pointer">
            <v-icon size="small" :class="{'tw-transition-all': true, 'tw-rotate-180': !showClasses}" @click="toggleClasses">mdi-chevron-left</v-icon>
        </div>

    </div>
</template>