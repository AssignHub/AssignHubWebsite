<script lang="ts" setup>
import { useModelWrapper } from '@/utils'
type NavbarItemData = {
  icon: string
  iconSelected: string
  onClick: Function
}

const props = defineProps({
  tabs: { type: Object as () => NavbarItemData[], default: [] },
  modelValue: { type: Number, default: 0 },
})
const emit = defineEmits([ 'update:modelValue' ])

const selectedTab = useModelWrapper(props, emit)
</script>

<template>
  <div class="tw-flex tw-items-center tw-fixed tw-w-full tw-bottom-0 tw-h-14 tw-border-t tw-border-solid tw-border-gray-300">
      <div v-for="item, i in props.tabs" :key="i" class="tw-flex-1 tw-text-center tw-h-full tw-grid tw-place-content-center" @click="selectedTab = i">
        <v-icon v-if="selectedTab === i" class="tw-text-gray-600">{{ item.iconSelected }}</v-icon>
        <v-icon v-else class="tw-text-gray-300">{{ item.icon }}</v-icon>
      </div>
  </div>
</template>