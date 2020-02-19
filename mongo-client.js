const fs = require("fs");
const YAML = require("yaml");
const file = fs.readFileSync("./config-dev.yaml", "utf8");
const config = YAML.parse(file);
const url = config.mongodbURL;
const dbName = config.dbName;

const MongoClient = require("mongodb").MongoClient;

function mongoClientConnect(req, res, callback) {
    MongoClient.connect(url, function (err, client) {
        if (err) throw err;
        let db = client.db(dbName);
        callback(db, req, res);
        client.close();
    });
};

module.exports.mongoClientConnect = mongoClientConnect;
