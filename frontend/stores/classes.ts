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
        color: '#dc2626',
      }],
      ['class3', {
        _id: 'class3',
        courseId: 'BUAD-302',
        name: 'Business Communications',
        color: '#15803d',
      }],
    ]) as Map<string, Class>,
  }),
  getters: {
    array(state): Class[] {
      const arr: Class[] = []
      for (const [_, _class] of state.byId) {
        arr.push(_class)
      }
      return arr
    },
    byCourseId(state): Map<string, Class> {
      const map: Map<string, Class> = new Map()
      for (const [_, _class] of state.byId) {
        map.set(_class.courseId, _class)
      }
      return map
    },
  },
})