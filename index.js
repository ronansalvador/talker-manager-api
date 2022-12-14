const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');

const { generateToken } = require('./utils/tokenGenerator');
const { validateEmail } = require('./utils/validateEmail');
const { validatePassword } = require('./utils/validatePassword');
const { createTalker } = require('./utils/createTalker');
const { validateToken } = require('./utils/validateToken');
const { validateName } = require('./utils/validateName');
const { validateAge } = require('./utils/validateAge');
const { validateTalk } = require('./utils/validateTalk');
const { validateDate } = require('./utils/validateDate');
const { validateRate } = require('./utils/validateRate');

const app = express();
app.use(bodyParser.json());
const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND = 404;
const PORT = '3000';
const HTTP_CREATED_STATUS = 201;
const HTTP_NO_CONTENT_STATUS = 204;
const PATH = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).json({ message: 'teste de rota principal' });
});

app.get('/talker/search', validateToken, async (req, res) => {
  const { q } = req.query;
  const array = await fs.readFile(PATH, 'utf-8');
  const talkerArray = JSON.parse(array);
  const searchTalkers = talkerArray.filter((item) => item.name.includes(q));
  return res.status(HTTP_OK_STATUS).json(searchTalkers);
});

app.get('/talker', async (_req, res) => {
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

app.post('/login', validateEmail, validatePassword, (_req, res) => {
  const newToken = generateToken();

  res.status(HTTP_OK_STATUS).json({ token: newToken });
});

app.post('/talker', 
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateDate,
  validateRate,
  async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const array = await fs.readFile(PATH, 'utf-8');
  const talkerArray = JSON.parse(array);
  const newId = talkerArray.length + 1;
  const newTalker = { name, id: newId, age, talk: { watchedAt, rate } };

  talkerArray.push(newTalker);
  await createTalker(talkerArray);

  return res.status(HTTP_CREATED_STATUS).json(newTalker);
});

app.put('/talker/:id', 
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateDate,
  validateRate,
  async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const array = await fs.readFile(PATH, 'utf-8');
  const talkerArray = JSON.parse(array);

  const talkerIndex = talkerArray.findIndex((item) => item.id === Number(id));
  talkerArray[talkerIndex] = { ...talkerArray[talkerIndex], name, age, talk };

  await createTalker(talkerArray);

  return res.status(HTTP_OK_STATUS).json(talkerArray[talkerIndex]);
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const array = await fs.readFile(PATH, 'utf-8');
  const talkerArray = JSON.parse(array);
  const filteredTalkers = talkerArray.filter((item) => item.id !== Number(id));

  await createTalker(filteredTalkers);

  return res.status(HTTP_NO_CONTENT_STATUS).end();
});

app.listen(PORT, () => {
  console.log('Online', PORT);
});