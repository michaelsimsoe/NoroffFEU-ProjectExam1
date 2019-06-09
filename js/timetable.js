var eventArray = [];
const container = document.querySelector('.b-timetable__timetable__body');
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
        console.log(sorted);
        sorted.forEach(item => {
          makeTimetable(item);
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
  var id = launch.flight_number;
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

function makeTimetable(item) {
  container.innerHTML += `<tr>
    <td>${item.dateString}</td>
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
  }">Read about event</a></td>
  </tr>`;
}
