(function() {
  /*
   * Again, stolen from the Javascript 1 CA
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
  var first_name = getQueryStringValue('join-first_name') || 'human';
  document.querySelector(
    '.b-join-success__message__name'
  ).innerHTML = first_name;
})();
