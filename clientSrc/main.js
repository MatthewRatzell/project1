import * as firebase from "/firebase.js";

let username;
let cardData=[];
// function that handles card creation
const createCards = (obj) => {
  const list = document.querySelector('.card-list');
  console.log(`Title: ${obj.title},Description: ${obj.description},Due Date: ${obj.dueDate},firebase Username: ${obj.firebaseUserName}`);

  const swCard = document.createElement('sw-card');

  swCard.dataset.title = obj.title || '';
  swCard.dataset.description = obj.description || '';
  swCard.dataset.duedate = obj.dueDate || '';
  swCard.dataset.firebaseusername = obj.firebaseUserName || '';

  list.appendChild(swCard);
};
const handleResponse = async (response, parseResponse) => {
  // Grab the content section so that we can write to it
  const content = document.querySelector('#content');

  // If we should parse a response (meaning we made a get request)
  if (parseResponse) {
    const list = document.querySelector('.card-list');
    list.innerHTML = '';

    // Parse the response to json. This is an async function, so we will await it.
    const obj = await response.json();

    for (let i = 0; i < Object.entries(obj.cards).length; i++) {
      createCards(Object.values(obj.cards)[i]);
    }

    // if there is a message display it
    if (obj.message) {
      content.innerHTML = `<b>${obj.id}</b>`;
      content.innerHTML += `<p>${obj.message}</p>`;
    }
  } else if (response.status === 201 || response.status === 204) {
    // this comment is here to trick the linter into think their is code
    const obj = await response.json();
    //making sure we log it out to our console
    if (obj.message) {
      content.innerHTML = `<b>${obj.id}</b>`;
      content.innerHTML += `<p>${obj.message}</p>`;
    }
  } else if (response.status === 400) {
    const obj = await response.json();
    //making sure we log it out to our console
    if (obj.message) {
      content.innerHTML = `<b>${obj.id}</b>`;
      content.innerHTML += `<p>${obj.message}</p>`;
    }
  } else {
    const obj = await response.json();
    //making sure we log it out to our console
    if (obj.message) {
      content.innerHTML = `<b>${obj.id}</b>`;
      content.innerHTML += `<p>${obj.message}</p>`;
    }
  }
};
// function to send request. This is marked as async since we will use await.
const requestUpdate = async () => {
  // hardcodingg the method
  const method = 'get';
  const url = '/getCards';

  // Await our fetch response. Go to the URL, use the right method, and attach the headers.
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
    },
  });

  // Once we have our response, send it into handle response. The second parameter is a boolean
  // that says if we should parse the response or not. We will get a response to parse on get
  // requests so we can do an inline boolean check, which will return a true or false to pass in.
  handleResponse(response, method === 'get');
};
// function to send post data back to our server
const sendPost = async (addNewCardForm) => {
  // Grab all the info from the form

  // get the action we are trying to perform
  const nameAction = addNewCardForm.getAttribute('action');
  const nameMethod = addNewCardForm.getAttribute('method');

  // get the data inside the form that we need
  const titleField = addNewCardForm.querySelector('#title');
  const descriptionField = addNewCardForm.querySelector('#description');
  const dueDateField = addNewCardForm.querySelector('#dueDate');


  // not passing in firebaseusernamefield yet
  // Build a data string in the FORM-URLENCODED format.
  const formData = `title=${titleField.value}&description=${descriptionField.value}&dueDate=${dueDateField.value}`;

  // Make a fetch request and await a response. Set the method to
  // the one provided by the form (POST). Set the headers. Content-Type
  // is the type of data we are sending. Accept is the data we would like
  // in response. Then add our FORM-URLENCODED string as the body of the request.
  const response = await fetch(nameAction, {
    // nameMethod will be post
    method: nameMethod,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    // body of this json object
    body: formData,
  });
  
    // Parse the response to json. This is an async function, so we will await it.
    const obj = await response.json();

    for (let i = 0; i < Object.entries(obj.cards).length; i++) {
      createCards(Object.values(obj.cards)[i]);
    }
  // Once we have a response, handle it.
 // handleResponse(response);
};
// function to send post data back to our server
const sendPostFromFireBase = async (obj) => {
console.log(`title=${obj.title}&description=${obj.description}&dueDate=${obj.dueDate}`);
  const formData = `title=${obj.title}&description=${obj.description}&dueDate=${obj.dueDate}`;

  // Make a fetch request and await a response. Set the method to
  // the one provided by the form (POST). Set the headers. Content-Type
  // is the type of data we are sending. Accept is the data we would like
  // in response. Then add our FORM-URLENCODED string as the body of the request.
  const response = await fetch('/addCard', {
    // nameMethod will be post
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    // body of this json object
    body: formData,
  });

  // Once we have a response, handle it.
  handleResponse(response);
};
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////Handle Logging In//////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
// function to send post data back to our server
const setFireBaseUserName = async (firebaseForm) => {
  // Grab all the info from the form

  // get the action we are trying to perform
  const nameAction = firebaseForm.getAttribute('action');
  const nameMethod = firebaseForm.getAttribute('method');

  // get the data inside the form that we need
  const userNameField = firebaseForm.querySelector('#usernameField');

  ////////////////////////////////////////////////////////////////////////////////////////
  // not passing in firebaseusernamefield yet
  // Build a data string in the FORM-URLENCODED format.
  const formData = `username=${userNameField.value}`;

  // Make a fetch request and await a response. Set the method to
  // the one provided by the form (POST). Set the headers. Content-Type
  // is the type of data we are sending. Accept is the data we would like
  // in response. Then add our FORM-URLENCODED string as the body of the request.
  const response = await fetch(nameAction, {
    // nameMethod will be post
    method: nameMethod,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    // body of this json object
    body: formData,
  });

  //set the username
  if (userNameField.value != "" && userNameField.value != null) {
    username = userNameField.value;
  }

  // Once we have a response, handle it.
  handleResponse(response);
  ///////////////////////////////////////////////////////////////////////////////////////////////
};
const loadSavedCardsFromFireBase = () => {
  //this is done in firebase
  if (username != null || username == "") {
    cardData = firebase.loadScreen(username);
  }
};
const updateDOMAfterLogIn = () => {
  //this is done in firebase
  if (username != null || username == "") {
    document.getElementById("usernameBTN").disabled = true;
  }
};
function fixDOM() {
  updateDOMAfterLogIn();
}
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
const init = () => {
  updateDOMAfterLogIn();
  // Grab the form
  const addNewCardForm = document.querySelector('#addNewCardForm');

  const firebaseForm = document.querySelector('#firebaseForm');

  const getCards = (e) => {
    e.preventDefault();
    requestUpdate(addNewCardForm);
    return false;
  };


  // function that handles adding a user to our json object
  const addTask = async (e) => {
    e.preventDefault();
    //first send the data to the server
    await sendPost(addNewCardForm);
    //than see if there is a username now and if so add it to the users account
    if (username != null) {
      //firebase code to add data here 
      // get the data inside the form that we need
      const titleField = addNewCardForm.querySelector('#title');
      const descriptionField = addNewCardForm.querySelector('#description');
      const dueDateField = addNewCardForm.querySelector('#dueDate');

      firebase.writeUserData(titleField.value, descriptionField.value, dueDateField.value, username);
    }
    return false;
  };

  // function that handles adding a user to our json object
  const logIn = async (e) => {
    e.preventDefault();
    //await setting the name so it can be set before next function
    await setFireBaseUserName(firebaseForm);
    await loadSavedCardsFromFireBase();
    updateDOMAfterLogIn();
    //updateDOM
    return false;
  };

  // Call addTask when the submit event fires on the form.
  addNewCardForm.addEventListener('submit', addTask);

  // add event listener
  addNewCardForm.addEventListener('submit', getCards);

  firebaseForm.addEventListener('submit', logIn);
};







//to run
window.onbeforeunload = fixDOM;
window.onload = init;
export{createCards,sendPostFromFireBase};