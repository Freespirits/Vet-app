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
  'src/contexts/AuthContext.js': [
    'Usuário',
    'Sessão',
    'Perfil não existe',
  ],
  'src/services/ClientService.js': [
    'Usuário não autenticado',
    'Nome, email e telefone são obrigatórios',
    'Email já cadastrado',
  ],
  'src/services/PetService.js': [
    'Nome e cliente são obrigatórios',
  ],
  'src/services/ConsultationService.js': [
    'Usuário não autenticado',
    'Erro ao buscar estatísticas',
  ],
  'src/services/LibraryService.js': [
    'Usuário não autenticado',
  ],
  'src/services/NotificationService.js': [
    'Notificação',
    'Notificações',
  ],
  'src/navigation/MainNavigator.js': [
    'Biblioteca Veterinária',
    'Início',
  ],
  'src/navigation/AppNavigator.js': [
    'Inicializando aplicação',
  ],
  'src/screens/profile/ProfileScreen.js': [
    'Backup e Restauração',
    'Conta',
    'Configurações',
    'Ajuda e Suporte',
  ],
  'src/screens/profile/AboutScreen.js': [
    'O que é o VetApp?',
    'FAQ',
    'Posso usar em múltiplos dispositivos?',
  ],
  'src/screens/pets/NewPetScreen.js': [
    'Nome é obrigatório',
    'Cliente é obrigatório',
    'Espécie é obrigatória',
    'Sexo é obrigatório',
    'Novo Pet',
    'Cadastrar Pet',
  ],
  'src/screens/clients/ClientListScreen.js': [
    'Nenhum cliente encontrado',
    'Excluir',
    'Confirmar Exclusão',
    'Carregando clientes',
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
