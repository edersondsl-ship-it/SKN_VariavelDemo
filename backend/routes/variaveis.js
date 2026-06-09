const express = require('express');
const router  = express.Router();
const store   = require('../store');

function requireAgentToken(req, res, next) {
  const token = req.headers['x-agent-token'];
  if (token && token === (process.env.AGENT_TOKEN || 'token-secreto-do-agente')) return next();
  return res.status(401).json({ error: 'Token inválido' });
}

// Agente envia dados
router.post('/', requireAgentToken, (req, res) => {
  const { dosador_id, variaveis } = req.body;
  if (!dosador_id || !variaveis) return res.status(400).json({ error: 'Dados inválidos' });
  store.upsert(dosador_id, variaveis);
  res.json({ ok: true, recebidos: variaveis.length });
});

// Dashboard lê snapshot
router.get('/:dosador_id', (req, res) => {
  res.json(store.getSnapshot(parseInt(req.params.dosador_id)));
});

module.exports = router;
