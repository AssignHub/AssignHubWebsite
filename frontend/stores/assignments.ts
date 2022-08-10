import type { Assignment } from "@/types"
import { defineStore } from "pinia"
import { createUUID, getDateWithDayOffset, getDayString } from "~~/utils"

export const useAssignmentsStore = defineStore('assignments', {
  state: () => ({
    // Maps assignment id to assignment
    byId: new Map([
      ['assignment1', {
        _id: 'assignment1', 
        classId: 'class1', 
        dueDate: getDayString(getDateWithDayOffset(new Date(), 1)), 
        title: 'Homework 1',
        done: false,
      }],
      ['assignment2', {
        _id: 'assignment2', 
        classId: 'class1', 
        dueDate: getDayString(getDateWithDayOffset(new Date(), 5)), 
        title: 'zomework 2',
        done: false,
      }],
      ['assignment3', {
        _id: 'assignment3', 
        classId: 'class3', 
        dueDate: getDayString(getDateWithDayOffset(new Date(), 3)), 
        title: 'Group presentation',
        done: false,
      }],
      ['assignment4', {
        _id: 'assignment4', 
        classId: 'class2', 
        dueDate: getDayString(getDateWithDayOffset(new Date(), 3)), 
        title: 'Lab 5',
        done: false,
      }],
      ['assignment5', {
        _id: 'assignment5', 
        classId: 'class2', 
        dueDate: getDayString(getDateWithDayOffset(new Date(), 4)), 
        title: 'PA 2',
        done: false,
      }],
    ]) as Map<string, Assignment>
  }),
  getters: {
    // Returns an array of assignments, sorted by dueDate
    array: (state): Assignment[] => {
      const arr: Assignment[] = []
      for (const [_, assignment] of state.byId) {
        arr.push(assignment)
      }
      arr.sort()
      return arr
    },
    // Returns a mapping from a day ("2022-08-09") to an array of assignments on that day
    byDay(): Map<String, Assignment[]> {
      const map = new Map<String, Assignment[]>()
      for (const assignment of this.array as Assignment[]) {
        if (map.has(assignment.dueDate)) {
          map.get(assignment.dueDate).push(assignment)
        } else {
          map.set(assignment.dueDate, [assignment])
        }
      }
      return map
    },
  },
  actions: {
    async add({title, classId, dueDate}: {title: string, classId: string, dueDate: String}) {
      const id = createUUID()
      this.byId.set(id, {
        _id: id,
        classId,
        title,
        dueDate,
        done: false,
      })
    },
    toggle(id: string) {
      if (this.byId.has(id)) {
        this.byId.get(id)!.done = !this.byId.get(id)!.done
      }
    }
  }
})