const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert');

const readFile = (relativePath) => {
  const fullPath = path.join(__dirname, '..', relativePath);
  return fs.readFileSync(fullPath, 'utf8');
};

const bannedPhrasesByFile = {
  'Makefile': [
    'Configuração inicial completa do projeto',
    'Instalando dependências',
    'Criando build de produção',
  ],
  'run.sh': [
    'Script de Execução',
    'Modo de Execução',
    'Opção inválida',
  ],
  'install.sh': [
    'Script de Instalação',
    'Instalação interrompida',
  ],
  'src/services/AuthService.js': [
    'Usuário não autenticado',
    'Erro ao obter usuário atual',
  ],
  'src/services/AppointmentService.js': [
    'Erro ao buscar consultas',
  ],
  'db/supabase.sql': [
    'Vacinação Anual',
  ],
};

test('Portuguese phrases are removed from core files', () => {
  for (const [file, phrases] of Object.entries(bannedPhrasesByFile)) {
    const content = readFile(file);
    for (const phrase of phrases) {
      assert.ok(!content.includes(phrase), `${file} ainda contém a frase proibida: ${phrase}`);
    }
  }
});
