/* =====================================================================
   events.js — powers the calendar and event list on events.html only.
   =====================================================================
   HOW TO ADD/EDIT/REMOVE EVENTS:
   Everything on this page — the calendar dots AND the event list below
   it — is generated from the single EVENTS array right below. Add a
   new event by copying one of the objects and changing its values;
   remove one by deleting its object; nothing else needs updating.

   Fields:
     date        — "YYYY-MM-DD" format (e.g. "2026-09-06")
     time        — display text, e.g. "17:00" or "All day"
     title       — event name
     category    — one of: "Church", "School", "Youth", "Special"
                   (this controls both the calendar dot colour and the
                   badge colour on the event card — see style.css)
     location    — display text
     description — one short sentence shown on the event card

   PLACEHOLDER CONTENT: every event below is a realistic EXAMPLE for
   demonstration, not real data from the client — replace with actual
   events before this page goes live.
   ===================================================================== */

var EVENTS = [
  {
    date: "2026-08-30",
    time: "17:00",
    title: "Life Youth Gathering",
    category: "Youth",
    location: "Life Ministries Church Hall",
    description: "Worship, teaching and fellowship for ages 13–18."
  },
  {
    date: "2026-09-06",
    time: "All day",
    title: "School Sports Day",
    category: "School",
    location: "School Sports Field",
    description: "A day of fun and friendly competition for our learners."
  },
  {
    date: "2026-09-13",
    time: "09:30 & 18:00",
    title: "Sunday Communion Service",
    category: "Special",
    location: "Life Ministries Church",
    description: "A special combined communion service — all welcome."
  },
  {
    date: "2026-09-20",
    time: "09:00",
    title: "Church Family Fun Day",
    category: "Church",
    location: "Church Grounds",
    description: "Food, games and fellowship for the whole Life Ministries family."
  },
  {
    date: "2026-10-04",
    time: "10:00",
    title: "School Term 4 Assembly",
    category: "School",
    location: "School Hall",
    description: "Welcoming learners back for the final term of the year."
  },
  {
    date: "2026-10-18",
    time: "17:00",
    title: "Life Youth Camp Info Evening",
    category: "Youth",
    location: "Life Ministries Church Hall",
    description: "Find out more about this year's youth camp — parents welcome."
  }
];

