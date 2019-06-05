fetch('https://api.spacexdata.com/v3/history/1')
  .then(res => {
    console.log(res);
    if (res.ok) {
      return res;
    }
    throw Error(res.statusText);
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
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
          console.log(data);
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
