import { defineStore } from 'pinia'

export const usePageStateStore = defineStore('pageState', {
  state: () => ({
    info: '' as string,
    error: '' as string,
  }),
  actions: {
    showInfo(info: string) {
      this.info = ''
      setTimeout(() => this.info = info, 0)
    },
    showError(error: string) {
      this.error = ''
      setTimeout(() => this.error = error, 0)
    },
  },
})