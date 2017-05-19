var webSocketUrl = "wss://api.artik.cloud/v1.1/websocket?ack=true";
var device_id = "1497d25089db4a8d84997fd5b2a3d65f";
var device_token = "17d85311bc7f46519a75a5138c46f221";

var isWebSocketReady = false;
var ws = null;

var serialport = require("serialport")
var SerialPort = serialport.SerialPort;
var sp = new SerialPort("/dev/ttyACM0", {
    baudrate: 9600,
    parser: serialport.parsers.readline("\n")
});

var WebSocket = require('ws');

/**
 * Gets the current time in millis
 */
function getTimeMillis(){
    return parseInt(Date.now().toString());
}

/**
 * Create a /websocket bi-directional connection 
 */
function start() {
    //Create the websocket connection
    isWebSocketReady = false;
    ws = new WebSocket(webSocketUrl);
    ws.on('open', function() {
         console.log("Websocket connection is open ....");
         register();
    });
    ws.on('message', function(data, flags) {
         console.log("Received message: " + data + '\n');
    });
    ws.on('close', function() {
         console.log("Websocket connection is closed ....");
    });
}

/**
 * Sends a register message to the websocket and starts the message flooder
 */
function register(){
    console.log("Registering device on the websocket connection");
    try{
        var registerMessage = '{"type":"register", "sdid":"'+device_id+'", "Authorization":"bearer '+device_token+'", "cid":"'+getTimeMillis()+'"}';
        console.log('Sending register message ' + registerMessage + '\n');
        ws.send(registerMessage, {mask: true});
        isWebSocketReady = true;
    }
    catch (e) {
        console.error('Failed to register messages. Error in registering message: ' + e.toString());
    }
}

/**
 * Send one message to ARTIK Cloud
 */
function sendData(hum,temp){
    try{
        ts = ', "ts": '+getTimeMillis();
        var data = {
                    "Temperature": temp,
                    "Humidity": hum
                   };
        var payload = '{"sdid":"'+device_id+'"'+ts+', "data": '+JSON.stringify(data)+', "cid":"'+getTimeMillis()+'"}';
        console.log('Sending payload ' + payload);
        ws.send(payload, {mask: true});
    } catch (e) {
        console.error('Error in sending a message: ' + e.toString());
    }
}

/**
 * All start here
 */


start(); // create websocket connection

sp.on("open", function () {
    sp.on('data', function(data) {
            if (!isWebSocketReady){
                console.log("Websocket is not ready. Skip sending data to ARTIK Cloud (data:" + data +")");
                return;
            }
            console.log("Data:" + data);
            
            var hum  =  data.substr(0,4)
            var temp  = data.substr(6,10)
            console.log("Humidity:" + hum);
            console.log("Temp:" + temp);
            sendData(hum,temp);
    });
});

