-- Banco de dados para SKN Demo - Monitor de Dosadores
CREATE DATABASE IF NOT EXISTS dbskndemo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dbskndemo;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  perfil ENUM('admin', 'operador') DEFAULT 'operador',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dosadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  ip_plc VARCHAR(50),
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leituras (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  dosador_id INT NOT NULL,
  nome_variavel VARCHAR(100) NOT NULL,
  valor DOUBLE NOT NULL,
  unidade VARCHAR(20),
  coletado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_dosador_var (dosador_id, nome_variavel),
  INDEX idx_coletado (coletado_em)
);

CREATE TABLE IF NOT EXISTS snapshot (
  dosador_id INT NOT NULL,
  nome_variavel VARCHAR(100) NOT NULL,
  valor DOUBLE NOT NULL,
  unidade VARCHAR(20),
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (dosador_id, nome_variavel)
);

-- Usuário padrão: admin / admin123
INSERT INTO users (usuario, senha, nome, perfil)
VALUES ('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lN4.', 'Administrador', 'admin')
ON DUPLICATE KEY UPDATE id = id;

-- Dosador de exemplo
INSERT INTO dosadores (nome, descricao, ip_plc) VALUES
  ('Dosador 01', 'Linha de produção A', '192.168.1.10')
ON DUPLICATE KEY UPDATE id = id;
