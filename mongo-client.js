const fs = require("fs");
const YAML = require("yaml");
const file = fs.readFileSync("./config-dev.yaml", "utf8");
const config = YAML.parse(file);
const url = config.mongodbURL;
const dbName = config.dbName;

const MongoClient = require("mongodb").MongoClient;

// const mongoClientConnect = function(req, res, callback) {
//   MongoClient.connect(url, function (err, client) {
//     if (err) throw err;
//     let db = client.db(dbName);
//     callback(db, req, res);
//     client.close();
//   });
// };

const mongoClientConnect = (req, res, callbackOperation) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
      if (err) throw reject("Failed to connect to MongoDB Client");
      else resolve(mongoOperation(client, req, res, callbackOperation));
    });
  });
};

const mongoOperation = (client, req, res, callbackOperation) => {
  console.log("Successful connect to MongoDB Client");
  let db = client.db(dbName);
  callbackOperation(db, req, res, client);
};

module.exports.mongoClientConnect = mongoClientConnect;
