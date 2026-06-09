// Store em memória — sem banco de dados
// Guarda apenas o último valor recebido de cada dosador

const dosadores = [
  { id: 1, nome: 'Dosador 01', descricao: 'Linha de produção A', ip_plc: '10.21.0.1' }
];

// { dosador_id: { nome_variavel: { valor, unidade, atualizado_em } } }
const snapshot = {};

function upsert(dosadorId, variaveis) {
  if (!snapshot[dosadorId]) snapshot[dosadorId] = {};
  const agora = new Date().toISOString();
  for (const v of variaveis) {
    snapshot[dosadorId][v.nome] = { valor: v.valor, unidade: v.unidade || '', atualizado_em: agora };
  }
}

function getSnapshot(dosadorId) {
  const s = snapshot[dosadorId];
  if (!s) return [];
  return Object.entries(s).map(([nome_variavel, data]) => ({ nome_variavel, ...data }));
}

function listDosadores() { return dosadores; }

module.exports = { upsert, getSnapshot, listDosadores };
