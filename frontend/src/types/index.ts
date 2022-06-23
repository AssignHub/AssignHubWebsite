export type Class = {
  _id: string
  courseId: string
  name: string
  color: string
}

export type NavbarItemData = {
  name?: string
  icon: string
  iconSelected: string
  onClick: Function
}