/*
* index.js
* Auhtor: Tiago Ricardo
*/

var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var async = require('async');

// snmp module
var snmp = require ("net-snmp");

var luminatos = [
  {
    "name": "Device 1",
    "local": "Porto",
    "ip": "192.168.0.1"
  },
  {
    "name": "Device 2",
    "local": "Lisboa",
    "ip": "192.168.0.2"
  }
];

var result = [];

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});


router.get("/devices",function(req,res)
{
	result = [];
	async.forEachOf(luminatos, function (value, key, callback) {
		ReadDeviceInfo(value,callback);
	}, function (err) {
	  if(err)
		{
			res.json({"Error": "something goes wrong"});
		}
		else
		{
		   res.json(result);
		}
	})

});

app.use("/",router);


app.listen(8080,function(){
  console.log("Live at Port 8080");
});

function ReadDeviceInfo(device,callback)
{
	try {
		//var session = snmp.createSession ("172.20.66.75", "public");
		var session = snmp.createSession (device.ip, "public");
		console.log("Local:" + device.local + " IP:" + device.ip);
		var oids = ["1.3.6.1.2.1.47.1.1.1.1.10.1","1.3.6.1.2.1.1.1.0","1.3.6.1.4.1.3715.17.1.10.0"];
		
		session.get(oids, function (error, varbinds) {
			if (error) {
				console.log(error);
				device.running = "false";
				result.push(device);
				callback();
			} else {
				if(!snmp.isVarbindError(varbinds[0]))
				{
					device.version = varbinds[0].value.toString();
				}
				if(!snmp.isVarbindError(varbinds[1]))
				{
					device.versionname = varbinds[1].value.toString();
				}
				if(!snmp.isVarbindError(varbinds[2]))
				{
					device.serialnumber = varbinds[2].value.toString();
				}
				device.running = "true";
				result.push(device);
				callback();
			}
		});
		
		session.on ("error", function (error) {
    console.log (error.toString ());
    session.close ();
});
		
	} catch (ex) {
		device.running = "false";
		result.push(device);
		callback(ex);
  }
}
