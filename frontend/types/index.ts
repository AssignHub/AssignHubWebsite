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
  dueDate: string // e.g. "2022-08-09"
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

export type ContextMenu = {
  show: boolean
  type?: ContextMenuType
  data: any
  x: number
  y: number
}

export enum ContextMenuType {
  Assignment,
}
