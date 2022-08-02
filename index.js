const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND = 404;
const PORT = '3000';

const PATH = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const talker = await fs.readFile(PATH, 'utf-8');
  if (!talker) return res.status(HTTP_OK_STATUS).json([]);
  res.status(HTTP_OK_STATUS).json(JSON.parse(talker));
});

app.get('/talker/:id', async (req, res) => {
  const talkers = await fs.readFile(PATH, 'utf-8');
  const { id } = req.params;
  const talker = JSON.parse(talkers).find((item) => item.id === Number(id));
  if (!talker) {
    return res.status(HTTP_NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(HTTP_OK_STATUS).json(talker);
});

app.listen(PORT, () => {
  console.log('Online');
});