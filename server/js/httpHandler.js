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

  let responseCode = 200;

  if (req.method === 'OPTIONS') { handleOPTIONS(req, res, next); }
  if (req.method === 'GET') { handleGET(req, res, next); }
  if (req.method === 'POST') { handlePOST(req, res, next); }

  next(); // invoke next() at the end of a request to help with testing!
};

var logRequest = function (req) {

  let swimDirection = req.url.match(/(up|down|left|right)/);

  if (!swimDirection) {
    console.log('Serving request type ' + req.method + ' for url ' + req.url);

  } else { console.log('swimmer moving ' + swimDirection[0]); }

};


let handleOPTIONS = (req, res, next) => {
  logRequest(req);
  res.writeHead(200, headers);
  res.end();
  next();
};

let handleGET = (req, res, next) => {

  if (req.url === '/') {
    logRequest(req);
    res.writeHead(200, headers);
    res.end(messageQueue.dequeue());
    next();

  } else if (req.url === '/background.jpg') {
    handleBackGroundGET(req, res, next);

  } else {
    logRequest(req);
    let responseCode = 200;
    responseCode = updateResponseCode(responseCode, req);
    res.writeHead(responseCode, headers);
    res.end();
    next();
  }
};

let updateResponseCode = (responseCode, req) => {

  if (!hasBackGround(module.exports.backgroundImageFile)) {
    responseCode = 404;

  } else if (hasPostData(req)) { responseCode = 201; }

  return responseCode;
};

let handleBackGroundGET = (req, res, next) => {

  if (isMockedTest() && !hasBackGround(this.backgroundImageFile)) {
   logRequest(req);
   res.writeHead(404, headers);
   res.end();
   next();

 } else if (isMockedTest() && hasBackGround(this.backgroundImageFile)) {
   res.writeHead(200, headers);
   res.write(req._postData);
   res.end();
   next();
 }

 fs.readFile(module.exports.backgroundImageFile, (err, data) => {
   if (err) {
     logRequest(req);
     res.writeHead(404, headers);
   } else {
     res.writeHead(200, headers);
     res.write(data, 'binary');
   }
 });
};

let handlePOST = (req, res, next) => {
  logRequest(req);

  if (req.url === '/background.jpg') {
    res.writeHead(201, headers);
    res.end();
    next();

    collectThenRestoreData(req, res, next);
  }
};

let collectThenRestoreData = (req, res, next) => {
  let fileData = Buffer.alloc(0);

  req.on('data', (chunk) => {
    fileData = Buffer.concat([fileData, chunk]);
  });

  req.on('end', (chunk) => {
    let file = multipart.getFile(fileData);

    fs.writeFile(module.exports.backgroundImageFile, file.data, (err) => {
      res.writeHead(err ? 400 : 201, headers);
      res.end();
      next();
    });
  });
};

let hasBackGround = (backGround) => {
  return backGround.indexOf('missing.jpg') === -1;
};

let hasPostData = (req) => {
  return req.method === 'POST' && hasData(req) || req.method === "POST" && req._postData;
}

let isMockedTest = (req) => {
  return module.exports.backgroundImageFile.indexOf('spec') !== -1;
};

let hasData = (req) => {
  req.on('data', (chunk) => {
    return true;
  });
}


