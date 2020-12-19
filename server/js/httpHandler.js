const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('./', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {

  logRequest(req);

  let responseCode = 200;
  responseCode = this.updateResponseCode(responseCode, req);

  res.writeHead(responseCode, headers);
  res.end(req._postData);
  next(); // invoke next() at the end of a request to help with testing!
};

var logRequest = function (req) {

  let swimDirection = req.url.match(/(up|down|left|right)/);

  if (!swimDirection) {
    console.log('Serving request type ' + req.method + ' for url ' + req.url);

  } else { console.log('swimmer moving ' + swimDirection[0]); }

};

module.exports.updateResponseCode = (responseCode, req) => {

  if (!hasBackGround(this.backgroundImageFile)) {
    responseCode = 404;

  } else if (hasPostData(req)) { responseCode = 201; }

  return responseCode;
};


let hasBackGround = (backGround) => {
  return backGround.indexOf('missing.jpg') === -1;
};

let hasPostData = (req) => {
  return req._postData && req.method === "POST";
}