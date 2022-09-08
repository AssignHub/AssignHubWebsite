<template>
  <div class="tw-flex tw-flex-col tw-items-center tw-h-full tw-w-full">
    <div style="height: 20vh;" />
    <img src="@/assets/logo_small.png" class="tw-h-32 tw-mb-4">
    <div class="tw-text-lg tw-text-center">Visit AssignHub on a bigger screen<br>for a better experience</div>
    <v-spacer />
    <a class="tw-mb-4" @click="$emit('dismiss')">Continue anyways (not recommended)</a>
  </div>
</template>

<script>
export default {
  name: 'PhoneWarning',
}
</script>