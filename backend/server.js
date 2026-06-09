const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'dba',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dbskndemo'
});

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'skn-demo-secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000
  }
}));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/variaveis', require('./routes/variaveis'));
app.use('/api/dosadores', require('./routes/dosadores'));

// Rota catch-all: serve index.html para rotas não encontradas no frontend
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, '../public/login.html'));
  }
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`SKN Demo rodando na porta ${PORT}`);
});
