const axios    = require('axios');
const PLCClient = require('./plc');
const cfg      = require('./config');

const plc = new PLCClient();

function log(msg) {
  const ts = new Date().toLocaleString('pt-BR');
  console.log(`[${ts}] ${msg}`);
}

function tokenMask(t) {
  if (!t || t.length < 4) return '****';
  return t.slice(0, 3) + '*'.repeat(Math.max(0, t.length - 3));
}

async function enviar(variaveis) {
  let res;
  try {
    res = await axios.post(`${cfg.serverUrl}/api/variaveis`, {
      dosador_id: cfg.dosadorId,
      variaveis,
    }, {
      headers: { 'x-agent-token': cfg.agentToken },
      timeout: 8000,
    });
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      const body   = JSON.stringify(err.response.data);
      if (status === 401) {
        throw new Error(`Servidor rejeitou o token (401) — verifique se AGENT_TOKEN no Railway bate com o .env local (token local: ${tokenMask(cfg.agentToken)})`);
      }
      throw new Error(`Servidor retornou ${status}: ${body}`);
    }
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      throw new Error(`Nao foi possivel conectar ao servidor ${cfg.serverUrl} (${err.code})`);
    }
    throw new Error(`Erro de rede: ${err.message}`);
  }
  return res.data;
}

async function ciclo() {
  // ── PASSO 1: conectar ao PLC ──
  if (!plc.conectado) {
    log(`[PLC] Conectando em ${cfg.plc.ip}:102 rack=${cfg.plc.rack} slot=${cfg.plc.slot}...`);
    try {
      await plc.conectar();
      log(`[PLC] Conectado com sucesso`);
    } catch (err) {
      log(`[PLC] FALHA na conexao: ${err.message}`);
      plc.desconectar();
      return;
    }
  }

  // ── PASSO 2: ler variáveis ──
  let vars;
  try {
    vars = await plc.ler();
    log(`[PLC] Leitura OK:`);
    vars.forEach(v => log(`       ${v.nome.padEnd(14)} = ${String(v.valor).padStart(8)} ${v.unidade}`));
  } catch (err) {
    log(`[PLC] FALHA na leitura: ${err.message}`);
    plc.desconectar();
    return;
  }

  // ── PASSO 3: enviar ao servidor ──
  log(`[HTTP] Enviando para ${cfg.serverUrl}...`);
  try {
    const resp = await enviar(vars);
    log(`[HTTP] OK — servidor confirmou: ${JSON.stringify(resp)}`);
  } catch (err) {
    log(`[HTTP] FALHA no envio: ${err.message}`);
  }
}

log('========================================');
log(' SKN Agente iniciado');
log(`  PLC      : ${cfg.plc.ip} rack=${cfg.plc.rack} slot=${cfg.plc.slot}`);
log(`  Dosador  : ${cfg.dosadorId}`);
log(`  Servidor : ${cfg.serverUrl}`);
log(`  Token    : ${tokenMask(cfg.agentToken)}`);
log(`  Intervalo: ${cfg.intervaloMs}ms`);
log('========================================');
log('');

ciclo();
setInterval(ciclo, cfg.intervaloMs);
