import type { Class } from "@/types"
import { defineStore } from "pinia"

export const useClassesStore = defineStore('classes', {
  state: () => ({
    // Maps class id to class 
    byId: new Map([
      ['class1', {
        _id: 'class1',
        courseId: 'CSCI-170',
        name: 'Discrete Methods in Computer Science',
        color: '#6b7280',
      }],
      ['class2', {
        _id: 'class2',
        courseId: 'CSCI-103',
        name: 'Introduction to Programming',
        color: '#ef4444',
      }],
      ['class3', {
        _id: 'class3',
        courseId: 'BUAD-302',
        name: 'Business Communications',
        color: '#22c55e',
      }],
    ]) as Map<string, Class>,
  }),
  getters: {
    array: (state): Class[] => {
      const arr: Class[] = []
      for (const [_, _class] of state.byId) {
        arr.push(_class)
      }
      return arr
    },
  },
})