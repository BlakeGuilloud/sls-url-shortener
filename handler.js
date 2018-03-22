'use strict';

const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;

const normalizeUrl = require('normalize-url');

const Url = require('./Url.model');

const {
  tryParse,
  generateRandomString,
} = require('./lib/helpers');
const {
  handleError,
  handleRedirect,
  handleSuccess,
} = require('./lib/responses');

module.exports.redirect = (event, context, callback) => {
  const { pathParameters } = event;

  if (pathParameters) {
    mongoose.connect(process.env.MONGODB_URI);

    const { shortUrl } = pathParameters;

    Url.findOne({ shortUrl })
      .then((data) => {
        let destination;

        if (data) {
          const { longUrl } = data;

          destination = longUrl;
        }

        callback(null, handleRedirect(destination));
      })
      .catch((err) => {
        callback(null, handleRedirect());
      })
      .finally(() => {
        mongoose.connection.close();
      });
  } else {
    callback(null, handleRedirect());
  }
};

module.exports.generateShortUrl = (event, context, callback) => {
  const { longUrl } = tryParse(event.body);

  const normalizedLongUrl = normalizeUrl(longUrl);

  mongoose.connect(process.env.MONGODB_URI);


  Url.findOne({ longUrl: normalizedLongUrl })
    .then((data) => {
      // If this longUrl already exists, don't create a new one, just use the existing shortUrl.
      if (data) {
        callback(null, handleSuccess(data));
      } else {
        return generateUniqueShortUrl()
          .then((shortUrl) => {
            return Url.create({ shortUrl, longUrl: normalizedLongUrl });
          })
          .then((data) => {
            callback(null, handleSuccess(data));
          });
      }
    })
    .catch((err) => {
      callback(null, handleError(err));
    })
    .finally(() => {
      mongoose.connection.close();
    });


  function generateUniqueShortUrl(retryCount = 0) {
    if (retryCount >= 10) {
      throw new Error('Could not generate a unique url.');
    }

    const shortUrl = generateRandomString();

    return Url
      .findOne({ shortUrl })
      .then((data) => {
        if (data) {
          return generateUniqueShortUrl(retryCount + 1);
        }

        return shortUrl;
      });
  }
}