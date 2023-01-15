var express = require("express");
var MongoClient = require('mongodb').MongoClient;
const assert = require("assert");
var path = require("path");
//var bodyParser = require("body-parser");
const uri = "mongodb+srv://vietnguyen:500anhem@cluster0.6z4y7rp.mongodb.net/?retryWrites=true&w=majority";
var routes = require('./Router/routes.js');
const { Client } = require("mqtt");
var app = express();

const client = new MongoClient(uri);
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//app.use(bodyParser.urlencoded({ extended: false }));

app.use("/",routes);
//  client.connect(async function (err) {
//   assert.equal(null, err);
//   console.log("connect suscessful");
//    await app.listen(app.get("port"), function () {
//     console.log("server started on port " + app.get("port"));
//   });
// });

const start = async () => {
  try {
    await client.connect( function (err) {
        assert.equal(null, err);
        console.log("connect suscessful");
    })
      app.listen(app.get("port"), function () {
        console.log("server started on port " + app.get("port"));
      });
  } catch (error) {
      console.log(error);
      console.log("Failed to connect to the database, server is not running.");
  }
};

start();

//IndoorAirQualityMonitoringSystem

// // // http://www.steveio.com/2020/07/11/mqtt-to-websockets-esp32-nodejs-d3/
// async function connect1() {
//   MongoClient.connect(uri, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     dbo.createCollection("data_mq7", function (err, res) {
//       if (err) throw err;
//       console.log("Collection created!");
//       db.close();
//     });
//   });
// }

// async function connect2() {
//   MongoClient.connect(uri, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     dbo.createCollection("data_humi", function (err, res) {
//       if (err) throw err;
//       console.log("Collection created!");
//       db.close();
//     });
//   });
// }
// async function connect3() {
//   MongoClient.connect(uri, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     dbo.createCollection("data_temp", function (err, res) {
//       if (err) throw err;
//       console.log("Collection created!");
//       db.close();
//     });
//   });
// }

// connect1();
// connect2();
// connect3();

const mqtt = require("mqtt");

const host = "broker.emqx.io";
const port = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;
const client_mqtt = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: "emqx",
  password: "public",
  reconnectPeriod: 1000,
});

const topic_mq7 = "esp32_pub_mq7";
const topic_humi = "esp32_pub_humi";
const topic_temp = "esp32_pub_temp";
client_mqtt.on("connect", () => {
  console.log("Connected");
  client_mqtt.subscribe([topic_mq7], () => {
    console.log(`Subscribe to topic '${topic_mq7}'`);
  });
  client_mqtt.subscribe([topic_humi], () => {
    console.log(`Subscribe to topic '${topic_humi}'`);
  });
  client_mqtt.subscribe([topic_temp], () => {
    console.log(`Subscribe to topic '${topic_temp}'`);
  });
});

client_mqtt.on("message", (topic, payload) => {
  MongoClient.connect(uri, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    switch (topic) {
      case topic_mq7:
        var myobj = { Device: 'esp32', topic: topic_mq7, Value: payload.toString(), Unit: "ppm", Time: new Date() };
         await dbo.collection("data_mq7").insertOne(myobj, function (err, res) {
          if (err) throw err;
          db.close();
        });
        break;
      case topic_humi:
        var myobj = { Device: 'esp32', topic: topic_humi, Value: payload.toString(), Unit: "%", Time: new Date() };
        await dbo.collection("data_humi").insertOne(myobj, function (err, res) {
          if (err) throw err;
          db.close();
        });
        break;
      case topic_temp:
        var myobj = { Device: 'esp32', topic: topic_temp, Value: payload.toString(), Unit: "°C", Time: new Date() };
        await dbo.collection("data_temp").insertOne(myobj, function (err, res) {
          if (err) throw err;
          db.close();
        });
        break;
    }
  });
});