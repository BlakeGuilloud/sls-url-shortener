const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  shortUrl: {
    type: String,
    required: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  baseUrl: {
    type: String,
    default: 'http://av1.io'
  },
});

module.exports = mongoose.model('Url', UrlSchema);