const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/variaveis', require('./routes/variaveis'));
app.use('/api/dosadores', require('./routes/dosadores'));

app.get('/api/foto-marketing', (req, res) => {
  const dir = path.join(__dirname, '../public/Foto_marketing');
  try {
    const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png)$/i.test(f));
    res.json(files);
  } catch { res.json([]); }
});

app.get('/api/health', (req, res) => {
  const store = require('./store');
  res.json({ ok: true, dosadores: store.listDosadores().length });
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Rota não encontrada' });
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => console.log(`SKN Demo rodando na porta ${PORT}`));
