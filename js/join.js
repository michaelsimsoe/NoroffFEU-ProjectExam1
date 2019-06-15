(function() {
  const joinForm = document.querySelector('.b-join__form');
  let joinInputs = joinForm.getElementsByTagName('input');

  /*
   * Form validation on submit
   */
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('b-join__form__submit')) {
      if (joinForm.checkValidity()) {
        joinForm.submit();
      } else {
        e.preventDefault();
        let joinInputs = joinForm.querySelectorAll('input');
        joinInputs.forEach(input => {
          if (!input.checkValidity()) {
            input.classList.add('invalid');
          }
        });
      }
    }
  });

  /*
   * Form validation when the user leaves the field
   */
  Array.from(joinInputs).forEach(input => {
    input.addEventListener('blur', function(e) {
      if (!e.target.checkValidity()) {
        e.target.classList.add('invalid');
      } else {
        e.target.classList.remove('invalid');
      }
    });
  });

  /*
   * Hide and show the gender field
   */
  var idGender = document.querySelector('#join-gender');
  var idGenderDiv = document.querySelector('.b-join__identifying-gender');
  idGender.addEventListener('click', function(e) {
    if (idGender.checked) {
      idGenderDiv.classList.remove('b-join__identifying-gender__hidden');
    } else {
      idGenderDiv.classList.add('b-join__identifying-gender__hidden');
    }
  });
})();
