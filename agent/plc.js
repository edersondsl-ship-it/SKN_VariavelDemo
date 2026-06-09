const NodeS7 = require('nodes7');
const cfg    = require('./config');

class PLCClient {
  constructor() {
    this.conn      = new NodeS7({ silent: true });
    this.conectado = false;
    this.tags      = cfg.variaveis.map(v => v.tag);
  }

  conectar() {
    return new Promise((resolve, reject) => {
      const opts = { host: cfg.plc.ip, rack: cfg.plc.rack, slot: cfg.plc.slot };
      this.conn.initiateConnection(opts, (err) => {
        if (err) {
          this.conectado = false;
          return reject(new Error(`Falha ao conectar: ${err}`));
        }
        this.conectado = true;
        this.conn.addItems(this.tags);
        resolve();
      });
    });
  }

  ler() {
    return new Promise((resolve, reject) => {
      this.conn.readAllItems((err, valores) => {
        if (err) return reject(new Error(`Erro na leitura: ${err}`));

        const resultado = cfg.variaveis.map(v => ({
          nome:    v.nome,
          valor:   parseFloat((valores[v.tag] ?? 0).toFixed(4)),
          unidade: v.unidade,
        }));
        resolve(resultado);
      });
    });
  }

  desconectar() {
    try { this.conn.dropConnection(); } catch (_) {}
    this.conectado = false;
  }
}

module.exports = PLCClient;
