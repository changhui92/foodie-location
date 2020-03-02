const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const bodyParser = require("body-parser");
const schemas = require("./schemas-all");
const { Validator } = require("jsonschema");
const { mongoClientConnect } = require("./mongo-client");
const ObjectId = require("mongodb").ObjectID;
app.use(bodyParser.json());

const v = new Validator();
v.addSchema(schemas.addressSchema, "/Address");

app.get("/", (req, res) => {
  mongoClientConnect(req, res, findAllFoodiesLocation);
});

function findAllFoodiesLocation(db, req, res) {
  // Get the documents collection
  let collection = db.collection("foodiesLocations");
  collection.find({}).toArray((err, docs) => {
    if (err) throw err;
    res.send(docs);
  });
}

app.get("/:id", (req, res) => {
  mongoClientConnect(req, res, findOneFoodiesLocation);
});

function findOneFoodiesLocation(db, req, res, client) {
  const id = req.params.id;
  isIdValid(id)
  .then((message) => {
    const collection = db.collection("foodiesLocations");
    return collection.findOne({ _id: ObjectId(`${id}`) });
  })
  .then((queryResult) => {
    res.status(200);
    res.send(queryResult);
    client.close();
  })
  .catch((err) => {
    res.status(400);
    res.send(err.message);
    client.close();
  });
}

function isIdValid(id) {
  const valid = ObjectId.isValid(id);
  return new Promise((resolve, reject) => {
    if (valid){
      console.log(`Resource ID ${id} is valid`);
      resolve(`Resource ID ${id} is valid`);
    }
    else {
      console.log(`Resource ID ${id} is invalid`);
      reject(`Resource ID ${id} is invalid`);
    }
  });
};

app.post("/", function (req, res) {
  mongoClientConnect(req, res, insertFoodiesLocation);
});

function insertFoodiesLocation(db, req, res) {
  const collection = db.collection("foodiesLocations");
  const input = req.body;
  const validationResult = v.validate(input, schemas.foodieSchema);
  if (validationResult.valid) {
    let result = collection.insertOne(input, {}, (err, result) => {
      if (err) throw err;
      return result;
    });
    res.send(result);
  } else {
    res.status(400);
    res.send(validationResult.errors);
  };
}

/*
app.patch("/:id", function (req, res) {
  console.log(req.params.id);
  mongoClientConnect(req, res, editFoodiesLocation);
});

function editFoodiesLocation(db, req, res) {
  const id = req.params.id;
  const collection = db.collection("foodiesLocations");
  collection.findOne({"_id": "5e3525c3806c6b2925129ac7"});

  console.log(result);
  res.status(200);
  res.send(result);
}
*/

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT} ...`);
});
