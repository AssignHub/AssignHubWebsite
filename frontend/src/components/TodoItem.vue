<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { Assignment } from '@/types'

const props = defineProps({
    _assignment: { type: Object as () => Assignment, required: true },
    _color: { type: String, required: true }
})

const dueDateString = computed(() => {
    if (props._assignment.dueDate) {
        let dateString = (props._assignment.dueDate.getMonth() + 1) + '/' + props._assignment.dueDate.getDate()
        const timeString = props._assignment.dueDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

        return dateString + ' | ' + timeString
    } else {
        return ''
    }
})


const completed = ref(props._assignment.completed)
</script>

<template>
    <div class="tw-w-full tw-flex tw-flex-row tw-min-h-10">
        <v-checkbox class="-tw-mt-3 tw-w-10 tw-h-10" :color="_color" v-model="completed" hide-details></v-checkbox>
        <div class="tw-w-32 tw-flex tw-flex-col tw-content-center tw-justify-center tw-text-gray-700 tw-leading-4">
            <span :class="{strike: completed}">{{ _assignment.title }}</span>
            <span v-if="_assignment.dueDate" :style="{ fontSize: '10px' }">
                <v-icon>mdi-calendar</v-icon> {{ dueDateString }}
            </span>
        </div>
    </div>
</template>

<style scoped>
@keyframes strike {
    0% {
        width: 0;
    }

    100% {
        width: 90%;
    }
}

@keyframes strikeShort {
    0% {
        width: 0;
    }

    100% {
        width: 90%;
    }
}

.strike {
    position: relative;
}

.strike::after {
    content: ' ';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: black;
    animation-name: strike;
    animation-duration: 0.2s;
    animation-timing-function: ease-in;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}
</style>