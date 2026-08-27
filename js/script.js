/* =====================================================================
   LEARNING PRIMER — READ THIS FIRST IF YOU'RE NEW TO JAVASCRIPT
   =====================================================================
   WHAT IS JAVASCRIPT FOR?
   HTML builds the page structure. CSS makes it look right. JavaScript
   (JS) is what makes a page actually DO things after it's loaded —
   respond to clicks, show/hide things, fetch new data, run timers,
   change the page without the visitor reloading it. Without any JS
   at all, a webpage is essentially a static document, like a PDF.

   THE DOM: HOW JAVASCRIPT "SEES" YOUR HTML
   When a browser loads an HTML file, it builds an in-memory model of
   every element on the page called the DOM (Document Object Model).
   JavaScript doesn't edit your .html file directly — instead, it
   reads and modifies this DOM model, and the browser instantly
   re-draws the page to match. "document" (used constantly below) is
   JavaScript's name for that in-memory model of the whole page.

   VARIABLES: var, let, and const
   A variable is a named "box" that holds a value so you can refer to
   it again later. You'll see var used in this file (an older style,
   still completely valid) — modern JavaScript more often uses let
   (for a value that may change later) or const (for a value that
   should never be reassigned). All three work the same way for what
   this file needs; var was kept here deliberately for wide browser
   compatibility, since this is a simple marketing site, not an app.

   FUNCTIONS
   A function is a named, reusable block of code you can "call" (run)
   whenever you need it, optionally handing it some input:

       function greet(name) {
         console.log('Hello, ' + name);
       }
       greet('Sam');   // runs the code inside greet, logs "Hello, Sam"

   You'll also see "anonymous functions" below — functions with no
   name of their own, written inline exactly where they're needed:

       button.addEventListener('click', function () {
         console.log('clicked!');
       });

   Here, function () { ... } is a whole function with no name,
   created on the spot and handed directly to addEventListener as
   its second input. This pattern (a function used as a piece of
   data, passed into another function) is extremely common in
   JavaScript and is worth getting comfortable reading.

   EVENTS AND addEventListener
   An "event" is something that happens in the browser — a click, a
   key press, the page finishing loading, the user scrolling, etc.
   addEventListener is how you tell an element "when THIS event
   happens to you, run THIS function":

       someElement.addEventListener('click', function () {
         // this code runs every time someElement is clicked
       });

   The function you provide is often called a "callback" — you're
   not running it yourself, you're handing it to the browser and
   saying "call this back later, when the event happens."

   SELECTING ELEMENTS
   Before you can react to or change something, you need to grab a
   reference to it from the DOM. The main ways used in this file:
   - document.getElementById('someId') — finds the one element whose
     HTML has id="someId" (remember: ids must be unique on the page)
   - document.querySelector('header') — finds the FIRST element
     matching a CSS-style selector (works with tag names, .classes,
     #ids — any valid CSS selector text)
   - someElement.querySelectorAll('.nav-link') — like querySelector,
     but returns EVERY matching element (as a list you can loop over),
     not just the first one

   IF STATEMENTS
   if (condition) { ... } only runs the code inside the braces when
   condition evaluates to true — used below to check things like
   "does this element actually exist on the page?" before trying to
   use it, and "is the menu currently open?" before closing it.

   WAITING FOR THE PAGE TO LOAD: DOMContentLoaded
   If a <script> tries to grab an element before the browser has
   finished reading that part of the HTML, it will fail to find it
   (since it doesn't exist in the DOM yet). Wrapping our whole file in:

       document.addEventListener('DOMContentLoaded', function () {
         // all our code goes in here
       });

   tells the browser "wait until the entire HTML document has been
   read and built into the DOM, THEN run this code" — guaranteeing
   every element we try to grab (the navbar, the header, etc.)
   actually exists by the time our code runs.
   =====================================================================
*/

