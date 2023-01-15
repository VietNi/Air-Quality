var express = require("express");
var MongoClient = require('mongodb').MongoClient;
const assert = require("assert");
var router = express.Router();
const uri = "mongodb+srv://vietnguyen:500anhem@cluster0.6z4y7rp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let data_raw = {}
let data_home = {
        humi: '',
        temp: '',
        co2: ''
}
router.get("/home", async function (req, res) {
        const db = client.db("mydb");
        const collection = db.collection("data_humi");
        data_raw = await collection.find({}).sort({ Time: -1 }).limit(1).toArray()
        data_home.humi = JSON.stringify(data_raw).substring(86, 91)
        const collection1 = db.collection("data_temp");
        data_raw = await collection1.find({}).sort({ Time: -1 }).limit(1).toArray()
        data_home.temp = JSON.stringify(data_raw).substring(86, 91)
        const collection2 = db.collection("data_mq7");
        data_raw = await collection2.find({}).sort({ Time: -1 }).limit(1).toArray()
        data_home.co2 = JSON.stringify(data_raw).substring(85, 89)
        res.render("../views/home", { "data_home": data_home })
});

router.get("/humi", async function (req, res) {
        const db = client.db("mydb");
        const collection = db.collection("data_humi");
        await collection.find({}).sort({ Time: -1 }).toArray(function (err, humi_list) {
                assert.equal(err, null);
                res.render("../views/humi", { "data_humi": humi_list })
        });
});

router.get("/temp", async function (req, res) {
        const db = client.db("mydb");
        const collection = db.collection("data_temp");
        await collection.find({}).sort({ Time: -1 }).toArray(function (err, temp_list) {
                assert.equal(err, null);
                res.render("../views/temp", { "data_temp": temp_list })
        });
});

router.get("/gas", async function (req, res) {
        const db = client.db("mydb");
        const collection = db.collection("data_mq7");
        await collection.find({}).sort({ Time: -1 }).toArray(function (err, mq7_list) {
                assert.equal(err, null);
                res.render("../views/gas", { "data_mq7": mq7_list })
        });
});

router.post("/home", async function (req, res) {
        const db = client.db("mydb");
        const collection = db.collection("data_humi");
        data_raw = await collection.find({}).sort({ Time: -1 }).limit(1).toArray()
        data_home.humi = JSON.stringify(data_raw).substring(86, 91)
        const collection1 = db.collection("data_temp");
        data_raw = await collection1.find({}).sort({ Time: -1 }).limit(1).toArray()
        data_home.temp = JSON.stringify(data_raw).substring(86, 91)
        const collection2 = db.collection("data_mq7");
        data_raw = await collection2.find({}).sort({ Time: -1 }).limit(1).toArray()
        data_home.co2 = JSON.stringify(data_raw).substring(85, 89)
        res.render("../views/home", { "data_home": data_home })
});


module.exports = router;