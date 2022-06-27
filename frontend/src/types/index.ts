export type NavbarItemData = {
  name?: string
  icon: string
  iconSelected: string
  onClick: Function
}

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
  completed: boolean
}