/* =====================================================================
   YOUTUBE API KEY — for the auto-updating "Latest Sermon" embed
   =====================================================================
   WHAT THIS IS FOR: the "Latest Sermon" video on our-church.html and
   media.html can either (a) stay fixed on one manually-chosen video
   forever, or (b) genuinely auto-update to whatever the newest video
   on the channel is, every time someone loads the page — but option
   (b) requires a free API key from Google, since that's the only
   reliable way to ask YouTube "what's the latest upload?" without
   running your own backend server.

   Until a real key is pasted in below, YOUTUBE_API_KEY stays as an
   empty string and the sermon embeds simply keep showing their last
   confirmed-working fallback video (currently set directly in each
   page's HTML) — nothing breaks, it just won't auto-update yet.

   FULL SETUP GUIDE (free, no credit card required, ~5 minutes,
   one-time — you will not need to repeat this):

     STEP 1 — Create a Google Cloud project
       Go to https://console.cloud.google.com in your browser.
       Sign in with any Google account. If this is your first time
       here, click "Select a project" (top left) → "New Project" →
       give it any name (e.g. "Life Ministries Website") → Create.
       It only takes a few seconds to set up.

     STEP 2 — Enable the YouTube Data API v3
       With your new project selected, use the search bar at the top
       of the page and type "YouTube Data API v3". Click it in the
       results, then click the blue "Enable" button. This turns the
       API on for your project — it's off by default.

     STEP 3 — Create an API key
       In the left sidebar, go to "APIs & Services" → "Credentials".
       Click "+ Create Credentials" (near the top) → "API key".
       Google will generate a key immediately and show it to you —
       it looks like a long string of random letters and numbers,
       e.g. AIzaSyD4f9-examplekey1234567890.
       Copy that key somewhere safe for a moment.

     STEP 4 — Restrict the key (important — do not skip this)
       Right after creating it, click "Edit API key" (or find it in
       your Credentials list and click on it).
       Under "Application restrictions", choose "Websites" (also
       called "HTTP referrers").
       Add your site's real domain, e.g.:
         lifeministries.co.za/*
         www.lifeministries.co.za/*
       This means the key will ONLY work when requests come from your
       actual website — so even though this key lives in public,
       visible JavaScript code (which is unavoidable for any
       browser-side API call), nobody else can take it and use it on
       a different site. This restriction is what makes it safe to
       use here. Click "Save".

     STEP 5 — Paste the key in
       Copy the key from Step 3 and paste it as the value of
       YOUTUBE_API_KEY below, between the quote marks, e.g.:
         var YOUTUBE_API_KEY = "AIzaSyD4f9-examplekey1234567890";
       Save this file. That's it — no other code changes needed.
       Reload our-church.html or media.html and the sermon embed
       should now automatically show the channel's actual newest
       video, and will keep doing so on every future upload with
       zero further maintenance.

     TROUBLESHOOTING: if it still doesn't update after adding a key,
     open your browser's DevTools Console (F12) on the page — any
     problem (wrong key, restriction misconfigured, quota used up)
     will log a warning there starting with "YouTube API..." to help
     you pinpoint what's wrong. The free quota (10,000 units/day) is
     far more than a small site like this will ever use.
   ===================================================================== */
var YOUTUBE_API_KEY = "";
var YOUTUBE_CHANNEL_ID = "UC44tvG1QtsGZd-dPXgL7Evg";

