const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    // при создании объекта в DB будет задаваться уникальный индекс, который не позволит дублировать это поле
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Invalid Email",
    },
  },
  password: {
    type: String,
    required: true,
  },
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
