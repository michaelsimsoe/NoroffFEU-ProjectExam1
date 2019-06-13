var container = document.querySelector('.b-timeline');
// container.style.display = 'none';
var eventArray = [];
fetch('https://api.spacexdata.com/v3/history')
  .then(res => {
    console.log(res);
    if (res.ok) {
      return res;
    }
    throw Error(res.statusText);
  })
  .then(res => res.json())
  .then(data =>
    data.forEach(event => eventArray.push(makeHistoricalEvent(event)))
  )
  .catch(
    error => console.log(error)
    // displayMessage(
    //   `Sorry. An error occured while we tried to fetch the cards ${
    //     error.statusText ? ': ' + error.statusText : '.'
    //   }`,
    //   'danger'
    // )
  )
  .then(
    fetch('https://api.spacexdata.com/v3/launches')
      .then(res => {
        console.log(res);
        if (res.ok) {
          return res;
        }
        throw Error(res.statusText);
      })
      .then(res => res.json())
      .then(data =>
        data.forEach(event => eventArray.push(makeLaunchElement(event)))
      )
      .then(() => {
        var sorted = eventArray.sort((a, b) => (a.date > b.date ? 1 : -1));
        let side = 'left';
        sorted.forEach((item, index) => {
          makeDisplayItem(item, side, index);
          if (item.isHistoryEvent) {
            side === 'left' ? (side = 'right') : (side = 'left');
          }
        });
      })
      .catch(
        error => console.log(error)
        // displayMessage(
        //   `Sorry. An error occured while we tried to fetch the cards ${
        //     error.statusText ? ': ' + error.statusText : '.'
        //   }`,
        //   'danger'
        // )
      )
  );

function makeHistoricalEvent(event) {
  var date = new Date(event.event_date_utc);
  var dateString = date.toDateString();
  var title = event.title;
  var isLaunch = event.flight_number != null ? true : false;
  var isHistoryEvent = true;
  var text = event.details;
  var id = event.id;
  return {
    date,
    dateString,
    title,
    isLaunch,
    isHistoryEvent,
    text,
    id,
    eventType: 'history'
  };
}

function makeLaunchElement(launch) {
  var details = launch.details;
  var date = new Date(launch.launch_date_utc);
  var dateString = date.toDateString();
  var title = launch.mission_name;
  var isLaunch = true;
  var isHistoryEvent = false;
  var text = details;
  var id = launch.id;
  return {
    date,
    dateString,
    title,
    isLaunch,
    isHistoryEvent,
    text,
    id,
    eventType: 'launches'
  };
}

function makeDisplayItem(item, side = null, index) {
  container.innerHTML += `
    <article class="
    b-timeline__item
    ${
      item.isHistoryEvent
        ? `b-timeline__item__event b-timeline__item__event-${side}`
        : 'b-timeline__item__launch'
    }
    ">
      ${
        item.isLaunch
          ? '<div class="b-timeline__item__launch-true"><h3>LAUNCH</h3></div>'
          : ''
      }
      ${
        item.isHistoryEvent
          ? '<div class="b-timeline__item__img"><img src="img/falcon.jpg"></div>'
          : ''
      }
      <div class="b-timeline__item__content">
      <h2 class="b-timeline__item__date">${item.dateString}</h2>
      <h3 class="b-timeline__item__title">${item.title}</h3>
      ${
        item.text
          ? '<p class="b-timeline__item__text">' +
            limitTextTo140`${item.text}` +
            '</p>'
          : ''
      }
      <a href="/single/?type=${item.eventType}&id=${item.id}" tabindex="${
    index == 4 ? '7' : ''
  }" class="btn btn__cta b-timeline__item__btn">Read More</a>
      </div>
    </article>
  `;
}

function limitTextTo140(string, text) {
  if (text.length < 70) {
    return text;
  } else {
    return text.substring(0, 67) + '...';
  }
}

var hero = document.querySelector('.takeoff-container');
var clouds = document.querySelector('.b-takeoff__cluds');
var launchedRocket = document.querySelector('.b-takeoff__rocket-launched');
var groundRocket = document.querySelector('.b-takeoff__rocket');
var logo = document.querySelector('.b-header__main-logo');
var header = document.querySelector('.b-header');

var launchControll = document.querySelector('.b-takeoff__controll');

var mobileMenu = document.querySelector('.b-mobile-menu');
var mobileMenuInitLogo = document.querySelector(
  '.b-mobile-menu__main-logo a h1'
);
var activeMobileLink = document.querySelector('.b-mobile-menu__link--active');

