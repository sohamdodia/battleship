const mongoose = require('mongoose');

const { Schema } = mongoose;

const AttackSchema = new Schema({
  boardId: {
    type: Schema.Types.ObjectId,
    'ref': 'board'
  },
  shipId: {
    type: Schema.Types.ObjectId,
    'ref': 'ship'
  },
  location: {
    type: [Number]
  },
  action: {
    type: String,
    enum: ["miss", "hit"],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }  
});

mongoose.model('attack', AttackSchema);
module.exports = mongoose.model('attack', AttackSchema);
