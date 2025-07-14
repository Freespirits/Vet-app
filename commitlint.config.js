module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Tipos permitidos de commit
    'type-enum': [
      2,
      'always',
      [
        'feat',      // Nova funcionalidade
        'fix',       // Correção de bug
        'docs',      // Documentação
        'style',     // Formatação (sem mudança de código)
        'refactor',  // Refatoração
        'test',      // Adição ou modificação de testes
        'chore',     // Tarefas de manutenção
        'perf',      // Melhorias de performance
        'ci',        // Mudanças no CI/CD
        'build',     // Mudanças no sistema de build
        'revert'     // Reverter commit anterior
      ]
    ],

    // Tamanho máximo do assunto
    'subject-max-length': [2, 'always', 72],
    
    // Assunto não pode estar vazio
    'subject-empty': [2, 'never'],
    
    // Assunto deve começar com minúscula
    'subject-case': [2, 'always', 'lower-case'],
    
    // Assunto não deve terminar com ponto
    'subject-full-stop': [2, 'never', '.'],
    
    // Tipo não pode estar vazio
    'type-empty': [2, 'never'],
    
    // Tipo deve estar em minúscula
    'type-case': [2, 'always', 'lower-case'],
    
    // Escopo deve estar em minúscula
    'scope-case': [2, 'always', 'lower-case'],
    
    // Tamanho máximo da linha do corpo
    'body-max-line-length': [1, 'always', 100],
    
    // Tamanho máximo da linha do rodapé
    'footer-max-line-length': [1, 'always', 100]
  },
  
  // Configurações específicas do projeto
  ignores: [
    // Ignorar commits de merge
    (commit) => commit.includes('Merge'),
    
    // Ignorar commits automáticos do Dependabot
    (commit) => commit.includes('dependabot'),
    
    // Ignorar commits iniciais
    (commit) => commit.includes('Initial commit')
  ],
  
  // Funções customizadas de validação
  plugins: [
    {
      rules: {
        // Validar se existe issue relacionada para certos tipos
        'require-issue-ref': (parsed) => {
          const { type, body, footer } = parsed;
          
          // Tipos que requerem referência de issue
          const typesRequiringIssue = ['feat', 'fix'];
          
          if (typesRequiringIssue.includes(type)) {
            const hasIssueRef = 
              (body && /(?:close|closes|fix|fixes|resolve|resolves)\s+#\d+/i.test(body)) ||
              (footer && /(?:close|closes|fix|fixes|resolve|resolves)\s+#\d+/i.test(footer));
            
            return [
              hasIssueRef,
              `Commits do tipo '${type}' devem referenciar uma issue (ex: 'fixes #123')`
            ];
          }
          
          return [true];
        }
      }
    }
  ],
  
  // Configuração para escopos permitidos
  rules: {
    ...module.exports.rules,
    'scope-enum': [
      1,
      'always',
      [
        'auth',        // Autenticação
        'clients',     // Módulo de clientes
        'pets',        // Módulo de pets
        'consultas',   // Módulo de consultas
        'agenda',      // Módulo de agenda
        'biblioteca',  // Biblioteca veterinária
        'perfil',      // Perfil do usuário
        'navegacao',   // Sistema de navegação
        'api',         // Integrações de API
        'db',          // Banco de dados
        'ui',          // Interface do usuário
        'utils',       // Utilitários
        'config',      // Configurações
        'deps',        // Dependências
        'release'      // Releases
      ]
    ]
  }
};
