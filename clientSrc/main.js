import * as firebase from "/firebase.js";

let username;
let cardData = [];

// function that handles card creation
const createCards = (obj) => {
  //update our card data
  cardData.push(obj);
  const list = document.querySelector('.card-list');
  //console.log(`Title: ${obj.title},Description: ${obj.description},Due Date: ${obj.dueDate}`);

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
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
  } else if (response.status === 201 || response.status === 204) {
    // this comment is here to trick the linter into think their is code
    const obj = await response.json();
    //making sure we log it out to our console
    if (obj.message) {
      content.innerHTML = `<b>${obj.id}</b>`;
      content.innerHTML += `<p>${obj.message}</p>`;
    }
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
  } else if (response.status === 400) {
    const obj = await response.json();
    //making sure we log it out to our console
    if (obj.message) {
      content.innerHTML = `<b>${obj.id}</b>`;
      content.innerHTML += `<p>${obj.message}</p>`;
    }
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
  } else {
    const obj = await response.json();
    //making sure we log it out to our console
    if (obj.message) {
      content.innerHTML = `<b>${obj.id}</b>`;
      content.innerHTML += `<p>${obj.message}</p>`;
    }
  }
  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
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
const setName = async () => {
  // hardcodingg the method
  const method = 'get';
  const url = '/getUsername';

  // Await our fetch response. Go to the URL, use the right method, and attach the headers.
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
    },
  });

  //grab the name from the response
  const name = await response.json();

  //set our name to whatever we get from the server
  if (name.username != null) {
    username = name.username;
    requestUpdate();
  }



  updateDOMAfterLogIn();
};
// function to send post data back to our server
const sendPost = async (addNewCardForm) => {
  // Grab all the info from the form
  let exists = false;
  
  // get the action we are trying to perform
  const nameAction = addNewCardForm.getAttribute('action');
  const nameMethod = addNewCardForm.getAttribute('method');

  // get the data inside the form that we need
  const titleField = addNewCardForm.querySelector('#title');
  const descriptionField = addNewCardForm.querySelector('#description');
  const dueDateField = addNewCardForm.querySelector('#dueDate');

  //check to make sure it doesnt exist
  for(let i = 0;i<cardData.length;i++){
    //
    if(cardData[i].title == titleField.value){
      exists = true;
    }
  }
  
  // Build a data string in the FORM-URLENCODED format.
  const formData = `title=${titleField.value}&description=${descriptionField.value}&dueDate=${dueDateField.value}`;
  console.log(`Method:${nameMethod}Action:${nameAction}`);

  if (!exists) {
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
    // Once we have a response, handle it.
    handleResponse(response);
  }

};
// function to send post data back to our server
const sendPostFromFireBase = async (obj) => {

  // console.log(`title=${obj.title}&description=${obj.description}&dueDate=${obj.dueDate}`);
  const formData = `title=${obj.title}&description=${obj.description}&dueDate=${obj.dueDate}`;

  // Make a fetch request and await a response. Set the method to
  // the one provided by the form (POST). Set the headers. Content-Type
  // is the type of data we are sending. Accept is the data we would like
  // in response. Then add our FORM-URLENCODED string as the body of the request.
  const response = await fetch('/addCard', {
    // nameMethod will be post
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    // body of this json object
    body: formData,
  });

};
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////Handle Logging In//////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
// function to send post data back to our server
const setFireBaseUserName = async (firebaseForm) => {
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
const loadSavedCardsFromFireBase = async () => {
  //this is done in firebase
  if (username != null) {
    await firebase.loadScreen(username);
  }
};

const updateDOMAfterLogIn = () => {
  if (username != null) {
    document.getElementById("usernameBTN").disabled = true;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
const init = async () => {
  setName();
  //////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
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

      if (titleField.value != null && descriptionField.value != null && dueDateField.value != null) {
        firebase.writeUserData(titleField.value, descriptionField.value, dueDateField.value, username);
      }
      else {
        console.log("username exists but invalid entrys");
      }
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

    return false;
  };

  // Call addTask when the submit event fires on the form.
  addNewCardForm.addEventListener('submit', addTask);

  // add event listener
  addNewCardForm.addEventListener('submit', getCards);

  firebaseForm.addEventListener('submit', logIn);
};








window.onload = init;

export { createCards, sendPostFromFireBase, handleResponse, requestUpdate };