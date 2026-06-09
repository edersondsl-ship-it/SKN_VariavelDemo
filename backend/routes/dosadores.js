const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM dosadores ORDER BY nome');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dosadores' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { nome, descricao, ip_plc } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome obrigatório' });
  try {
    const [result] = await db.query(
      'INSERT INTO dosadores (nome, descricao, ip_plc) VALUES (?, ?, ?)',
      [nome, descricao || null, ip_plc || null]
    );
    res.json({ ok: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar' });
  }
});

module.exports = router;
