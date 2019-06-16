(function() {
  /*
   * The following fetch gets the events and launches from the SpaceX APU
   * There are two fetches here, one for event and one for launches. The last on
   * is nested inside the first one.
   * The result of the fetch is appended to the DOM
   */
  var container = document.querySelector('.b-timeline');
  var eventArray = [];

  fetch('https://api.spacexdata.com/v3/history')
    .then(res => {
      if (res.ok) {
        return res;
      }
      throw Error(res.statusText);
    })
    .then(res => res.json())
    .then(data =>
      data.forEach(event => eventArray.push(makeHistoricalEvent(event)))
    )
    .catch(error => {
      errorFromApi();
    })
    .then(
      fetch('https://api.spacexdata.com/v3/launches')
        .then(res => {
          res;
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
          launchReady();
        })
        .catch(error => {
          errorFromApi();
        })
    );

  /*
   * When the API fetching is finished, the launch
   * controll panel is ready to be used
   */
  function launchReady() {
    var controllPanel = document.querySelector('.b-takeoff__controll');
    var controllTitle = document.querySelector('.b-takeoff__controll-title h3');
    var timer = document.querySelector('.b-takeoff__controll-timer__time');
    var launchButton = document.querySelector(
      '.b-takeoff__controll-btn__button'
    );

    controllPanel.classList.remove('b-takeoff__controll-preparing');
    controllTitle.innerHTML = 'Ready to Launch';
    timer.innerHTML = '10:00';
    launchButton.disabled = false;
    launchButton.classList.remove('b-takeoff__controll-btn__button-disabled');
    launchButton.innerHTML = 'Launch';
  }

  /*
   * If the API fetching fails it will be communicated
   * through the launch controll panel
   */
  function errorFromApi() {
    var controllPanel = document.querySelector('.b-takeoff__controll');
    var controllTitle = document.querySelector('.b-takeoff__controll-title h3');
    var timer = document.querySelector('.b-takeoff__controll-timer__time');
    var launchButton = document.querySelector(
      '.b-takeoff__controll-btn__button'
    );

    controllTitle.innerHTML = 'ERROR from SERVER';
    timer.innerHTML = 'xx:xx';
    launchButton.disabled = false;
    launchButton.classList.remove('b-takeoff__controll-btn__button-disabled');
    launchButton.innerHTML = 'Shut down';
  }

  /*
   * Using the data from the API fetch to create
   * an historical event object
   */

  function makeHistoricalEvent(event) {
    var date = new Date(event.event_date_utc);
    var dateTime =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    var dateString = date.toDateString();
    var title = event.title;
    var isLaunch = event.flight_number != null ? true : false;
    var isHistoryEvent = true;
    var text = event.details;
    var id = event.id;
    return {
      date,
      dateTime,
      dateString,
      title,
      isLaunch,
      isHistoryEvent,
      text,
      id,
      eventType: 'history'
    };
  }

  /*
   * Using the data from the API fetch to create
   * a launch event object
   */
  function makeLaunchElement(launch) {
    var details = launch.details;
    var date = new Date(launch.launch_date_utc);
    var dateTime =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    var dateString = date.toDateString();
    var title = launch.mission_name;
    var isLaunch = true;
    var isHistoryEvent = false;
    var text = details;
    var id = launch.flight_number;
    return {
      date,
      dateTime,
      dateString,
      title,
      isLaunch,
      isHistoryEvent,
      text,
      id,
      eventType: 'launches'
    };
  }

  /*
   * This function creates the timeline elements and appends
   * them to the DOM
   */
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
      <div class="b-timeline__item__content">
      <h2 class="b-timeline__item__date"><time datetime="${item.dateTime}">${
      item.dateString
    }</time></h2>
      <h3 class="b-timeline__item__title">${item.title}</h3>
      ${
        item.text
          ? '<p class="b-timeline__item__text">' +
            limitTextTo140`${item.text}` +
            '</p>'
          : ''
      }
      <a href="single/?type=${item.eventType}&id=${item.id}" tabindex="${
      index == 4 ? '7' : ''
    }" class="btn btn__cta b-timeline__item__btn">Read More</a>
      </div>
    </article>
  `;
  }

  /*
   * A html tag template literal to shorten text to a give length
   * Used inside makeDisplayItem to limit details to < 70 chars
   */
  function limitTextTo140(string, text) {
    if (text.length < 70) {
      return text;
    } else {
      return text.substring(0, 67) + '...';
    }
  }

  /*
   * Function to display how much is left in order to scroll all the way to the bottom
   *
   */
  function scrollPercent() {
    var winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    var height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;

    if (scrolled < 98) {
      document.querySelector('.progress').style.display = 'block';
      document.querySelector('.progress').innerHTML =
        Math.floor(scrolled) + '%';
    }

    if (scrolled > 50 && scrolled < 60) {
      document.querySelector('.progress').innerHTML = 'Half way to Mars!';
    }

    if (scrolled > 90) {
      document.querySelector('.progress').innerHTML = 'Landing...';
    }
    if (scrolled === 100) {
      document.querySelector('.progress').style.display = 'none';
    }
  }

  /*
   * This beast controlls most of the action on the main page
   * Behavior based on scroll position and media width
   */
  var clouds = document.querySelector('.b-takeoff__cluds');
  var subheading = document.querySelector('.b-takeoff__sub');
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
  var mediaQuery770 = window.matchMedia('(min-width: 770px)');

  window.addEventListener(
    'scroll',
    function() {
      scrollPercent();
      var scrollTop = document.documentElement.scrollTop;
      var moveValue;
      var scaleValue = scrollTop / 100;

      // Could all of this be solved with the intersection observer?
      if (mediaQuery770.matches) {
        scaleValue = scrollTop / 10;
        moveValue = -40 + Math.floor(scrollTop * 5);
        if (scaleValue > 7) scaleValue = 7;
        if (moveValue > 1100) moveValue = 1100;
        clouds.style.transform = `translate(-50%,${moveValue}%) scale(${1 +
          Number(scaleValue)})`;
      } else {
        scaleValue = scrollTop / 10;
        moveValue = -40 + Math.floor(scrollTop * 5);
        if (scaleValue > 6) scaleValue = 6;
        if (moveValue > 1000) moveValue = 1000;
        clouds.style.transform = `translate(-50%,${moveValue}%) scale(${1 +
          Number(scaleValue)})`;
      }

      if (scrollTop > 11) {
        subheading.style.display = 'none';
        logo.classList.remove('b-header__main-logo--intro');
        header.classList.remove('b-header--intro');
        mobileMenu.classList.remove('b-mobile--init');
        mobileMenuInitLogo.classList.remove('b-mobile-menu__main-logo--init');
        launchControll.style.display = 'none';
        activeMobileLink.classList.remove('b-mobile--init');
      } else {
        subheading.style.display = 'block';
        logo.classList.add('b-header__main-logo--intro');
        header.classList.add('b-header--intro');
        mobileMenu.classList.add('b-mobile--init');
        mobileMenuInitLogo.classList.add('b-mobile-menu__main-logo--init');
        launchControll.style.display = 'grid';
        activeMobileLink.classList.add('b-mobile--init');
      }

      if (mediaQuery770.matches) {
        if (scrollTop > 90) {
          groundRocket.classList.add('b-takeoff__rocket-launched--hidden');
          launchedRocket.classList.remove('b-takeoff__rocket-launched--hidden');
        } else {
          groundRocket.classList.remove('b-takeoff__rocket-launched--hidden');
          launchedRocket.classList.add('b-takeoff__rocket-launched--hidden');
        }
      } else {
        if (scrollTop > 70) {
          groundRocket.classList.add('b-takeoff__rocket-launched--hidden');
          launchedRocket.classList.remove('b-takeoff__rocket-launched--hidden');
        } else {
          groundRocket.classList.remove('b-takeoff__rocket-launched--hidden');
          launchedRocket.classList.add('b-takeoff__rocket-launched--hidden');
        }
      }

      if (mediaQuery770.matches) {
        if (scrollTop > 1200) {
          clouds.classList.add('b-takeoff__cluds--hidden');
        } else {
          clouds.classList.remove('b-takeoff__cluds--hidden');
        }
      } else {
        if (scrollTop > 340) {
          clouds.classList.add('b-takeoff__cluds--hidden');
        } else {
          clouds.classList.remove('b-takeoff__cluds--hidden');
        }
      }

      if (mediaQuery770.matches) {
        if (scrollTop > 2500) {
          document.querySelector('.b-takeoff__bg').style.display = 'none';
        } else {
          document.querySelector('.b-takeoff__bg').style.display = 'block';
        }
      } else {
        if (scrollTop > 1000) {
          document.querySelector('.b-takeoff__bg').style.display = 'none';
        } else {
          document.querySelector('.b-takeoff__bg').style.display = 'block';
        }
      }
    },
    false
  );

  /*
   * Scrolls down to the timeline when the launch button is clicked
   * Most of the numbers are based on trial and error
   * Initally solved with scrollTo/scrollintoView and CSS smooth scroll
   * but the pace was to great so the animation was lost
   */
  const launchBtn = document.getElementById('launch_button');
  const timeline = document.getElementById('timeline');
  const timelineTop = timeline.getBoundingClientRect().top;
  var timer = document.querySelector('.b-takeoff__controll-timer__time');

  launchBtn.addEventListener('click', function(e) {
    e.preventDefault();
    countDown(timer, 10);
    setTimeout(function() {
      scrollDown(200, 600);
    }, 1000);
  });

  /*
   * Scrolls down bit by bit.
   * This still feels a bit laggy
   */
  function scrollDown(px, stop) {
    if (document.documentElement.scrollTop >= stop) {
      scrollIntoView();
      return;
    }
    if (document.documentElement.scrollTop === 200) {
      clouds.classList.add('b-takeoff__cluds--hidden');
    }
    setTimeout(function() {
      document.documentElement.scrollTop += px;
      scrollDown(px + 10, stop);
    }, 100);
  }

  /*
   * Function to take the view the last part down to the timeline
   */
  function scrollIntoView() {
    setTimeout(function() {
      window.scrollTo({
        top: timelineTop,
        left: 0,
        behavior: 'smooth'
      });
    }, 400);
  }

  /*
   * Count down inside the Launch Controll panel
   */
  function countDown(el, time) {
    if (time < 0) return scrollDown(200, 600);
    setTimeout(() => {
      el.innerHTML = `${time.toString()}:00`;
      countDown(el, time - 1);
    }, 100);
  }

  /*
   * Intersection observer to display the downwards facing rocket when
   * the view is scrolled to the timeline
   */
  var progress = document.querySelector('.progress');

  let observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          addRocket();
          progress.classList.remove('progress--hidden');
        } else {
          document
            .getElementById('timeline-rocket')
            .classList.add('b-timeline__rocket--hidden');
          progress.classList.add('progress--hidden');
        }
      });
    },
    {
      rootMargin: '0px 0px -50% 0px'
    }
  );
  observer.observe(document.querySelector('#timeline'));

  /*
   * Removes the hidden class from the rocket
   */
  function addRocket() {
    document
      .getElementById('timeline-rocket')
      .classList.remove('b-timeline__rocket--hidden');
  }
})();
