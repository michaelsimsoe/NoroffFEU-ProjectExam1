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
        sorted.forEach(item => {
          makeDisplayItem(item, side);
          console.log(item.isHistoryEvent, side === 'left');
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
  return {
    date,
    dateString,
    title,
    isLaunch,
    isHistoryEvent,
    text
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
  return {
    date,
    dateString,
    title,
    isLaunch,
    isHistoryEvent,
    text
  };
}

function makeDisplayItem(item, side = null) {
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
      <a href="/single" class="btn btn__cta b-timeline__item__btn">Read More</a>
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
var logo = document.querySelector('.b-header__main-logo');
console.log(clouds);
var header = document.querySelector('.b-header');
var lastScrollTop = 0;
// element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
window.addEventListener(
  'scroll',
  function() {
    // or window.addEventListener("scroll"....
    var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    var scaleValue = st / 100;
    console.log(st);
    clouds.style.transform = `translate(-50%,${-40 +
      Math.floor((st / 10) * 6)}%) scale(${1 + Number(scaleValue)})`;

    // Could this be solved with the intersection observer?
    if (st > 11) {
      logo.classList.remove('b-header__main-logo--intro');
      header.classList.remove('b-header--intro');
    } else {
      logo.classList.add('b-header__main-logo--intro');
      header.classList.add('b-header--intro');
    }
    if (st > 170) {
      launchedRocket.classList.remove('b-takeoff__rocket-launched--hidden');
    } else {
      launchedRocket.classList.add('b-takeoff__rocket-launched--hidden');
    }

    if (st > 1200) {
      clouds.style.display = 'none';
    } else {
      clouds.style.display = 'block';
    }
    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
  },
  false
);

// clouds.style.display = 'none';
const launchBtn = document.getElementById('launch_button');
const timeline = document.getElementById('timeline');

launchBtn.addEventListener('click', function(e) {
  e.preventDefault();
  timeline.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  });
});