var lastScrollTop = 0;
var mediaQuery770 = window.matchMedia('(min-width: 770px)');
// element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
window.addEventListener(
  'scroll',
  function() {
    // or window.addEventListener("scroll"....
    var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    var moveValue;
    var scaleValue = st / 100;
    // console.log(st);

    if (mediaQuery770.matches) {
      scaleValue = st / 10;
      moveValue = -40 + Math.floor(st * 5);
      if (scaleValue > 7) scaleValue = 7;
      if (moveValue > 1100) moveValue = 1100;
      clouds.style.transform = `translate(-50%,${moveValue}%) scale(${1 +
        Number(scaleValue)})`;
      // clouds.style.transform = `translate(-50%,${-40 +
      //   Math.floor((st / 10) * 4)}%) scale(${1 + Number(scaleValue)})`;
    } else {
      scaleValue = st / 10;
      moveValue = -40 + Math.floor(st * 5);
      if (scaleValue > 6) scaleValue = 6;
      if (moveValue > 1000) moveValue = 1000;
      clouds.style.transform = `translate(-50%,${moveValue}%) scale(${1 +
        Number(scaleValue)})`;
    }
    // Could this be solved with the intersection observer?
    if (st > 11) {
      logo.classList.remove('b-header__main-logo--intro');
      header.classList.remove('b-header--intro');
      mobileMenu.classList.remove('b-mobile--init');
      mobileMenuInitLogo.classList.remove('b-mobile-menu__main-logo--init');
      launchControll.style.display = 'none';
      activeMobileLink.classList.remove('b-mobile--init');
    } else {
      logo.classList.add('b-header__main-logo--intro');
      header.classList.add('b-header--intro');
      mobileMenu.classList.add('b-mobile--init');
      mobileMenuInitLogo.classList.add('b-mobile-menu__main-logo--init');
      launchControll.style.display = 'grid';
      activeMobileLink.classList.add('b-mobile--init');
    }

    if (mediaQuery770.matches) {
      if (st > 90) {
        groundRocket.classList.add('b-takeoff__rocket-launched--hidden');
        launchedRocket.classList.remove('b-takeoff__rocket-launched--hidden');
      } else {
        groundRocket.classList.remove('b-takeoff__rocket-launched--hidden');
        launchedRocket.classList.add('b-takeoff__rocket-launched--hidden');
      }
    } else {
      if (st > 70) {
        groundRocket.classList.add('b-takeoff__rocket-launched--hidden');
        launchedRocket.classList.remove('b-takeoff__rocket-launched--hidden');
      } else {
        groundRocket.classList.remove('b-takeoff__rocket-launched--hidden');
        launchedRocket.classList.add('b-takeoff__rocket-launched--hidden');
      }
    }

    if (mediaQuery770.matches) {
      if (st > 1200) {
        clouds.classList.add('b-takeoff__cluds--hidden');
      } else {
        clouds.classList.remove('b-takeoff__cluds--hidden');
      }
    } else {
      if (st > 340) {
        clouds.classList.add('b-takeoff__cluds--hidden');
      } else {
        clouds.classList.remove('b-takeoff__cluds--hidden');
      }
    }

    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
  },
  false
);

const launchBtn = document.getElementById('launch_button');
const timeline = document.getElementById('timeline');
const timelineTop = timeline.getBoundingClientRect().top;
var timer = document.querySelector('.b-takeoff__controll-timer__time');

console.log(timeline.offsetTop);
launchBtn.addEventListener('click', function(e) {
  e.preventDefault();
  countDown(timer, 10);
  console.log(timelineTop);
  setTimeout(function() {
    scrollDown(200, 600);
    console.log(timelineTop);
  }, 1000);
  console.log('Scrolling');
});

function scrollDown(px, stop) {
  if (document.documentElement.scrollTop >= stop) {
    scrollIntoView();
    return;
  }
  if (document.documentElement.scrollTop === 200) {
    console.log('Removes cloud');
    clouds.classList.add('b-takeoff__cluds--hidden');
  }
  setTimeout(function() {
    document.documentElement.scrollTop += px;
    scrollDown(px + 10, stop);
  }, 100);
}

function scrollIntoView() {
  setTimeout(function() {
    console.log('Scrolling into view');
    window.scrollTo({
      top: timelineTop,
      left: 0,
      behavior: 'smooth'
    });
  }, 400);
}

function countDown(el, time) {
  if (time < 0) return scrollDown(200, 600);
  console.log(el, time);
  setTimeout(() => {
    el.innerHTML = `${time.toString()}:00`;
    countDown(el, time - 1);
  }, 100);
}

var timelineRocket = document.getElementById('timeline-rocket');

if (!!window.IntersectionObserver) {
  console.log('observing');
  let observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log(entry);
          addRocket();
          console.log('REMOVING', timelineRocket);
        } else {
          document
            .getElementById('timeline-rocket')
            .classList.add('b-timeline__rocket--hidden');
        }
      });
    },
    {
      rootMargin: '0px 0px -50% 0px'
    }
  );
  observer.observe(document.querySelector('#timeline'));
}

function addRocket() {
  console.log('ADDDDDDINNNG!');
  document
    .getElementById('timeline-rocket')
    .classList.remove('b-timeline__rocket--hidden');
}
