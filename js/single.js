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
        launch_links: data.links,
        launch_success: data.launch_success,
        isLaunch: true
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
            historyObj.isLaunch = true;
            historyObj.launch = {
              mission_name: data.mission_name,
              details: data.details,
              date: launchDate.toDateString(),
              rocket: data.rocket.rocket_name,
              launch_site: data.launch_site.site_name_long,
              launch_links: data.links,
              launch_success: data.launch_success,
              isLaunch: true
            };
            console.log(historyObj);
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
    <figure class="b-single__rocket-img">
        <img src="../img/falcon-500.png" alt="A large Falcon Heavy rocket">
    </figure>
    <div class="b-single__event">
      <header class="b-single__header">
        ${
          event.isLaunch
            ? '<div class="b-single__launch-true"><h3>LAUNCH</h3></div>'
            : ''
        }
        <h2>${event.title}</h2>
        <h3>${event.date}</h3>
      </header>
      <section class="b-single__body">
        <p class="b-single__body__text">${event.details}</p>       
        <table>
          <thead>
            <tr>
              <th  colspan="2">Links</th>
            </tr>  
          </thead>
          <tbody>
          ${Object.keys(event.links)
            .map(link => {
              if (event.links[link] !== null) {
                return `<tr>
                <td><a href="${event.links[link]}">Article on ${
                  link === 'article' ? 'SpaceX' : link
                }</a></td>
              </tr>`;
              }
            })
            .join('')}
          </tbody>
        </table>
        ${
          event.isLaunch
            ? `
        <section>
          <h3>Launch Information</h3>
          <h4>This launch was ${
            event.launch_success || event.launch.launch_success
              ? 'successful'
              : 'not successful'
          }</h4>
          <p>Mission name: ${event.mission_name ||
            event.launch.mission_name}</p>
          <p>Launch site: ${event.launch_site || event.launch.launch_site}</p>
          <a href="${event.launch.launch_links.article_link ||
            event.launch_links.article_link}">Read about it on Wikipedia</a>
          <a href="${event.launch.launch_links.video_link ||
            event.launch_links.video_link}">See the launch video on Youtube</a>
        </section>
        `
            : ''
        }
      </section>
    </div>
  `;
}
