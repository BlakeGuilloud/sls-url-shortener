const tryParse = body => {
  try {
    return JSON.parse(body);
  } catch (err) {
    return body;
  }
};

const generateRandomString = () => {
  return 'xxxxxx'.replace(/x/g, (c) => {
    return (Math.random() * 36 | 0).toString(36);
  });
};

module.exports = {
  tryParse,
  generateRandomString,
};
