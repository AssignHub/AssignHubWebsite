import type { Assignment } from "@/types"
import { defineStore } from "pinia"

export const useAssignmentsStore = defineStore('assignments', {
  state: () => ({
    // Maps assignment id to assignment
    byId: new Map([
      ['assignment1', {
        _id: 'assignment1', 
        classId: 'class1', 
        dueDate: new Date(new Date().setDate( new Date().getDate() + 1 )), 
        title: 'Homework 1',
      }],
      ['assignment2', {
        _id: 'assignment2', 
        classId: 'class1', 
        dueDate: new Date(new Date().setDate( new Date().getDate() + 5 )), 
        title: 'zomework 2',
      }],
      ['assignment3', {
        _id: 'assignment3', 
        classId: 'class3', 
        dueDate: new Date(new Date().setDate( new Date().getDate() + 3 )), 
        title: 'Group presentation',
      }],
      ['assignment4', {
        _id: 'assignment4', 
        classId: 'class2', 
        dueDate: new Date(new Date().setDate( new Date().getDate() + 3 )), 
        title: 'Lab 5',
      }],
      ['assignment5', {
        _id: 'assignment5', 
        classId: 'class2', 
        dueDate: new Date(new Date().setDate( new Date().getDate() + 4 )), 
        title: 'PA 2',
      }],
    ]) as Map<string, Assignment>
  }),
  getters: {
    array: (state): Assignment[] => {
      const arr: Assignment[] = []
      for (const [_, assignment] of state.byId) {
        arr.push(assignment)
      }
      return arr
    },
  },
})