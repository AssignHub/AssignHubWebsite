# School specific implementations
## index.js
Same for every school, should contain exactly:
```
module.exports = { utils: require('./utils'), middleware: require('./middleware') }
```

## middleware.js
Contains the following middleware functions

### `searchClass(req, res, next)`
- Sets `res.locals.classSections` to an array containing all the sections of the specified `courseId`, which is a query parameter
- Each element of the array should be of the following form:
```
{
  term : String,
  courseId : String, 
  sectionId : String, 
  blocks : [{
    day : String['M', 'T', 'W', 'H', 'F'],
    start : String, // e.g. "14:00"
    end : String, // e.g. "16:50"
    location : String, 
  }], 
  type : String['Lecture', 'Discussion', 'Lab', 'Quiz'], 
  instructors : [{
    firstName : String,
    lastName : String,
  }],
}
```

### `addClass(req, res, next)`
- TODO

## utils.js
Contains the following functions + any other util functions you want to create

### `getTerms()`
- Returns the current terms that should be made available for the user to select
- The object returned should be of the following form:
```
[
  {
    text : String, /* The text to display for the term, e.g. "Spring 2022" */
    term : String, /* The internal API string used to represent the term. For USC, "Spring 2022" would be "20221" */
  }
]
```
