const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, User, Link } = require('./models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());

// Rotas e lógica da aplicação aqui

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
