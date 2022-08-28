<template>
  <div class="tw-flex tw-justify-center">
    <ClassList class="tw-absolute tw-left-0"/>
    <WeekView class="tw-flex-1 tw-w-64"/>
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