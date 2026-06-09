require('dotenv').config();

module.exports = {
  plc: {
    ip:   process.env.PLC_IP   || '192.168.1.10',
    rack: parseInt(process.env.PLC_RACK) || 0,
    slot: parseInt(process.env.PLC_SLOT) || 1,
  },
  dosadorId:   parseInt(process.env.DOSADOR_ID) || 1,
  serverUrl:   process.env.SERVER_URL  || 'http://localhost:3001',
  agentToken:  process.env.AGENT_TOKEN || 'token-secreto-do-agente',
  intervaloMs: parseInt(process.env.INTERVALO_MS) || 10000,

  // Endereços nodes7: 'DB<num>,<tipo><byteOffset>'
  // Ajuste os DBs e offsets conforme seu projeto no TIA Portal
  // IMPORTANTE: no TIA Portal, vá em Propriedades do DB → desmarque "Optimized block access"
  variaveis: [
    { nome: 'pressao',      tag: 'DB1,REAL0',  unidade: 'bar'   },
    { nome: 'temperatura',  tag: 'DB1,REAL4',  unidade: '°C'    },
    { nome: 'vazao',        tag: 'DB1,REAL8',  unidade: 'l/min' },
    { nome: 'ph',           tag: 'DB1,REAL12', unidade: 'pH'    },
    { nome: 'setpoint_ph',  tag: 'DB1,REAL16', unidade: 'pH'    },
    { nome: 'pct_controle', tag: 'DB1,REAL20', unidade: '%'     },
  ],
};
