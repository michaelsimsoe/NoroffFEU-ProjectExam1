const container = document.querySelector('.b-single');
function getQueryStringValue(key) {
  return decodeURIComponent(
    window.location.search.replace(
      new RegExp(
        '^(?:.*[&\\?]' +
          encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') +
          '(?:\\=([^&]*))?)?.*$',
        'i'
      ),
      '$1'
    )
  );
}
// variable for the id
var id = getQueryStringValue('id');
var eventType = getQueryStringValue('eventType');
fetchHistory(id, eventType);
function fetchLaunch(id, type) {
  const launchObj = {};
  fetch(`https://api.spacexdata.com/v3/${type}/${id}`)
    .then(res => {
      if (res.ok) {
        return res;
      }
      throw Error(res.statusText);
    })
    .then(res => res.json())
    .then(data => {
      var launchDate = new Date(data.launch_date_utc);
      launchObj = {
        mission_name: data.mission_name,
        details: data.details,
        date: launchDate.toDateString(),
        rocket: data.rocket.rocket_name,
        launch_site: data.launch_site.site_name_long,
        launch_links: data.links
      };
      return displayHistoryEvent(launchObj);
    })
    .catch(
      error => console.log(error)
      // displayMessage(
      //   `Sorry. An error occured while we tried to fetch the cards ${
      //     error.statusText ? ': ' + error.statusText : '.'
      //   }`,
      //   'danger'
      // )
    );
}

function fetchHistory(id) {
  const historyObj = {};
  fetch('https://api.spacexdata.com/v3/history/' + id)
    .then(res => {
      console.log(res);
      if (res.ok) {
        return res;
      }
      throw Error(res.statusText);
    })
    .then(res => res.json())
    .then(data => {
      var date = new Date(data.event_date_utc);
      historyObj.title = data.title;
      historyObj.details = data.details;
      historyObj.date = date.toDateString();
      historyObj.links = data.links;
      if (data.flight_number && data.flight_number !== undefined) {
        fetch('https://api.spacexdata.com/v3/launches/' + data.flight_number)
          .then(res => {
            console.log(res);
            if (res.ok) {
              return res;
            }
            throw Error(res.statusText);
          })
          .then(res => res.json())
          .then(data => {
            var launchDate = new Date(data.launch_date_utc);
            historyObj.launch = {
              mission_name: data.mission_name,
              details: data.details,
              date: launchDate.toDateString(),
              rocket: data.rocket.rocket_name,
              launch_site: data.launch_site.site_name_long,
              launch_links: data.links
            };
            return displayHistoryEvent(historyObj);
          })
          .catch(
            error => console.log(error)
            // displayMessage(
            //   `Sorry. An error occured while we tried to fetch the cards ${
            //     error.statusText ? ': ' + error.statusText : '.'
            //   }`,
            //   'danger'
            // )
          );
      } else {
        return displayHistoryEvent(historyObj);
      }
    })
    .catch(
      error => console.log(error)
      // displayMessage(
      //   `Sorry. An error occured while we tried to fetch the cards ${
      //     error.statusText ? ': ' + error.statusText : '.'
      //   }`,
      //   'danger'
      // )
    );
}

function displayHistoryEvent(event) {
  container.innerHTML += `
    <header className="b-single__header">
      <h2>${event.title}</h2>
      <h3>${event.date}</h3>
    </header>
    <section className="b-single__body">
      <p className="b-single__body__text">${event.details}</p>
    </section>
  `;
}
