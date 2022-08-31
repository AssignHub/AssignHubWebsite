<template>
  <div class="tw-flex">
    <ClassList class="" />
    <div class="tw-flex tw-flex-1 tw-justify-center">
      <WeekView class="tw-flex-1 tw-w-64" />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');

html {
  font-family: 'Roboto', sans-serif;
  color: var(--color-pure-black);
  overflow-y: auto !important;
}

.v-btn {
  letter-spacing: unset !important;
  text-transform: unset !important;
  min-width: unset !important;
}

.v-btn--variant-outlined {
  border-color: var(--color-gray);
}
</style>