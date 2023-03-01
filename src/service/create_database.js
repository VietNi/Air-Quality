// // http://www.steveio.com/2020/07/11/mqtt-to-websockets-esp32-nodejs-d3/

var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://vietnguyen:500anhem@cluster0.6z4y7rp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function connect1() {
  MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("data_mq7", function (err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
}

async function connect2() {
  MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("data_humi", function (err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
}
async function connect3() {
  MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("data_temp", function (err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
}
async function connect4() {
  MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("data_pm25", function (err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
}
connect4()

// module.exports = {connect1, connect2, connect3}