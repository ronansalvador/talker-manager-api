const fs = require('fs/promises');

const createTalker = (newTalker) => fs.writeFile('./talker.json', JSON.stringify(newTalker));

module.exports = {
  createTalker,
};