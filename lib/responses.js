const defaultDestination = 'http://docs.av1.io';

const handleRedirect = (destination = defaultDestination) => ({
  statusCode: 302,
  headers: {
    Location: destination,
  },
});

const handleSuccess = data => ({
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
  statusCode: 200,
  body: JSON.stringify(data),
});

const handleError = err => ({
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
  statusCode: 500,
  err: `${err}`, // Weird.. the Error object won't return unless interpolated as string.
});

module.exports = {
  handleError,
  handleRedirect,
  handleSuccess,
}