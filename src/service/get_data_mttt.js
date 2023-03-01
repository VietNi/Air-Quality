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

module.exports ={}
