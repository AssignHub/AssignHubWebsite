import { defineStore } from 'pinia'
import { ContextMenu, ContextMenuType } from '~~/types'

export const usePageStateStore = defineStore('pageState', {
  state: () => ({
    info: '' as string,
    error: '' as string,

    contextMenu: {
      show: false,
      data: null,
      x: 0,
      y: 0,
    } as ContextMenu,
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

    showContextMenu(type: ContextMenuType, data: object, mouseEvent: MouseEvent) {
      this.contextMenu.type = type
      this.contextMenu.data = data
      this.contextMenu.x = mouseEvent.clientX
      this.contextMenu.y = mouseEvent.clientY

      if (!this.contextMenu.show)
        this.contextMenu.show = true
    },
    hideContextMenu() {
      if (this.contextMenu.show)
        this.contextMenu.show = false
    },
  },
})