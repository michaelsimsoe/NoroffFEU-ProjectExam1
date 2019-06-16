(function() {
  var container = document.querySelector('.b-single');

  /*
   * Stolen from the Javascript 1 CA
   * I am not ashamed
   */
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
  var id = getQueryStringValue('id');
  var eventType = getQueryStringValue('type');
  var fromTable = getQueryStringValue('table');

  if (eventType === 'history') {
    fetchHistory(id);
  } else {
    fetchLaunch(id, eventType);
  }

  /*
   * If the querystring say launch, use the launch API
   */
  function fetchLaunch(id, type) {
    let launchObj = {};
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
          title: data.mission_name,
          details: data.details || 'No relevant information',
          date: launchDate.toDateString(),
          links: data.links,
          isLaunch: true,
          launch: {
            mission_name: data.mission_name,
            details: data.details,
            date: launchDate.toDateString(),
            rocket: data.rocket.rocket_name,
            launch_site: data.launch_site.site_name_long,
            launch_links: data.links,
            launch_success: data.launch_success,
            isLaunch: true
          }
        };
        return displayHistoryEvent(launchObj);
      })
      .catch(error => console.log(error));
  }

  /*
   * If the querystring say history, use the history API
   */
  function fetchHistory(id) {
    const historyObj = {};
    fetch('https://api.spacexdata.com/v3/history/' + id)
      .then(res => {
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
              return displayHistoryEvent(historyObj);
            })
            .catch(error => console.log(error));
        } else {
          return displayHistoryEvent(historyObj);
        }
      })
      .catch(error => console.log(error));
  }

  /*
   * Get the created event or launch object
   * Append the information to the DOM
   */
  function displayHistoryEvent(event) {
    container.innerHTML += `
    
    <div class="b-single__event">
      <nav class="b-single__event__nav">
        <a class="b-single__event__nav__item" href="${
          fromTable == 'true' ? '../timetable' : '../'
        }">Back to the timeline</a>
      </nav>
      <header class="b-single__header">
        ${
          event.isLaunch
            ? '<div class="b-single__launch-true"><h3>LAUNCH</h3></div>'
            : ''
        }
        <div>
          <h2 class="b-single__header__event-title">${event.title}</h2>
          <h3 class="b-single__header__event-date">${event.date}</h3>
        </div>
      </header>
      <section class="b-single__body">
        <p class="b-single__body__text">${event.details}</p>       
        <table class="b-single__body__links-table">
          <thead>
            <tr>
              <th  colspan="2">Links</th>
            </tr>  
          </thead>
          <tbody>
          ${Object.keys(event.links)
            .map(link => {
              if (
                event.links[link] !== null &&
                event.links[link].length > 0 &&
                formatLinkTitles(link)
              ) {
                return `<tr>
                <td><a href="${
                  event.links[link]
                }">Article on ${formatLinkTitles(link)}</a></td>
              </tr>`;
              }
            })
            .join('')}
          </tbody>
        </table>
        ${
          event.isLaunch
            ? `
        <section class="b-single__body__launch-information">
          <h3 class="b-single__body__launch-information__heading">Launch Information</h3>
          <h4 class="b-single__body__launch-information__status b-single__body__launch-information__status-${
            event.launch_success || event.launch.launch_success
              ? 'successful'
              : 'not-successful'
          }">This launch was ${
                event.launch_success || event.launch.launch_success
                  ? 'successful'
                  : 'not successful'
              }</h4>
          <p class="b-single__body__launch-information__name"><span>Mission name:</span> ${event.mission_name ||
            event.launch.mission_name}</p>
          <p class="b-single__body__launch-information__site"><span>Launch site:</span> ${event.launch_site ||
            event.launch.launch_site}</p>
          <a class="b-single__body__launch-information__wiki-link"href="${event
            .launch.launch_links.article_link ||
            event.launch_links.article_link}">Read about it on Wikipedia</a>
          <a class="b-single__body__launch-information__video"href="${event
            .launch.launch_links.video_link ||
            event.launch_links.video_link}">See the launch video on Youtube</a>
        </section>
        `
            : ''
        }
      </section>
    </div>
  `;
  }

  /*
   * The links from the received API call has some funky names
   * This function makes it so it is better
   */
  function formatLinkTitles(link) {
    var linkTitle;
    switch (link) {
      case 'mission_patch':
        linkTitle = 'Mission Patch';
        break;
      case 'mission_patch_small':
        linkTitle = 'The small Mission';
        break;
      case 'reddit_campaign':
        linkTitle = 'The Reddit Campaign';
        break;
      case 'reddit_launch':
        linkTitle = 'The Reddit Launch';
        break;
      case 'reddit_recovery':
        linkTitle = 'The Reddit Recovery';
        break;
      case 'reddit_media':
        linkTitle = 'The Reddit Media';
        break;
      case 'presskit':
        linkTitle = 'The Presskit';
        break;
      case 'article_link':
        linkTitle = 'The SpaceX article';
        break;
      case 'wikipedia':
        linkTitle = 'The Wikipedia article';
        break;
      case 'video_link':
        linkTitle = 'The Youtube Video';
        break;
      case 'flickr_images':
        linkTitle = false;
        break;
      default:
        break;
    }
    return linkTitle;
  }
})();
