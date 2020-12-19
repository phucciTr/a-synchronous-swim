const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

const formidable = require('formidable');

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

  if (hasNoMockData(req)) {
    writeDataToRoot(req, res);

  } else { res.end(req._postData); }

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

let writeDataToRoot = (req) => {
  let form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {

      files.file.name = 'background.jpg';

      let fileName = files.file.name;
      let oldPath = files.file.path;
      let newPath = './' + fileName;

      createFile(oldPath, newPath);

      res.write('Background Replaced!');
      res.end();
  });
}

let hasBackGround = (backGround) => {
  return backGround.indexOf('missing.jpg') === -1;
};

let hasPostData = (req) => {
  return req.method === 'POST' && hasData(req) || req.method === "POST" && req._postData;
}

let hasNoMockData = (req) => {
  return hasData(req) && req._postData !== undefined;
}

let hasData = (req) => {
  req.on('data', (chunk) => {
    return true;
  });
}

let createFile = (oldPath, newPath) => {
  fs.rename(oldPath, newPath, (err) => {
    if (err) { throw err; }
  });
}

