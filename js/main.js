var container = document.querySelector('.b-timeline');
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
        sorted.forEach(item => makeDisplayItem(item));
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
  var launch = event.flight_number != null ? true : false;
  var historyEvent = true;
  var text = event.details;
  return {
    date,
    dateString,
    title,
    launch,
    historyEvent,
    text
  };
}

function makeLaunchElement(launch) {
  var details = launch.details;
  var date = new Date(launch.launch_date_utc);
  var dateString = date.toDateString();
  var title = launch.mission_name;
  var launch = true;
  var historyEvent = false;
  var text = details;
  return {
    date,
    dateString,
    title,
    launch,
    historyEvent,
    text
  };
}

function makeDisplayItem(item) {
  container.innerHTML += `
    <div class="${
      item.historyEvent ? 'item__historical-event' : 'item__simple-launch'
    }">
      ${item.launch ? '<h3>LAUNCH</h3>' : ''}
      ${item.historyEvent ? '<img src="img/falcon.jpg">' : ''}
      <h2>${item.dateString}</h2>
      <h3>${item.title}</h3>
      ${item.text ? '<p>' + item.text + '</p>' : ''}
    </div>
  `;
}
