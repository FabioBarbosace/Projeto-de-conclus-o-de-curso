// Registro de Usuário
app.post('/register', async (req, res) => {
  const { name, email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, username, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao registrar usuário' });
  }
});

// Login de Usuário
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ id: user.id }, 'secreto', { expiresIn: '1h' });
  res.json({ token });
});

// Middleware de Autenticação
const authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, 'secreto');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Gerenciamento de Links
app.post('/links', authenticate, async (req, res) => {
  const { title, url, public } = req.body;
  const link = await Link.create({ title, url, public, userId: req.userId });
  res.status(201).json(link);
});

app.get('/links', authenticate, async (req, res) => {
  const links = await Link.findAll({ where: { userId: req.userId } });
  res.json(links);
});

app.put('/links/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, url, public } = req.body;
  const link = await Link.findOne({ where: { id, userId: req.userId } });
  if (!link) {
    return res.status(404).json({ error: 'Link não encontrado' });
  }
  await link.update({ title, url, public });
  res.json(link);
});

app.delete('/links/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const link = await Link.findOne({ where: { id, userId: req.userId } });
  if (!link) {
    return res.status(404).json({ error: 'Link não encontrado' });
  }
  await link.destroy();
  res.status(204).send();
});
