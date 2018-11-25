const mongoose = require("mongoose");
const { ObjectId } = require("bson");

function required_members(obj, members, res) {
  const errors = {};
  let errors_found = false;

  members.forEach(member => {
    if (obj[member] === undefined) {
      errors_found = true;
      errors[member] = "is required";
    }
  });

  if (errors_found) {
    res.status(400).json({ errors });
    return false;
  }
  return true;
}

async function is_valid_id_for_collection(id, collection, error, res) {
  let _id, obj;
  if (ObjectId.isValid(id)) {
    _id = new ObjectId(id);
    obj = await mongoose.connection.db.collection(collection).findOne({ _id });
  }

  if (!_id || !obj) {
    if (typeof error !== "undefined") {
      res.status(400).json(error);
    }
    return false;
  }
  return obj;
}

module.exports = { required_members, is_valid_id_for_collection };
