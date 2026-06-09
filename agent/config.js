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

  // Mapeamento das variáveis do CLP (ajuste DB/offset conforme TIA Portal)
  variaveis: [
    { nome: 'pressao',      unidade: 'bar', db: 1, offset:  0, tipo: 'REAL' },
    { nome: 'temperatura',  unidade: '°C',  db: 1, offset:  4, tipo: 'REAL' },
    { nome: 'vazao',        unidade: 'l/min', db: 1, offset: 8, tipo: 'REAL' },
    { nome: 'ph',           unidade: 'pH',  db: 1, offset: 12, tipo: 'REAL' },
    { nome: 'setpoint_ph',  unidade: 'pH',  db: 1, offset: 16, tipo: 'REAL' },
    { nome: 'pct_controle', unidade: '%',   db: 1, offset: 20, tipo: 'REAL' },
    { nome: 'status_bomba', unidade: '',    db: 1, offset: 24, tipo: 'BOOL', bit: 0 }
  ]
};
