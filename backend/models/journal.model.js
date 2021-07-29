const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const journalSchema = new Schema({
  title: { type: String, required: true },
  uid: { type: String, required: true },
  authorName: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: false },
  date: { type: Date, required: false },
}, {
  timestamps: true,
});

const Journal = mongoose.model('Journal', journalSchema);

module.exports = Journal;