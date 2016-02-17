var http = require('http');
var director = require('director');
var bot = require('./daniBot.js');
var end = require('./.env');

var router = new director.http.Router({
  '/' : {
    post: bot.respond,
    get: ping
  }
});


function ping() {
  this.res.writeHead(200);
  this.res.end("Hey, I'm Cool Guy.");
};


var server = http.createServer(function(req, res) {

  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

server.listen(8000);