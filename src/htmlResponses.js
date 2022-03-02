const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const javascript = fs.readFileSync(`${__dirname}/../clientSrc/main.js`);
const cardJS = fs.readFileSync(`${__dirname}/../clientSrc/sw-card.js`);
const firebaseJS = fs.readFileSync(`${__dirname}/../clientSrc/firebase.js`);
// function to get the index page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// function to get css page
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// function to get css page
const getJavaScript = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(javascript);
  response.end();
};

// function to get css page
const getCardJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(cardJS);
  response.end();
};

// function to get css page
const getFirebaseJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(firebaseJS);
  response.end();
};

// set out public exports
module.exports = {
  getIndex,
  getCSS,
  getJavaScript,
  getCardJS,
  getFirebaseJS,
};
