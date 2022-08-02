const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const HTTP_OK_STATUS = 200;
const PORT = '3000';

const PATH = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const talker = await fs.readFile(PATH, 'utf-8');
  if (!talker) return res.status(200).json([]);
  res.status(200).json(JSON.parse(talker));
});

app.listen(PORT, () => {
  console.log('Online');
});