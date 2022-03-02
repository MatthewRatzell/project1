const query = require('querystring');

// will be cleared on shutdown
const cards = {};
let username = null;

// function to respond with a json object
const respondJSON = (request, response, status, object, contentType = 'application/json') => {
  // object for our headers
  const headers = {
    'Content-Type': contentType,
  };

  // send response with json object
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  // response.write(JSON.parse);
  response.end();
};

// function to respond without json body
const respondJSONMeta = (request, response, status) => {
  // object for our headers
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.end();
};

// get user object
const getCards = (request, response) => {
  const responseJSON = {
    cards,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// get username may be needed most likely not
const getUsername = (request, response) => {
  const responseJSON = {
    username,
  };
  return respondJSON(request, response, 200, responseJSON);
};

const setUsername = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: 'username is required or is already set!',
  };

  if (!body.username || body.username === username) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  let responseCode = 204;

  // add or update fields for this user name
  username = body.username;
  // if the username was successfully set
  if (username != null) {
    responseCode = 201;
  }

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.id = 'username succesfully  set';
    responseJSON.message = 'Logged in and hopefully loaded';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // if status cpde ios 204 it wont have a body
  return respondJSONMeta(request, response, responseCode);
};
// const returnCards
// get meta info about user object
const getCardsMeta = (request, response) => respondJSONMeta(request, response, 200);

// function for 404 not found requests with message
const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
};

// function for 404 not found without message
const notFoundMeta = (request, response) => {
  // return a 404 without an error message
  respondJSONMeta(request, response, 404);
};
// function to add a user from a POST body
const addCard = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: 'Title, Description, and Due date are all required',
  };

  if (!body.title || !body.description || !body.dueDate) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  let responseCode = 204;

  if (!cards[body.title]) {
    responseCode = 201;
    cards[body.title] = {};
  }

  // add or update fields for this user name
  cards[body.title].title = body.title;
  cards[body.title].description = body.description;
  cards[body.title].dueDate = body.dueDate;

  // if username exists add the card to where it belongs
  if (username != null) {
    console.log('username is not null');
  }
  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.id = 'that shit do be working tho';
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // if status cpde ios 204 it wont have a body
  return respondJSONMeta(request, response, responseCode);
};

const parseBody = (request, response) => {
  // The request will come in in pieces. We will store those pieces in this
  // body array.
  const body = [];

  // The body reassembly process is event driven, much like when we are streaming
  // media like videos, etc. We will set up a few event handlers. This first one
  // is for if there is an error. If there is, write it to the console and send
  // back a 400-Bad Request error to the client.
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // The second possible event is the "data" event. This gets fired when we
  // get a piece (or "chunk") of the body. Each time we do, we will put it in
  // the array. We will always recieve these chunks in the correct order.
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // The final event is when the request is finished sending and we have recieved
  // all of the information. When the request "ends", we can proceed. Turn the body
  // array into a single entity using Buffer.concat, then turn that into a string.
  // With that string, we can use the querystring library to turn it into an object
  // stored in bodyParams. We can do this because we know that the client sends
  // us data in X-WWW-FORM-URLENCODED format. If it was in JSON we could use JSON.parse.
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    console.log(`Body params: ${bodyString}`);

    // Once we have the bodyParams object, we will call the handler function. We then
    // proceed much like we would with a GET request.
    addCard(request, response, bodyParams);
  });
};
const parseBodyUser = (request, response) => {
  // The request will come in in pieces. We will store those pieces in this
  // body array.
  const body = [];

  // The body reassembly process is event driven, much like when we are streaming
  // media like videos, etc. We will set up a few event handlers. This first one
  // is for if there is an error. If there is, write it to the console and send
  // back a 400-Bad Request error to the client.
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // The second possible event is the "data" event. This gets fired when we
  // get a piece (or "chunk") of the body. Each time we do, we will put it in
  // the array. We will always recieve these chunks in the correct order.
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // The final event is when the request is finished sending and we have recieved
  // all of the information. When the request "ends", we can proceed. Turn the body
  // array into a single entity using Buffer.concat, then turn that into a string.
  // With that string, we can use the querystring library to turn it into an object
  // stored in bodyParams. We can do this because we know that the client sends
  // us data in X-WWW-FORM-URLENCODED format. If it was in JSON we could use JSON.parse.
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    console.log(`Body params: ${bodyString}`);

    // Once we have the bodyParams object, we will call the handler function. We then
    // proceed much like we would with a GET request.
    setUsername(request, response, bodyParams);
  });
};
// set public modules
module.exports = {
  getCards,
  getCardsMeta,
  notFound,
  notFoundMeta,
  addCard,
  parseBody,
  getUsername,
  setUsername,
  parseBodyUser,
};
