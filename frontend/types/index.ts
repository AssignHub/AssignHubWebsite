declare var google 

export type Class = {
  _id?: string
  courseId: string
  name?: string
  color?: string
}

export type Assignment = {
  _id: string
  class: Class
  title: string
  dueDate: String // e.g. "2022-08-09"
  done: boolean
}

export type User = {
  _id: string
  firstName: string
  lastName: string
  email: string
  pic: string
  school: string
}