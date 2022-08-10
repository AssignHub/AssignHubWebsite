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
  dueDate: String // e.g. "2022-08-09"
  done: boolean
}