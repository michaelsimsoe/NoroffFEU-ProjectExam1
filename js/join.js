console.log('ok');

const joinForm = document.querySelector('.b-join__form');
let joinInputs = joinForm.getElementsByTagName('input');

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
Array.from(joinInputs).forEach(input => {
  input.addEventListener('blur', function(e) {
    console.log('blur');
    if (!e.target.checkValidity()) {
      e.target.classList.add('invalid');
    }
  });
});
