require('dotenv').config();

module.exports = {
  plc: {
    ip: process.env.PLC_IP || '192.168.1.10',
    rack: parseInt(process.env.PLC_RACK) || 0,
    slot: parseInt(process.env.PLC_SLOT) || 1
  },
  dosadorId: parseInt(process.env.DOSADOR_ID) || 1,
  serverUrl: process.env.SERVER_URL || 'http://localhost:3001',
  agentToken: process.env.AGENT_TOKEN || 'token-secreto-do-agente',
  intervaloMs: parseInt(process.env.INTERVALO_MS) || 5000,

  // Mapeamento das variáveis do CLP
  // Ajuste os endereços DB/offset conforme seu projeto TIA Portal
  variaveis: [
    { nome: 'vazao',       unidade: 'L/h',  db: 1, offset:  0, tipo: 'REAL' },
    { nome: 'pressao',     unidade: 'bar',  db: 1, offset:  4, tipo: 'REAL' },
    { nome: 'temperatura', unidade: '°C',   db: 1, offset:  8, tipo: 'REAL' },
    { nome: 'nivel',       unidade: '%',    db: 1, offset: 12, tipo: 'REAL' },
    { nome: 'total_dose',  unidade: 'L',    db: 1, offset: 16, tipo: 'REAL' },
    { nome: 'motor',       unidade: '',     db: 1, offset: 20, tipo: 'BOOL', bit: 0 },
    { nome: 'alarme',      unidade: '',     db: 1, offset: 20, tipo: 'BOOL', bit: 1 }
  ]
};
