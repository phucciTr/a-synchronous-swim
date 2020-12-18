const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {

  let swimDirection = req.url.match(/(up|down|left|right)/);

  if (!swimDirection) {
    console.log('Serving request type ' + req.method + ' for url ' + req.url);

  } else { console.log('swimmer moving ' + swimDirection[0]); }


  res.writeHead(200, headers);
  res.end(req._postData);
  next(); // invoke next() at the end of a request to help with testing!
};

