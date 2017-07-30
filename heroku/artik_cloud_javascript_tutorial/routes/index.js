var express = require('express');
var http = require ('https');
var querystring = require('querystring');
var router = express.Router();

//import artikcloud library
var ArtikCloud = require('artikcloud-js');
var Config = require('../config.json');

router.use(function(req, res, next){

	if(!req.session.token) 
		req.session.token = {};

	setTokenARTIKCloud(req.session.token.access_token);

	next();

});

/* GET home page. */
router.get('/', function(req, res, next) {

  if(!req.session.token) {
  	req.session.token = {};
  }

  req.session.state = randomStateString(20);

  res.render('index', {
  	config: Config,
  	token: req.session.token,
  	oauthState: req.session.state
  });

});

router.get("/message/send", function(req, res, next) {

	//TODO: @SDK Sample Snippet error - snippet instantiates apiInstance, but uses variable 'api' below

	//Get reference to MessagesApi()
	var apiInstance = new ArtikCloud.MessagesApi();
	var messageObject = new ArtikCloud.Message();

	// data to send to Example Activity Tracker
	// will use random integer values for each Message sent and also a constant
	var messageData = {
		"activity": randomIntegerBetween(70,80),
		"description": "a simple description",
		"heartRate": randomIntegerBetween(70,80),
		"state": 22,
		"stepCount": randomIntegerBetween(5,10)
	}

	messageObject.data = messageData;
	messageObject.sdid = req.session.deviceId;

	var callback = function(error, data, response) {

	  if (error) {
	    console.error(error);
	    res.send(error, error.status);
	  } else {
	    console.log('API called successfully. Returned data: ' + data);
	    res.send(data);
	  }
	};

	//sample api call - send message to device
	apiInstance.sendMessage(messageObject, callback);

});

router.get("/message/get", function(req, res, next) {

	//Get reference to MessagesApi()
	var apiInstance = new ArtikCloud.MessagesApi()

	var opts = {
		'sdids': req.session.deviceId,   // String - Comma separated list of source device IDs (minimum: 1).
		'count': 1  					 // Integer - Number of items to return per query.
	}

	var callback = function(error, data, response) {
	  if (error) {
	    console.error(error);
	    res.send(error, error.status);
	  } else {
	    console.log('API called successfully. Returned data: ' + data);
	    res.send(data);
	  }
	};

	//sample api call - get last message sent to device
	apiInstance.getLastNormalizedMessages(opts, callback);

 
});


router.get("/device/create", function(req, res, next) {

	//Get reference to DevicesApi()
	var apiInstance = new ArtikCloud.DevicesApi()

	var device = {
		'uid': req.session.userId,   
		'dtid': Config.device_type_id,  
		'name': "Sample Activity Tracker " + randomIntegerBetween(1000,10000)
	}


	console.log("Creating Device with data: ", device);

	var callback = function(error, data, response) {
	  if (error) {
	    console.error(error);
	    res.send(error, error.status);
	  } else {
	    console.log('API called successfully. Returned data: ' + data);
	    req.session.deviceId = data.data.id
	    res.send(data);
	  }
	};

	//sample api call - add device 
	apiInstance.addDevice(device, callback);
 
});


router.get("/user/self", function(req, res, next) {

	//Get reference to UsersApi()
    var apiInstance = new ArtikCloud.UsersApi()

	var callback = function(error, data, response) {

	  if (error) {

	    console.error(error);
	    res.send(error, error.status);

	  } else {
	    console.log('>>>> API called successfully. Returned data: ' + JSON.stringify(data));
	    console.log(">>>> response parameter:", response);
	    console.log('User id is: ', data.data.id)
	    req.session.userId = data.data.id;
	    res.send(data);
	  }
	};

	//sample api call - get details of logged in user 
	apiInstance.getSelf(callback);

});


router.get("/callback/artikcloud", function(req, res, next) {

	console.log('route: /callback/artikcloud');

	if(req.query.state !== req.session.state) {
		return res.redirect('/');
	}

	exchangeCode(req, res, next);

});


/*
* Helper method for Authorization Code exchange 
* for an access_token after OAuth2 login
*/

function exchangeCode(req, res, next) {

	console.log("exchanging code ...");

	var data = {
		'grant_type': 'authorization_code',
		'client_id': Config.client_id,
		'client_secret': Config.client_secret,
		'redirect_uri': Config.redirect_uri,
		'code': req.query.code
	};

	var headers = {
		'Content-Type': 'application/x-www-form-urlencoded'
	}

	var host = 'accounts.artik.cloud';
	var path = '/token';

	//api call to exchange code
	postRequest(host, path, headers, data, function(result){

		console.log('exchanged code with result:', result);
		req.session.token = JSON.parse(result)
		req.session.save();

		return res.redirect('/');

	});

}


/*
* Helper method to set the `access_token` on the ARTIK Cloud Api Client.
* 
* This access_token is used as the header value when an API call is made
*/

function setTokenARTIKCloud(access_token) {
	var defaultClient = ArtikCloud.ApiClient.instance;

	// Configure OAuth2 access token for authorization: artikcloud_oauth
	var artikcloud_oauth = defaultClient.authentications['artikcloud_oauth'];
	artikcloud_oauth.accessToken = access_token
}

/**
* Simple random integer generator which returns number from min to max-1
* 
* @return random integer value between [min, max).   
*/

function randomIntegerBetween(min, max) {

	return Math.floor(Math.random() * (max-min) + min);

}

/**
* Quick random string regenerator.  Used in this sample to create a "state" query parameter during Oauth
*
* @return random string of length characters from charset A-Za-z0-9
*/

function randomStateString(length) {
	
	var charset = 'abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	var state = '';

	for(var i=0; i<length; i++) {
		state += charset.charAt(randomIntegerBetween(0, charset.length-1));
	}

	return state;
}

/**
* Helper method to make external post request
*/

function postRequest(host, path, headers, data, cb) {

	console.log("Attemping post request to:", host, path, headers);

	//TODO: check prefix path
	var options = {
		host: host,
		path: path,
		method: 'POST',
		headers: headers
	}

	var callback = function(response) {

		var str = ''
		  response.on('data', function (chunk) {
		    str += chunk;
		  });

		  response.on('end', function () {
		    console.log(str);
		    cb(str);
		  });

	}

	var req = http.request(options, callback);
	req.write(querystring.stringify(data));
	req.end();

}


module.exports = router;
