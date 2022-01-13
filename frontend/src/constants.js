// Array containing all the possible colors users can set their classes to
export const CLASS_COLORS = Object.freeze([
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
])

// Enum of all the context menu types
export const CONTEXT_MENU_TYPES = Object.freeze({
  assignment: 0,
  class: 1,
  removeFriend: 2,
})

// Object that maps a mood to the corresponding emoji name on the server
export const MOODS = Object.freeze({
  Crying: 'crying',
  Sad: 'sad',
  Tired: 'tired',
  Smiling: 'smiling',
  Sunglasses: 'sunglasses',
})

// Object that maps the emoji name to its corresponding image on the frontend
export const EMOJIS = Object.freeze({
  [MOODS.Crying]: require('@/assets/crying.png'),
  [MOODS.Sad]: require('@/assets/sad.png'),
  [MOODS.Tired]: require('@/assets/tired.png'),
  [MOODS.Smiling]: require('@/assets/smiling.png'),
  [MOODS.Sunglasses]: require('@/assets/sunglasses.png'),
})

// An array of Berkeley semesters and their end dates
export const BERKELEY_SEMESTERS = Object.freeze([
  {
    term: 2218,
    end: "December 17, 2021"
  },
  {
    term: 2222,
    end: "May 13, 2022"
  },
  {
    term: 2225,
    end: "August 12, 2022"
  }
])

// An array of all the intro.js tutorial steps
export const TUTORIAL_STEPS = Object.freeze([
  {
    element: '#tut-todo-list',
    title: 'Todo list',
    intro: 'Click here to see all your upcoming assignments',
    position: 'right',
  },
  {
    element: '#tut-classes',
    title: 'Classes',
    intro: '', // This is determined programmatically (see utils.js)
    position: 'right',
  },
  {
    element: '#tut-friends',
    title: 'Friends',
    intro: 'View all your friends and their schedules here',
    position: 'right',
  },
  {
    element: '#tut-add-assignment-btn',
    title: 'Add assignments',
    intro: 'Click here to add assignments',
  },
  {
    element: '#tut-add-assignment-form',
    intro: 'Fill out the details for your assignment here',
  },
  {
    element: '#tut-crowdsource-btn',
    intro: 'Click here to add crowdsourced assignments that your classmates have created',
  },
  {
    element: '#tut-calendar',
    title: 'Calendar',
    intro: 'View all of your assignment deadlines on this calendar',
  },
  {
    element: '#tut-help',
    title: 'Help',
    intro: 'Click here to view this tutorial again'
  },
])