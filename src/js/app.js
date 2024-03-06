import '@etchteam/diamond-ui/composition/Enter/Enter';

const form = document.querySelector('form');
const email = document.querySelector('input[type="email"]');

form.setAttribute('novalidate', true);

document.querySelector('input[type="email"]').addEventListener('input', (e) => {
  const valid = email.checkValidity();
  email.closest('diamond-input').setAttribute('state', valid ? 'valid' : 'invalid');
});

document.querySelector('form').addEventListener('submit', (e) => {
  const valid = email.checkValidity();

  if (!valid) {
    e.preventDefault();
    email.closest('diamond-input').setAttribute('state', 'invalid');
  }
});