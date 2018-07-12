// An array of day-of-the-week abbreviations, shifted as requested using the
// weekOffset parameter.
daysOfTheWeek: ['S', 'M', 'T', etc...]

// The number of 7-block calendar rows, in the event that you want to do some
// looping with it
numberOfRows: 5

// The days array, documented in more detail above
days: [{ day, classes, id, events, date }]

// The month name- don't forget that you can do things like
// month.substring(0, 1) and month.toLowerCase() in your template
month: "May"

// The year that the calendar is currently focused on
year: "2013"

// All of the events happening this month. This will be empty of the
// lengthOfTime config option is set.
eventsThisMonth: []
// All of the events happening last month. This is only set if
// showAdjacementMonths is true.
eventsLastMonth: []
// All of the events happening next month. This is only set if
// showAdjacementMonths is true.
eventsNextMonth: []

// If you specified a custom lengthOfTime, you will have these instead.
intervalEnd: (moment object)
intervalStart: (moment object)
eventsThisInterval: []

// Anything you passed into the 'extras' property when creating the clndr
extras: {}
