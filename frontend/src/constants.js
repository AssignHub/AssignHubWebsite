export const CLASS_COLORS = [
  '#E57373', 
  //'#F06292', 
  '#BA68C8', 
  //'#9575CD', 
  '#7986CB', 
  '#64B5F6', 
  //'#4FC3F7', 
  //'#4DD0E1', 
  '#4DB6AC', 
  //'#81C784', 
  '#AED581', 
  //'#DCE775', 
  '#FFD800', 
  //'#FFD54F', 
  '#FFB74D', 
  //'#FF8A65',
  //'#A1887F',
  '#90A4AE',
  //'#E0E0E0',
]

export const CONTEXT_MENU_TYPES = {
  assignment: 0,
  class: 1,
  removeFriend: 2,
}

export const MOODS = Object.freeze({
  Crying: 'crying',
  Sad: 'sad',
  Tired: 'tired',
  Smiling: 'smiling',
  Sunglasses: 'sunglasses',
})

export const EMOJIS = Object.freeze({
  [MOODS.Crying]: require('@/assets/crying.png'),
  [MOODS.Sad]: require('@/assets/sad.png'),
  [MOODS.Tired]: require('@/assets/tired.png'),
  [MOODS.Smiling]: require('@/assets/smiling.png'),
  [MOODS.Sunglasses]: require('@/assets/sunglasses.png'),
})