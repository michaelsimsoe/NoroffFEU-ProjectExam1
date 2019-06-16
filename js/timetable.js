(function() {
  /*
   * The following code does the same as one the main page
   * The only difference is the reuslt outputted to the DOM
   */
  var eventArray = [];
  var historicalEvents;
  var launchEvents;
  var container = document.querySelector('.b-timetable__timetable__body');
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
    .catch(error => console.log(error))
    .then(
      fetch('https://api.spacexdata.com/v3/launches')
        .then(res => {
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
          sorted.forEach(item => {
            makeTimetable(item);
          });
          historicalEvents = document.querySelectorAll('.historical-event');
          launchEvents = document.querySelectorAll('.launch-event');
        })
        .catch(error => console.log(error))
    );

  /*
   * An object maker
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
   * An other object maker
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
   * Fills the table with the objects fetched and made
   */
  function makeTimetable(item) {
    container.innerHTML += `<tr class="b-timetable__timetable__row ${
      item.isHistoryEvent
        ? item.isLaunch
          ? 'historical-event'
          : 'historical-event'
        : 'launch-event'
    }">
    <td><time datetime="${item.dateTime}">${item.dateString}</time></td>
    <td>${
      item.isHistoryEvent
        ? item.isLaunch
          ? 'Historical Event & Launch'
          : 'Historical Event'
        : 'Launch'
    }</td>
    <td>${item.title}</td>
    <td><a href="../single/?type=${item.eventType}&id=${
      item.id
    }&table=true">Read about event</a></td>
  </tr>`;
  }

  /*
   * Functionality to toggle views
   */
  const showHistory = document.querySelector('#show_history');
  const showLaunches = document.querySelector('#show_launches');

  showHistory.addEventListener('click', function(e) {
    if (!showHistory.checked) {
      historicalEvents.forEach(e => {
        e.style.display = 'none';
      });
    } else {
      historicalEvents.forEach(e => (e.style.display = 'block'));
    }
  });

  showLaunches.addEventListener('click', function(e) {
    if (!showLaunches.checked) {
      launchEvents.forEach(e => (e.style.display = 'none'));
    } else {
      launchEvents.forEach(e => (e.style.display = 'block'));
    }
  });
})();
