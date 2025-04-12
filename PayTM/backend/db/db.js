const mongoose = require("mongoose");

mongoose.connect("mongodb://sulemanwaraich094:vasion123@cluster0-shard-00-00.1bqjj.mongodb.net:27017,cluster0-shard-00-01.1bqjj.mongodb.net:27017,cluster0-shard-00-02.1bqjj.mongodb.net:27017/PayTM?replicaSet=atlas-pobgge-shard-0&ssl=true&authSource=admin");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxLength: 50,
    required: true,

  },
  lastName: {
    type: String,
    maxLength: 50,
    required: true,

  },
  email: {
    type: String,
    unique: true,
    required: true,

  },
  password: {
    type: String,
    minLength: 6,
    required: true,

  }
});

const accountSchema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {
  User,
  Account
};