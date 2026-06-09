require('dotenv').config();

module.exports = {
  plc: {
    ip:   process.env.PLC_IP   || '10.21.0.1',
    rack: parseInt(process.env.PLC_RACK) || 0,
    slot: parseInt(process.env.PLC_SLOT) || 1,
  },
  dosadorId:   parseInt(process.env.DOSADOR_ID) || 1,
  serverUrl:   process.env.SERVER_URL  || 'https://sinkron.up.railway.app',
  agentToken:  process.env.AGENT_TOKEN || 'token-secreto-do-agente',
  intervaloMs: parseInt(process.env.INTERVALO_MS) || 10000,

  // DB_Web — DB51 — CPU 10.21.0.1
  // IMPORTANTE: Propriedades do DB → desmarcar "Optimized block access"
  //             Propriedades CPU → Proteção → habilitar PUT/GET
  variaveis: [
    { nome: 'pressao',      tag: 'DB51,REAL0',  unidade: 'bar'   },  // PT
    { nome: 'temperatura',  tag: 'DB51,REAL4',  unidade: '°C'    },  // TT
    { nome: 'vazao',        tag: 'DB51,REAL8',  unidade: 'l/min' },  // VZ
    { nome: 'ph',           tag: 'DB51,REAL12', unidade: 'pH'    },  // Ph
    { nome: 'setpoint_ph',  tag: 'DB51,REAL16', unidade: 'pH'    },  // SP_PH
    { nome: 'pct_controle', tag: 'DB51,REAL20', unidade: '%'     },  // pct_ctrl
  ],
};
