'use strict';

// post new user

document
  .querySelector('.js-btn-post-new-user')
  .addEventListener('click', () => {
    const inputName = document.querySelector('.js-input-name');
    const inputEmail = document.querySelector('.js-input-email');

    const bodyParams = {
      userName: inputName.value,
      userEmail: inputEmail.value,
    };

    fetch('http://localhost:3000/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('Server response:', responseData);
        printJson('.js-post-new-user-result', responseData);
      });
  });

// get users data

document.querySelector('.js-btn-get-users').addEventListener('click', () => {
  const newBtn = document.querySelector('.js_new_btn');
  const newBtn2 = document.querySelector('.js_new_btn--2');

  const bodyParams = {
    filterByName: newBtn.value,
    filterByEmail: newBtn2.value,
  };

  fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyParams),
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log('Server response:', responseData);
      printJson('.js-get-users-result', responseData);
    });
});

// helper

const printJson = (selector, jsonData) => {
  const jsonHtml = JSON.stringify(jsonData, null, 2);
  document.querySelector(selector).innerHTML = jsonHtml;
};
