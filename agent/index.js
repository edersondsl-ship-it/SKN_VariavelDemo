const axios = require('axios');
const S7Client = require('./s7client');
const config = require('./config');

const plc = new S7Client();

async function enviarDados(variaveis) {
  await axios.post(`${config.serverUrl}/api/variaveis`, {
    dosador_id: config.dosadorId,
    variaveis
  }, {
    headers: { 'x-agent-token': config.agentToken },
    timeout: 5000
  });
}

async function ciclo() {
  try {
    const variaveis = await plc.lerVariaveis();
    await enviarDados(variaveis);
    console.log(`[${new Date().toISOString()}] ${variaveis.length} variáveis enviadas`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ERRO: ${err.message}`);
    // Tenta reconectar no próximo ciclo
    if (plc.connected) {
      plc.disconnect();
    }
  }
}

console.log(`Agente SKN Demo iniciado`);
console.log(`PLC: ${config.plc.ip}  |  Dosador ID: ${config.dosadorId}`);
console.log(`Servidor: ${config.serverUrl}`);
console.log(`Intervalo: ${config.intervaloMs}ms\n`);

ciclo();
setInterval(ciclo, config.intervaloMs);
