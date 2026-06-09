const snap7 = require('node-snap7');
const config = require('./config');

class S7Client {
  constructor() {
    this.client = new snap7.S7Client();
    this.connected = false;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client.ConnectTo(config.plc.ip, config.plc.rack, config.plc.slot, (err) => {
        if (err) {
          this.connected = false;
          return reject(new Error(`Falha ao conectar no PLC: ${this.client.ErrorText(err)}`));
        }
        this.connected = true;
        console.log(`Conectado ao PLC ${config.plc.ip}`);
        resolve();
      });
    });
  }

  disconnect() {
    this.client.Disconnect();
    this.connected = false;
  }

  lerDB(dbNum, start, size) {
    return new Promise((resolve, reject) => {
      this.client.DBRead(dbNum, start, size, (err, buf) => {
        if (err) return reject(new Error(`Erro ao ler DB${dbNum}: ${this.client.ErrorText(err)}`));
        resolve(buf);
      });
    });
  }

  parsearValor(buffer, offset, tipo, bit) {
    switch (tipo) {
      case 'REAL':
        return parseFloat(buffer.readFloatBE(offset).toFixed(4));
      case 'INT':
        return buffer.readInt16BE(offset);
      case 'WORD':
        return buffer.readUInt16BE(offset);
      case 'DINT':
        return buffer.readInt32BE(offset);
      case 'BOOL': {
        const byte = buffer.readUInt8(offset);
        return (byte >> (bit || 0)) & 1;
      }
      default:
        return null;
    }
  }

  async lerVariaveis() {
    if (!this.connected) await this.connect();

    // Agrupa por DB para fazer uma leitura por bloco
    const dbGroups = {};
    for (const v of config.variaveis) {
      if (!dbGroups[v.db]) dbGroups[v.db] = [];
      dbGroups[v.db].push(v);
    }

    const resultados = [];
    for (const [dbNum, vars] of Object.entries(dbGroups)) {
      const maxOffset = Math.max(...vars.map(v => v.offset + 4));
      const buffer = await this.lerDB(parseInt(dbNum), 0, maxOffset);

      for (const v of vars) {
        const valor = this.parsearValor(buffer, v.offset, v.tipo, v.bit);
        resultados.push({ nome: v.nome, valor, unidade: v.unidade });
      }
    }

    return resultados;
  }
}

module.exports = S7Client;
