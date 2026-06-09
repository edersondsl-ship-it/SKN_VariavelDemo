const axios   = require('axios');
const PLCClient = require('./plc');
const cfg     = require('./config');

const plc = new PLCClient();

function log(msg) {
  const ts = new Date().toLocaleString('pt-BR');
  console.log(`[${ts}] ${msg}`);
}

async function enviar(variaveis) {
  await axios.post(`${cfg.serverUrl}/api/variaveis`, {
    dosador_id: cfg.dosadorId,
    variaveis,
  }, {
    headers: { 'x-agent-token': cfg.agentToken },
    timeout: 8000,
  });
}

async function ciclo() {
  try {
    if (!plc.conectado) {
      log('Conectando ao PLC...');
      await plc.conectar();
      log(`Conectado em ${cfg.plc.ip}`);
    }

    const vars = await plc.ler();
    await enviar(vars);
    log(`OK — ${vars.length} variáveis enviadas`);

  } catch (err) {
    log(`ERRO: ${err.message}`);
    plc.desconectar();
  }
}

log('=== SKN Agente iniciado ===');
log(`PLC: ${cfg.plc.ip} | Dosador: ${cfg.dosadorId} | Intervalo: ${cfg.intervaloMs}ms`);
log(`Servidor: ${cfg.serverUrl}`);
log('');

ciclo();
setInterval(ciclo, cfg.intervaloMs);
