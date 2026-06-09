const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;
  if (!usuario || !senha) return res.status(400).json({ error: 'Usuário e senha obrigatórios' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE usuario = ?', [usuario]);
    if (!rows.length) return res.status(401).json({ error: 'Usuário ou senha inválidos' });

    const user = rows[0];
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).json({ error: 'Usuário ou senha inválidos' });

    req.session.user = { id: user.id, usuario: user.usuario, nome: user.nome, perfil: user.perfil };
    res.json({ ok: true, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', (req, res) => {
  if (req.session?.user) return res.json(req.session.user);
  res.status(401).json({ error: 'Não autenticado' });
});

module.exports = router;
