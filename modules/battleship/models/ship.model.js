//Module dependencies

const mongoose = require('mongoose');

const { Schema } = mongoose;

const ShipSchema = new Schema({
  boardId: {
    type: Schema.Types.ObjectId,
    ref: 'board'
  },
  model: {
    type: String,
    enum: ["battleship", "cruiser", "destroyer", "submarine"]
  },
  length: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
    default: 1
  },
  location: {
    type: [[Number]],
    required: true
  },
  isHit: {
    type: [Boolean]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ShipSchema.pre('save', function(next) {
  this.length = this.location.length;
  this.isHit = new Array(this.length).fill(false)
  next();
});
mongoose.model('ship', ShipSchema);
module.exports = mongoose.model('ship', ShipSchema);