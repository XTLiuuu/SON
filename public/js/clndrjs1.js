<script type="text/template" src="js/template.js" name = "clndrTemplate" ></script>
$(document).ready(function(){
  //$('.calendar-div').clndr();
  $('.calendar-div').clndr({

    // The template: this could be stored in markup as a
    //   <script type="text/template"></script>
    // or pulled in as a string
    template: clndrTemplate,

    // Determines which month to start with using either a date string or a
    // moment object.
    startWithMonth: moment(),

    // Start the week off on Sunday (0), Monday (1), etc. Sunday is the default.
    // WARNING: if you are dealing with i18n and multiple languages, you
    // probably don't want this! See the "Internationalization" section below
    // for more.
    weekOffset: 0,

    // An array of day abbreviation labels. If you have moment.js set to a
    // different language, it will guess these for you! If for some reason that
    // doesn't work, use this...
    // WARNING: if you are dealing with i18n and multiple languages, you
    // probably don't want this! See the "Internationalization" section below
    // for more.
    daysOfTheWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],

    // The target classnames that CLNDR will look for to bind events.
    // these are the defaults.
    targets: {
        day: 'day',
        empty: 'empty',
        nextButton: 'clndr-next-button',
        todayButton: 'clndr-today-button',
        previousButton: 'clndr-previous-button',
        nextYearButton: 'clndr-next-year-button',
        previousYearButton: 'clndr-previous-year-button',
    },

    // Custom classes to avoid styling issues. pass in only the classnames that
    // you wish to override. These are the defaults.
    classes: {
        past: "past",
        today: "today",
        event: "event",
        selected: "selected",
        inactive: "inactive",
        lastMonth: "last-month",
        nextMonth: "next-month",
        adjacentMonth: "adjacent-month",
    },

    // Click callbacks! The keyword 'this' is set to the clndr instance in all
    // callbacks.
    clickEvents: {
        // Fired whenever a calendar box is clicked. Returns a 'target' object
        // containing the DOM element, any events, and the date as a moment.js
        // object.
        click: function (target) {
          console.log("click target")
        },

        // Fired when a user goes to the current month and year. Returns a
        // moment.js object set to the correct month.
        today: function (month) {
          console.log("click month")
        },

        // Fired when a user goes forward a month. Returns a moment.js object
        // set to the correct month.
        nextMonth: function (month) {
          console.log("next month")
        },

        // Fired when a user goes back a month. Returns a moment.js object set
        // to the correct month.
        previousMonth: function (month) {
          console.log("previous month")
        },

        // Fires any time the month changes as a result of a click action.
        // Returns a moment.js object set to the correct month.
        onMonthChange: function (month) {
          console.log("on Month change ")
        },

        // Fired when the next year button is clicked. Returns a moment.js
        // object set to the correct month and year.
        nextYear: function (month) {
          console.log(" next Year month")
        },

        // Fired when the previous year button is clicked. Returns a moment.js
        // object set to the correct month and year.
        previousYear: function (month) {
          console.log("previous Year month")
        },

        // Fires any time the year changes as a result of a click action. If
        // onMonthChange is also set, it is fired BEFORE onYearChange. Returns
        // a moment.js object set to the correct month and year.
        onYearChange: function (month) {
          console.log("on Year Change")
        },

        // Fired when a user goes forward a period. Returns moment.js objects
        // for the updated start and end date.
        nextInterval: function (start, end) {
          console.log("next Interval")
        },

        // Fired when a user goes back an interval. Returns moment.js objects for
        // the updated start and end date.
        previousInterval: function (start, end) {
          console.log("previous interval")
        },

        // Fired whenever the time period changes as configured in lengthOfTime.
        // Returns moment.js objects for the updated start and end date.
        onIntervalChange: function (start, end) {
          console.log("on Interval change")
        }
    },

    // Use the 'touchstart' event instead of 'click'
    useTouchEvents: false,

    // This is called only once after clndr has been initialized and rendered.
    // use this to bind custom event handlers that don't need to be re-attached
    // every time the month changes (most event handlers fall in this category).
    // Hint: this.element refers to the parent element that holds the clndr,
    // and is a great place to attach handlers that don't get tossed out every
    // time the clndr is re-rendered.
    ready: function () { },

    // A callback when the calendar is done rendering. This is a good place
    // to bind custom event handlers (also see the 'ready' option above).
    doneRendering: function () {},

    // An array of event objects
    events: [],

    // If you're supplying an events array, dateParameter points to the field
    // in your event object containing a date string. It's set to 'date' by
    // default.
    dateParameter: 'date',

    // CLNDR can accept events lasting more than one day! just pass in the
    // multiDayEvents option and specify what the start and end fields are
    // called within your event objects. See the example file for a working
    // instance of this.
    multiDayEvents: {
        endDate: 'endDate',
        startDate: 'startDate',
        // If you also have single day events with a different date field,
        // use the singleDay property and point it to the date field.
        singleDay: 'date'
    },

    // Show the dates of days in months adjacent to the current month. Defaults
    // to true.
    showAdjacentMonths: true,

    // When days from adjacent months are clicked, switch the current month.
    // fires nextMonth/previousMonth/onMonthChange click callbacks. defaults to
    // false.
    adjacentDaysChangeMonth: false,

    // Always make the calendar six rows tall (42 days) so that every month has
    // a consistent height. defaults to 'false'.
    forceSixRows: null,

    // Set this to true, if you want the plugin to track the last clicked day.
    // If trackSelectedDate is true, "selected" class will always be applied
    // only to the most recently clicked date; otherwise - selectedDate will
    // not change.
    trackSelectedDate: false,

    // Set this, if you want a date to be "selected" (see classes.selected)
    // after plugin init. Defualts to null, no initially selected date.
    selectedDate: null,

    // Set this to true if you don't want `inactive` dates to be selectable.
    // This will only matter if you are using the `constraints` option.
    ignoreInactiveDaysInSelection: null,

    // CLNDR can render in any time interval!
    // You can specify if you want to render one or more months, or one ore more
    // days in the calendar, as well as the paging interval whenever forward or
    // back is triggered. If both months and days are null, CLNDR will default
    // to the standard monthly view.
    lengthOfTime: {
        // Set to an integer if you want to render one or more months, otherwise
        // leave this null
        months: null,

        // Set to an integer if you want to render one or more days, otherwise
        // leave this null. Setting this to 14 would render a 2-week calendar.
        days: null,

        // This is the amount of months or days that will move forward/back when
        // paging the calendar. With days=14 and interval=7, you would have a
        // 2-week calendar that pages forward and backward 1 week at a time.
        interval: 1
    },

    // Any other data variables you want access to in your template. This gets
    // passed into the template function.
    extras: {},

    // If you want to use a different templating language, here's your ticket.
    // Precompile your template (before you call clndr), pass the data from the
    // render function into your template, and return the result. The result
    // must be a string containing valid markup. The keyword 'this' is set to
    // the clndr instance in case you need access to any other properties.
    // More under 'Template Rendering Engine' below.
    render: function (data) {
        return '<div class="html data as a string"></div>';
    },

    // If you want to prevent the user from navigating the calendar outside
    // of a certain date range (e.g. if you are making a datepicker), specify
    // either the startDate, endDate, or both in the constraints option. You
    // can change these while the calendar is on the page... See documentation
    // below for more on this!
    constraints: {
        startDate: '2017-12-22',
        endDate: '2018-01-09'
    },

    // Optionally, you can pass a Moment instance to use instead of the global
    moment: null
});

})
