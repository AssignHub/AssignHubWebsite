<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { Class, Assignment } from '@/types'
import TodoItem from './TodoItem.vue'

const assignments = ref([
    {
        _id: '1234',
        classId: 'CSCI-170',
        title: 'Assignment #1',
        dueDate: new Date(),
        completed: false,
    },
    {
        _id: '12345',
        classId: 'CSCI-170',
        title: 'Assignment #1',
        dueDate: new Date(),
        completed: true,
    },
    {
        _id: '12346',
        classId: 'CSCI-170',
        title: 'Assignment #1',
        dueDate: null,
        completed: false,
    },/*
    {
        _id: '12346',
        classId: 'CSCI-170',
        title: 'This is a long assignment name',
        dueDate: null,
    },
    {
        _id: '12346',
        classId: 'CSCI-170',
        title: 'This is a long assignment name with a date',
        dueDate: new Date(),
    },*/
    
])

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
        <div class="tw-mt-2 tw-grid tw-grid-cols-1 tw-gap-1">
            <TodoItem v-for="a in assignments.filter((a) => !a.completed)" :key="a._id" :_assignment="a" :_color="props._class.color"></TodoItem>
            <TodoItem v-for="a in assignments.filter((a) => a.completed)" :key="a._id" :_assignment="a" :_color="props._class.color"></TodoItem>
        </div>
    </div>
</template>