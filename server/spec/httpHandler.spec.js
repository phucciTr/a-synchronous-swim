
const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const server = require('./mockServer');

// Imports
const httpHandler = require('../js/httpHandler');
const keypressHandler = require('../js/keypressHandler');
const http = require('http');

// Declared Variables
const port = 3000;
const ip = '127.0.0.1';

describe('server responses', () => {

  it('should respond to a OPTIONS request', (done) => {
    let {req, res} = server.mock('/', 'OPTIONS');

    httpHandler.router(req, res);
    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
    expect(res._data.toString()).to.be.empty;

    done();
  });

  it('should respond to a GET request for a swim command', (done) => {
    // write your test here
    // import keypressHandler into this spec file.
    let {req, res} = server.mock('../../client/js/swimTeam.js','GET', 'left');

   //=> request swim command,from swimmTeam method, ( move. left, move.right) get by mock (  ,  )
    //move.left == 'left'

    httpHandler.router(req, res, ()  =>  {
      expect(res._responseCode).to.equal(200);
      expect(res._ended).to.equal(true);
      // expect(SwimTeam.direction === 'left';

      res._data = 'something';
      console.log('res._data.toString() = ', res._data.toString());
      // expect(res._data.toString()).to.be.expected;
    });
    done();
  });

  xit('should respond with 404 to a GET request for a missing background image', (done) => {
    httpHandler.backgroundImageFile = path.join('.', 'spec', 'missing.jpg');
    let {req, res} = server.mock('FILL_ME_IN', 'GET');

    httpHandler.router(req, res, () => {
      expect(res._responseCode).to.equal(404);
      expect(res._ended).to.equal(true);
      done();
    });
  });

  xit('should respond with 200 to a GET request for a present background image', (done) => {
    // write your test here
    done();
  });

  var postTestFile = path.join('.', 'spec', 'water-lg.jpg');

  xit('should respond to a POST request to save a background image', (done) => {
    fs.readFile(postTestFile, (err, fileData) => {
      httpHandler.backgroundImageFile = path.join('.', 'spec', 'temp.jpg');
      let {req, res} = server.mock('FILL_ME_IN', 'POST', fileData);

      httpHandler.router(req, res, () => {
        expect(res._responseCode).to.equal(201);
        expect(res._ended).to.equal(true);
        done();
      });
    });
  });

  xit('should send back the previously saved image', (done) => {
    fs.readFile(postTestFile, (err, fileData) => {
      httpHandler.backgroundImageFile = path.join('.', 'spec', 'temp.jpg');
      let post = server.mock('FILL_ME_IN', 'POST', fileData);

      httpHandler.router(post.req, post.res, () => {
        let get = server.mock('FILL_ME_IN', 'GET');
        httpHandler.router(get.req, get.res, () => {
          expect(Buffer.compare(fileData, get.res._data)).to.equal(0);
          done();
        });
      });
    });
  });
});
