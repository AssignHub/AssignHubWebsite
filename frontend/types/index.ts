export type Class = {
  _id: string
  courseId: string
  name: string
  color: string
}

export type Assignment = {
  _id: string
  classId: string
  title: string
  dueDate: Date
  done: boolean
}