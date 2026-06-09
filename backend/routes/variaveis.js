const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAgentToken } = require('../middleware/auth');

// Agente envia dados — POST /api/variaveis
router.post('/', requireAgentToken, async (req, res) => {
  const { dosador_id, variaveis } = req.body;
  if (!dosador_id || !variaveis) return res.status(400).json({ error: 'Dados inválidos' });

  try {
    const rows = variaveis.map(v => [dosador_id, v.nome, v.valor, v.unidade || null]);
    await db.query(
      'INSERT INTO leituras (dosador_id, nome_variavel, valor, unidade) VALUES ?',
      [rows]
    );

    // Atualiza snapshot atual
    for (const v of variaveis) {
      await db.query(
        `INSERT INTO snapshot (dosador_id, nome_variavel, valor, unidade, atualizado_em)
         VALUES (?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE valor = VALUES(valor), unidade = VALUES(unidade), atualizado_em = NOW()`,
        [dosador_id, v.nome, v.valor, v.unidade || null]
      );
    }

    res.json({ ok: true, inseridos: rows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar' });
  }
});

// Dashboard lê snapshot atual — GET /api/variaveis/:dosador_id
router.get('/:dosador_id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM snapshot WHERE dosador_id = ? ORDER BY nome_variavel',
      [req.params.dosador_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar' });
  }
});

// Histórico de uma variável — GET /api/variaveis/:dosador_id/historico/:nome
router.get('/:dosador_id/historico/:nome', async (req, res) => {
  const { dosador_id, nome } = req.params;
  const limit = parseInt(req.query.limit) || 100;
  try {
    const [rows] = await db.query(
      `SELECT valor, coletado_em FROM leituras
       WHERE dosador_id = ? AND nome_variavel = ?
       ORDER BY coletado_em DESC LIMIT ?`,
      [dosador_id, nome, limit]
    );
    res.json(rows.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

module.exports = router;
