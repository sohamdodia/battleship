//Module dependencies

const mongoose = require('mongoose');

const { Schema } = mongoose;

const BoardSchema = new Schema({
  state: {
    type: String,
    enum: ["init", "start", "end"],
    default: "init"
  },
  height: {
    type: Number,
    default: 10
  },
  width: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }  
});

mongoose.model('board', BoardSchema);
module.exports = mongoose.model('board', BoardSchema);