document.addEventListener('DOMContentLoaded', function () {

  var calendarGrid = document.getElementById('calendarGrid');
  var calMonthLabel = document.getElementById('calMonthLabel');
  var calPrevBtn = document.getElementById('calPrev');
  var calNextBtn = document.getElementById('calNext');
  var eventsListEl = document.getElementById('eventsList');

  // Nothing to do if this page's markup isn't present (defensive check,
  // same pattern used throughout script.js).
  if (!calendarGrid || !eventsListEl) {
    return;
  }

  /* -----------------------------------------------------------------
     BUILD A QUICK LOOKUP: date string -> array of events on that date
     LEARNING NOTE: reduce() walks through every item in an array once,
     building up a single result as it goes — here, an object where
     each key is a date and each value is a list of that date's
     events. This turns "does this date have any events?" from a slow
     search-the-whole-array-every-time operation into a fast,
     direct lookup (eventsByDate["2026-09-06"]) when rendering 30+
     calendar day cells.
     ----------------------------------------------------------------- */
  var eventsByDate = EVENTS.reduce(function (acc, event) {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  // Maps each category name to the CSS class used for its colour dot
  // / badge — kept in one place so adding a new category later only
  // means adding one line here (plus the matching CSS rule).
  var categoryClass = {
    Church: 'cat-church',
    School: 'cat-school',
    Youth: 'cat-youth',
    Special: 'cat-special'
  };

  var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  // Tracks which month/year the calendar is currently showing —
  // starts on today's real month.
  var today = new Date();
  var viewYear = today.getFullYear();
  var viewMonth = today.getMonth(); // 0 = January, 11 = December

  /* -----------------------------------------------------------------
     Turn a Date object into the same "YYYY-MM-DD" string format used
     in the EVENTS array above, so the two can be compared/matched.
     LEARNING NOTE: padStart(2, '0') pads a number like "6" out to
     "06" — necessary because getMonth()/getDate() return plain
     numbers (6, not "06"), but our EVENTS dates are zero-padded.
     ----------------------------------------------------------------- */
  function toDateString(year, monthIndex, day) {
    var mm = String(monthIndex + 1).padStart(2, '0');
    var dd = String(day).padStart(2, '0');
    return year + '-' + mm + '-' + dd;
  }

  /* -----------------------------------------------------------------
     RENDER THE CALENDAR GRID for whatever month/year is currently
     selected (viewYear / viewMonth).
     ----------------------------------------------------------------- */
  function renderCalendar() {
    calMonthLabel.textContent = MONTH_NAMES[viewMonth] + ' ' + viewYear;
    calendarGrid.innerHTML = ''; // clear whatever was there before

    var firstOfMonth = new Date(viewYear, viewMonth, 1);
    var startWeekday = firstOfMonth.getDay(); // 0 (Sun) – 6 (Sat)
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Empty leading cells so day 1 lines up under the correct weekday
    for (var i = 0; i < startWeekday; i++) {
      var blank = document.createElement('div');
      blank.className = 'calendar-cell calendar-cell-blank';
      calendarGrid.appendChild(blank);
    }

    // One cell per actual day of the month
    for (var day = 1; day <= daysInMonth; day++) {
      var dateStr = toDateString(viewYear, viewMonth, day);
      var dayEvents = eventsByDate[dateStr];
      var isToday = (viewYear === today.getFullYear() &&
                      viewMonth === today.getMonth() &&
                      day === today.getDate());

      // A <button>, not a <div> — buttons are natively keyboard-
      // focusable and clickable, which a plain div is not without
      // extra ARIA work. Good for accessibility with minimal effort.
      var cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'calendar-cell' + (isToday ? ' calendar-cell-today' : '');
      cell.textContent = day;

      if (dayEvents) {
        cell.classList.add('calendar-cell-has-event');
        // Use the FIRST event's category for the dot colour if there
        // are multiple events on the same day — a small simplification.
        cell.classList.add(categoryClass[dayEvents[0].category] || 'cat-church');
        cell.setAttribute('aria-label', day + ' ' + MONTH_NAMES[viewMonth] +
          ' — ' + dayEvents.length + (dayEvents.length === 1 ? ' event' : ' events'));

        // Clicking a day with events scrolls down to and highlights
        // that event's card in the list below.
        cell.addEventListener('click', function (dateForClick) {
          return function () {
            jumpToEvent(dateForClick);
          };
        }(dateStr));
      } else {
        cell.setAttribute('aria-label', day + ' ' + MONTH_NAMES[viewMonth] + ' — no events');
      }

      calendarGrid.appendChild(cell);
    }
  }

  /* -----------------------------------------------------------------
     Scrolls the page to the event card matching a given date and
     briefly highlights it — called when a calendar day is clicked.
     ----------------------------------------------------------------- */
  function jumpToEvent(dateStr) {
    var card = document.querySelector('[data-event-date="' + dateStr + '"]');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('event-card-highlight');
      // Remove the highlight again after a couple of seconds so it
      // reads as a brief flash, not a permanent state change.
      setTimeout(function () {
        card.classList.remove('event-card-highlight');
      }, 2000);
    }
  }

  calPrevBtn.addEventListener('click', function () {
    viewMonth--;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear--;
    }
    renderCalendar();
  });

  calNextBtn.addEventListener('click', function () {
    viewMonth++;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear++;
    }
    renderCalendar();
  });

  /* -----------------------------------------------------------------
     RENDER THE CHRONOLOGICAL EVENT LIST below the calendar — every
     upcoming event (today or later), soonest first, as a card.
     ----------------------------------------------------------------- */
  function renderEventList() {
    var todayStr = toDateString(today.getFullYear(), today.getMonth(), today.getDate());

    // .filter() keeps only events on or after today; .sort() then
    // orders what's left chronologically (earliest date first) by
    // comparing the date strings directly — this works correctly
    // because "YYYY-MM-DD" format sorts the same alphabetically as
    // it does chronologically.
    var upcoming = EVENTS
      .filter(function (event) { return event.date >= todayStr; })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; });

    eventsListEl.innerHTML = '';

    if (upcoming.length === 0) {
      eventsListEl.innerHTML = '<p class="text-muted text-center">No upcoming events at the moment — check back soon.</p>';
      return;
    }

    upcoming.forEach(function (event) {
      var eventDate = new Date(event.date + 'T00:00:00');
      var dayNum = eventDate.getDate();
      var monthAbbr = MONTH_NAMES[eventDate.getMonth()].slice(0, 3);

      var col = document.createElement('div');
      col.className = 'col';
      col.innerHTML =
        '<div class="card h-100 shadow-sm border-0 event-card" data-event-date="' + event.date + '">' +
          '<div class="card-body d-flex gap-3">' +
            '<div class="event-date-badge text-center flex-shrink-0">' +
              '<div class="event-date-day">' + dayNum + '</div>' +
              '<div class="event-date-month">' + monthAbbr + '</div>' +
            '</div>' +
            '<div>' +
              '<span class="badge-category ' + (categoryClass[event.category] || 'cat-church') + '">' + event.category + '</span>' +
              '<h3 class="h6 fw-bold mt-2 mb-1" style="color: var(--brand-navy);">' + event.title + '</h3>' +
              '<p class="small text-muted mb-1">' + event.time + ' &middot; ' + event.location + '</p>' +
              '<p class="small text-muted mb-2">' + event.description + '</p>' +
              '<a href="mailto:admin@lifeministries.co.za?subject=Registering%20for%20' + encodeURIComponent(event.title) + '" class="small fw-semibold" style="color: var(--brand-green);">Register / Enquire &rarr;</a>' +
            '</div>' +
          '</div>' +
        '</div>';
      eventsListEl.appendChild(col);
    });
  }

  renderCalendar();
  renderEventList();

});
