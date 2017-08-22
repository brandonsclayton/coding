
/**
* UI Click handler
* 
* @param container - jquery element 
* @param serviceCall - service method
*/

function handleClick(container, serviceCall, cb) {

	container.empty().append('Loading ...');

	serviceCall(

		function(success){ handleResponse(container, success, null, cb)},
		function(error){ handleResponse(container, null, error, cb)},
	)
}

/**
* Ajax Request response handler
* 
* @param responseContainer - jquery element
* @param success - success data
* @param error - error data
* @param cb - callback
*/

function handleResponse(responseContainer, success, error, cb) {

	var indent = 2;

	if(error) {
		log("An error occurred:", JSON.stringify(error, null, indent))
		responseContainer.empty().append(JSON.stringify(error, null, indent));
		responseContainer.addClass('error');
	}

	else {
		log("API Call Success:", JSON.stringify(error, null, indent))
		responseContainer.empty().append(JSON.stringify(success, null, indent));
		responseContainer.removeClass('error');
	}

	cb?cb(success, error):null;
	
}

/**
* simple log output to ui
*/

function log(message, data) {
	
	var element = $('<div>')
	element.append(">> " + message);
	$('#log').append(element);

}

/**
* Helper entry make ajax calls
*/

var Service = function() {  

	function makeGetAjaxCall(url, success, error) {

      $.ajax({
          type: 'GET',
          url: url,
          success: function(response){
              success(response);
          },
          error: function(response) {
              error(response);
          }
       });

    }

    return {
	    	getMessage: function (success, error) {
	    		makeGetAjaxCall('message/get', success, error);
	    },
	    	sendMessage: function (success, error) {
	     		makeGetAjaxCall('message/send', success, error);
	    },
	    	createDevice: function (success, error) {
	     		makeGetAjaxCall('device/create', success, error);
	    },
	    	getSelf:  function (success, error) {
	    		makeGetAjaxCall('user/self', success, error);
	    }
    } 

}();


$(document).ready(function(){

	Service.getSelf(

		function(success){ 
			
			var userId = success.data.id;
			var fullName = success.data.fullName
			
			log('Got additional for user via /user/self endpoint');
			log('userId: ' + userId);
			log('fullName: ' + fullName);

			$('#welcome-name').empty().append("Hello " + fullName);
		},

		function(error){ 
			log('Does not appear you are logged in.  Sign in to continue with link above');
		});


	$('#create-device').click(function() {

		log("Creating Device ...")

		var statusContainer = $('#status-create');

		handleClick($('#response-create'), Service.createDevice, function(success, error){

			if(error) return;

			statusContainer.empty().append("Device Created: " + success.data.name);

		});

	});

	$('#send-message').click(function(){
		log("Sending Message ...")
		handleClick($('#response-send'), Service.sendMessage)
	});

	$('#get-message').click(function(){
		log("Getting Message ...")
		handleClick($('#response-get'), Service.getMessage)
	});

});



