var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

/***** COMMANDS REG ******/
var botRegex = /^\/cool guy$/;
var helpRegex = /^\/help$/;
var greetRegex = /greet$/;
var gifRegex = /gif$/;

// this regex needs to detect white space in substring after '@' symbol
var curseReg = /^\/curse @[a-zA-Z0-9]+$/;

var curses = ["fuck you", "you shithead", "If you’re going to be two-faced, at least make one of them pretty.", "Someday you’ll go far… and I hope you stay there."]


function respond() {
  var request, botRegex;

  try {
    var request = JSON.parse(this.req.chunks[0]);

      if(request.text) {
        this.res.writeHead(200);
        performCommand(request);
        this.res.end();
      } else {
        console.log("don't care");
        this.res.writeHead(200);
        this.res.end();
      }
  }
  catch(e) {
    this.res.writeHead(500);
    console.log(e);
    this.res.end();
  }
}

function parseNameFromMessage(text) {
  if (text !== "") { 
    var startParse = text.indexOf("@");
    var name = text.substring(startParse);

    return name;
  }
  else {
    //throw error
  }
}

function buildCurse(name) {
  //pick random curse word from array
  var index = Math.floor(Math.random() * (curses.length - 0)) + 0;

  if (index === 1) {
    return curses[index] + ", " + name;
  }

  return name + " " + curses[index];
}

function performCommand(requestData) {
  if (helpRegex.test(requestData.text)) {
    botResponse = "Hey! These are the commands I know about:\n/greet: Hello\n/gif: post a random gif";
    sendToGroupMe(botResponse);
  }
  else if (greetRegex.test(requestData.text)) {

   sendToGroupMe("whats up!");
  }
  else if (gifRegex.test(requestData.text)) {

    giphyRequest();
  }
  else if (curseReg.test(requestData.text)) {
    // parse out the name
    // build a string with a curse word 
    //send to group me
    sendToGroupMe(buildCurse(parseNameFromMessage(requestData.text)));
  }
  else {
    botResponse = "I dont know what these means";
  }

}

function giphyRequest() {
  var options = {
    hostname: 'api.giphy.com',
    path: '/v1/gifs/random?api_key=dc6zaTOxFJmzC'   
  };

  var resBody = '';

  giphyReq = HTTPS.get(options, function(res) {
      res.on('data', function(chunck) {
        resBody += chunck.toString();
      });

      res.on('end', function() {
        var parseBody = JSON.parse(resBody);

        // *change this to be smart enough to grab the giphy image */
        //console.log(parseBody.data.image_original_url.toString());
        sendToGroupMe(parseBody.data.image_original_url.toString());
      });
      res.on('error', function(error) {
        sendToGroupMe("giphy crapped the bed");
      });
    });
}


function sendToGroupMe(data) {
  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  console.log(data);
  body = {
    "bot_id" : botID,
    "text" : data
  };  

  console.log('sending ' + body.text + ' to ' + body.bot_id);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //console.log(res);
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));

}

function postMessage(request, data) {
  var botResponse, options, body, botReq;

  console.log()

  if (helpRegex.test(requestData.text)) {
    botResponse = "Hey! These are the commands I know about:\n/greet: Hello\n/gif: post a random gif";
  }
  else if (greetRegex.test(requestData.text)) {
    botResponse = "whats up!";
  }
  else if (gifRegex.test(requestData.text)) {

    gipfyOptions = {
      hostname: 'api.giphy.com',
      path: '/v1/gifs/random?api_key=dc6zaTOxFJmzC'   
    };

    giphyBody = '';


    giphyReq = HTTPS.get(gipfyOptions, function(res) {
      res.on('data', function(chunck) {
        giphyBody += chunck.toString();
      });

      res.on('end', function() {
        var parseBody = JSON.parse(giphyBody);
        console.log(parseBody);
      });
    });

  }
  else {
    botResponse = "I dont know what these means";
  }
}


exports.respond = respond;