/* =====================================================================
   DEVELOPER NOTES — script.js
   This file holds custom JavaScript for the site. The mobile menu
   toggle itself is already handled automatically by Bootstrap's own
   JS bundle (bootstrap.bundle.min.js) via the data-bs-toggle
   attributes in index.html — we do NOT need to write that ourselves.

   This file currently handles two small, genuinely useful things:
     1. Auto-closing the mobile menu after a link is tapped.
     2. Adding a subtle "scrolled" style to the sticky navbar once the
        visitor scrolls down, so it's easy to extend later (e.g. add
        a drop shadow or shrink the logo) without touching the HTML.

   Everything is wrapped in a DOMContentLoaded listener so it only
   runs once the page's HTML has fully loaded (see the primer above
   if that sentence didn't make sense yet).
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* -------------------------------------------------------------------
     1. AUTO-CLOSE MOBILE MENU ON LINK CLICK
     By default, Bootstrap's collapsible navbar stays open after you
     tap a link on mobile until you tap the hamburger icon again.
     This finds every link inside the collapsible menu and closes the
     menu automatically once one is clicked — a small usability fix
     that most visitors expect on mobile.
     ------------------------------------------------------------------- */

  // Step 1: grab the collapsible menu <div> itself (it has
  // id="mainNavbar" in index.html — search for that id there).
  var mobileMenu = document.getElementById('mainNavbar');

  // Step 2: only proceed if that element actually exists. This is a
  // defensive habit worth building: getElementById returns null (an
  // empty, "nothing found" value) if no matching id exists, and
  // trying to use methods like .querySelectorAll() on null would
  // crash the script with an error. Checking "if (mobileMenu)" first
  // means: only run this block if mobileMenu is a real element.
  if (mobileMenu) {

    // Step 3: find every link INSIDE that menu. querySelectorAll
    // returns a list-like collection of every match — in index.html
    // that's the 4 nav links (Home / Our Church / Our School /
    // Contact Us), each of which has class="nav-link".
    var menuLinks = mobileMenu.querySelectorAll('.nav-link');

    // Step 4: .forEach() runs the function you give it once for
    // EACH item in that list — so the code inside runs 4 times here,
    // once per link, with "link" standing in for whichever one it's
    // currently processing.
    menuLinks.forEach(function (link) {

      // Step 5: attach a click listener to THIS link. Every time a
      // visitor clicks/taps it, the function below runs.
      link.addEventListener('click', function () {

        // Only collapse if the menu is currently open (i.e. we're on
        // a small screen where Bootstrap has added the "show" class).
        // classList.contains('show') checks whether that specific
        // CSS class is currently present on the element — Bootstrap
        // itself adds/removes "show" automatically when the menu
        // opens/closes, so we're just reading its current state.
        if (mobileMenu.classList.contains('show')) {

          // getOrCreateInstance is Bootstrap's own JavaScript API for
          // controlling one of its components programmatically — it
          // hands back a "Collapse" object connected to mobileMenu,
          // and calling .hide() on that object closes the menu, the
          // same as if the visitor had clicked the hamburger icon.
          var bsCollapse = bootstrap.Collapse.getOrCreateInstance(mobileMenu);
          bsCollapse.hide();
        }
      });
    });
  }

  /* -------------------------------------------------------------------
     2. STICKY NAVBAR "SCROLLED" STATE
     Adds a class "navbar-scrolled" to the header once the visitor has
     scrolled down more than 10px, and removes it when they scroll
     back to the top. On the homepage, style.css uses this class to
     switch the transparent-over-hero navbar to a solid white one —
     see style.css section 12.
     ------------------------------------------------------------------- */

  // querySelector (singular) grabs just the FIRST matching element —
  // fine here since there's only ever one <header> on the page.
  var header = document.querySelector('header');

  if (header) {
    // "scroll" is an event that fires repeatedly while the visitor
    // is scrolling the page — unlike "click", which fires once per
    // click, this can fire many times per second during a scroll.
    window.addEventListener('scroll', function () {

      // window.scrollY tells us how many pixels the visitor has
      // scrolled down from the very top of the page (0 = top).
      if (window.scrollY > 10) {
        // classList.add() attaches a CSS class to this element —
        // exactly as if we'd typed class="navbar-scrolled" by hand
        // in the HTML, except it happens dynamically in response to
        // scrolling. Any CSS rule targeting .navbar-scrolled in
        // style.css would now apply to the header.
        header.classList.add('navbar-scrolled');
      } else {
        // classList.remove() does the opposite — takes the class
        // back off once the visitor scrolls back near the top.
        header.classList.remove('navbar-scrolled');
      }
    });

    // LEARNING NOTE: style.css also has a CSS-only ":has()" rule that
    // forces the solid nav state while the mobile menu is open, but
    // :has() is a fairly new CSS feature not every browser supports
    // yet. This listens for Bootstrap's own custom events —
    // "shown.bs.collapse" (finished opening) and "hidden.bs.collapse"
    // (finished closing) — fired on the collapsible menu itself, and
    // does the same job in JavaScript as a reliable fallback.
    var mainNavbarEl = document.getElementById('mainNavbar');
    if (mainNavbarEl) {
      mainNavbarEl.addEventListener('shown.bs.collapse', function () {
        header.classList.add('navbar-scrolled');
      });
      mainNavbarEl.addEventListener('hidden.bs.collapse', function () {
        // Only remove the forced state if the visitor is still
        // actually at the top of the page — if they'd scrolled down
        // before opening the menu, it should stay solid after closing.
        if (window.scrollY <= 10) {
          header.classList.remove('navbar-scrolled');
        }
      });
    }
  }

  /* -------------------------------------------------------------------
     3. EXPLICITLY START THE PHOTO CAROUSEL
     THE BUG THIS FIXES: Bootstrap 5.2+ deliberately refuses to
     auto-cycle a carousel if the visitor's operating system has a
     "reduce motion" accessibility setting turned on — clicking the
     arrows still works (that's a direct user action), but the
     automatic timer never starts on its own. That matches exactly
     what "doesn't auto-start unless I click next" looks like.
     THE FIX: instead of relying on Bootstrap's own built-in auto-play
     (which respects that OS setting on purpose), we drive the
     rotation ourselves with a plain JavaScript timer and call
     .next() on the carousel manually. This intentionally overrides
     that accessibility behaviour for this decorative photo carousel
     — a reasonable choice here since the carousel has no essential
     information that isn't otherwise available on the page.
     ------------------------------------------------------------------- */
  var infoCarouselEl = document.getElementById('infoCarousel');
  if (infoCarouselEl) {
    // Get (or create) Bootstrap's Carousel object for this element,
    // so we can call its .next() method ourselves on our own timer.
    var infoCarousel = bootstrap.Carousel.getOrCreateInstance(infoCarouselEl, {
      pause: 'hover', // still pause while the visitor's mouse hovers over it
      wrap: true        // loop back to slide 1 after the last slide
    });

    // setInterval runs the given function repeatedly, every X
    // milliseconds (4200ms here = 30% faster than the original
    // 6000ms), for as long as the page stays open. It returns an ID
    // we could use to stop it later with clearInterval() if needed.
    var carouselTimerId = setInterval(function () {
      infoCarousel.next();
    }, 4200);

    // Since our manual timer bypasses Bootstrap's own pause-on-hover
    // handling, we re-implement it by hand: pause our timer when the
    // mouse enters the carousel, and restart it when the mouse
    // leaves — so hovering to read a caption still works as expected.
    infoCarouselEl.addEventListener('mouseenter', function () {
      clearInterval(carouselTimerId);
    });
    infoCarouselEl.addEventListener('mouseleave', function () {
      carouselTimerId = setInterval(function () {
        infoCarousel.next();
      }, 4200);
    });
  }

  /* -------------------------------------------------------------------
     4. SCROLL-REVEAL ANIMATION
     THE GOAL: elements with the class "reveal-on-scroll" (see
     style.css section 11) start hidden and slightly lowered. As the
     visitor scrolls down and one of them enters the viewport, we add
     the class "is-visible", which triggers the CSS transition to
     fade/slide it into place — giving the page a more polished,
     "arriving" feel instead of everything just being visible at once
     from the very top.

     LEARNING NOTE: IntersectionObserver is a browser API purpose-built
     for exactly this kind of task — detecting when an element enters
     or leaves the visible viewport. It's far more efficient than the
     older technique of listening to the "scroll" event and manually
     checking every element's position on every single scroll tick
     (which can fire dozens of times a second and bog down the page).
     The observer instead does that checking internally and only
     calls OUR function when something actually changes.
     ------------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll('.reveal-on-scroll');

  if (revealTargets.length && 'IntersectionObserver' in window) {
    // The callback function runs whenever an observed element crosses
    // the viewport boundary (entering OR leaving) — "entries" is a
    // list of every element that just changed state.
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        // isIntersecting is true once the element has scrolled into
        // view (by default, as soon as even 1 pixel of it is visible).
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once revealed, we don't need to keep watching this
          // element — unobserve() stops the browser doing any more
          // work checking it, which is a small but free performance win.
          observer.unobserve(entry.target);
        }
      });
    });

    revealTargets.forEach(function (target) {
      revealObserver.observe(target);
    });
  } else if (revealTargets.length) {
    // Fallback for the rare case IntersectionObserver isn't supported:
    // just show everything immediately rather than leaving it hidden.
    revealTargets.forEach(function (target) {
      target.classList.add('is-visible');
    });
  }

  /* -------------------------------------------------------------------
     5. CONTACT FORM SUBMISSION (contact.html only)
     Submits the form to Formspree in the background using fetch()
     instead of letting the browser do a normal full-page-reload
     submission. This is what lets us show a friendly "Message sent!"
     confirmation ON THE SAME PAGE instead of navigating the visitor
     away to a blank Formspree confirmation page.
     LEARNING NOTE: fetch() is the modern way to make a network
     request from JavaScript. It returns a "Promise" — an object
     representing a result that isn't ready yet but will be at some
     point. .then() runs once that result arrives; .catch() runs
     instead if something went wrong (e.g. no internet connection).
     async/await (used here) is newer, more readable syntax for
     working with Promises — "await" pauses this function until the
     fetch finishes, without freezing the rest of the page/browser.
     ------------------------------------------------------------------- */
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    var formStatus = document.getElementById('formStatus');
    var submitBtn = document.getElementById('contactSubmitBtn');

    // "submit" fires when the visitor clicks the Send button (or
    // presses Enter in a field) — before the browser's own default
    // full-page-reload behaviour happens.
    contactForm.addEventListener('submit', async function (event) {
      // preventDefault() stops that default reload behaviour, since
      // we're handling the submission ourselves with fetch() instead.
      event.preventDefault();

      // Disable the button and change its text while sending, so the
      // visitor gets feedback that something is happening and can't
      // accidentally submit the form twice by clicking again.
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        // FormData automatically collects every named field's current
        // value from the form — we don't have to list each one by hand.
        var formData = new FormData(contactForm);

        var response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          // response.ok is true for any successful (2xx) HTTP status
          formStatus.textContent = "Thanks! Your message has been sent — we'll be in touch soon.";
          formStatus.className = 'alert alert-success';
          contactForm.reset(); // clears all the fields back to empty
        } else {
          formStatus.textContent = 'Something went wrong sending your message. Please try again, or email us directly at admin@lifeministries.co.za.';
          formStatus.className = 'alert alert-danger';
        }
      } catch (error) {
        // This catch block runs if fetch() itself failed entirely —
        // most commonly, no internet connection.
        formStatus.textContent = "Couldn't send your message — please check your internet connection and try again.";
        formStatus.className = 'alert alert-danger';
      }

      // Un-hide the status message (it starts with the "d-none"
      // Bootstrap class in the HTML, which we now remove) and reset
      // the button back to normal either way.
      formStatus.classList.remove('d-none');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    });
  }

  /* -------------------------------------------------------------------
     6. AUTO-UPDATING "LATEST SERMON" (only runs if a sermonFrame
     iframe exists on the current page — our-church.html and
     media.html both have one).
     LEARNING NOTE: this is the same fetch()/async-await pattern used
     for the contact form above (section 5), just calling a different
     API. YouTube's "search" endpoint, given a channel ID and
     order=date, returns that channel's videos newest-first — we only
     ask for maxResults=1, so we get back exactly the latest video's
     details, including its ID, which we then use to update the
     iframe's src.
     ------------------------------------------------------------------- */
  var sermonFrames = document.querySelectorAll('#sermonFrame');

  if (sermonFrames.length && YOUTUBE_API_KEY) {
    (async function updateLatestSermon() {
      try {
        var apiUrl = 'https://www.googleapis.com/youtube/v3/search'
          + '?key=' + encodeURIComponent(YOUTUBE_API_KEY)
          + '&channelId=' + encodeURIComponent(YOUTUBE_CHANNEL_ID)
          + '&part=snippet&order=date&maxResults=1&type=video';

        var response = await fetch(apiUrl);

        if (!response.ok) {
          // Quota exceeded, invalid/unrestricted key rejected, etc. —
          // fail quietly and just keep showing the fallback video
          // already sitting in the HTML, rather than breaking the
          // page or showing an error to the visitor.
          console.warn('YouTube API request failed — showing fallback sermon video instead.');
          return;
        }

        var data = await response.json();

        // Defensive check: only proceed if the API actually returned
        // at least one video result in the expected shape.
        if (data.items && data.items.length > 0) {
          var latestVideoId = data.items[0].id.videoId;
          var newSrc = 'https://www.youtube-nocookie.com/embed/' + latestVideoId;

          // Update EVERY sermonFrame on the page (there's only ever
          // one per page currently, but querySelectorAll + forEach
          // means this keeps working even if a page ever has more).
          sermonFrames.forEach(function (frame) {
            frame.src = newSrc;
          });
        }
      } catch (error) {
        // Network failure, no internet, etc. — same quiet fallback
        // behaviour as above.
        console.warn('Could not reach YouTube API — showing fallback sermon video instead.');
      }
    })();
  }

});
