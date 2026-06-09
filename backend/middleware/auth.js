function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  if (req.headers['accept'] === 'application/json' || req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  return res.redirect('/login.html');
}

function requireAgentToken(req, res, next) {
  const token = req.headers['x-agent-token'];
  if (token && token === process.env.AGENT_TOKEN) return next();
  return res.status(401).json({ error: 'Token inválido' });
}

module.exports = { requireAuth, requireAgentToken };
