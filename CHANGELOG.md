# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não Lançado]

### Planejado
- Modo escuro
- Sincronização em tempo real
- Notificações push
- Sistema de templates para consultas
- Relatórios avançados
- API REST pública

## [1.0.0] - 2024-07-01

### Adicionado
- 🎉 **Lançamento inicial do PetCare Pro**
- 🔐 Sistema completo de autenticação com Supabase
- 👥 Gestão completa de clientes com validação de dados
- 🐾 Gestão de pets com histórico médico
- 🩺 Sistema de consultas veterinárias com prontuário digital
- 📅 Agendamento de consultas com calendário interativo
- 📚 Biblioteca veterinária com medicamentos e procedimentos
- 💾 Sistema de backup e restauração de dados
- 📊 Dashboard com estatísticas em tempo real
- 🔍 Sistema de busca unificado
- 📱 Interface responsiva e moderna
- 🎨 Design system consistente com cores e componentes
- 🔒 Segurança de dados com criptografia
- 📲 Funcionamento offline básico
- 🌐 Sincronização automática com nuvem
- 📋 Validação robusta de formulários
- 🎯 Navegação intuitiva por tabs e stack
- 💳 Cálculo de preços e valores de consultas

### Funcionalidades Principais
- **Autenticação Segura**: Login/registro com validação e recuperação de senha
- **Gestão de Clientes**: CRUD completo com busca e validação de CPF/email
- **Gestão de Pets**: Cadastro detalhado com espécie, raça, idade automática
- **Consultas Veterinárias**: Prontuário digital com sintomas, diagnóstico, tratamento
- **Agendamento**: Calendário com visualização diária, semanal e mensal
- **Biblioteca**: Medicamentos, vacinas e procedimentos pré-cadastrados
- **Dashboard**: Visão geral com métricas e ações rápidas
- **Backup**: Criação e restauração manual de dados
- **Perfil**: Gerenciamento de dados pessoais e configurações

### Tecnologias Implementadas
- React Native 0.79.2
- Expo SDK 53
- Supabase (Database + Auth)
- React Navigation 6
- AsyncStorage
- React Context API
- Linear Gradient
- Gesture Handler
- Image Picker
- Date-fns

### Arquivos e Estrutura
- 📁 Estrutura modular por features
- 🧩 Componentes reutilizáveis (Input, Button, Card, Loading)
- 🎨 Sistema de cores e estilos globais
- 🔧 Services para lógica de negócio
- 🛠️ Utils para validação e formatação
- 📊 Constants para dados estáticos
- 🗄️ Configuração centralizada do Supabase

### Performance e Qualidade
- ⚡ Carregamento rápido com lazy loading
- 💾 Cache inteligente de dados
- 🔄 Estados de loading e erro tratados
- ✅ Validação de dados em tempo real
- 📱 Interface responsiva para diferentes tamanhos
- 🔒 Tratamento seguro de dados sensíveis

## [0.9.5] - 2024-06-15

### Adicionado
- Tela de agendamento com seletor de data/hora
- Validação de conflitos de horários
- Status de agendamentos (agendado, confirmado, cancelado)
- Filtros de busca por tipo de consulta

### Corrigido
- Bug na sincronização de dados offline
- Erro ao salvar consultas com campos vazios
- Problema de performance em listas grandes
- Crash ao selecionar datas no calendário

### Alterado
- Melhorada a interface do calendário
- Otimização das consultas ao banco de dados
- Atualização do sistema de cores

## [0.9.0] - 2024-06-01

### Adicionado
- Sistema básico de agendamento
- Tela de biblioteca veterinária
- Componentes de Input e Button personalizados
- Validação de formulários aprimorada
- Sistema de navegação por tabs

### Corrigido
- Erro na criação de usuários
- Problema de formatação de telefone
- Bug na validação de CPF

### Alterado
- Reestruturação da arquitetura de pastas
- Migração para Expo SDK 53
- Atualização do React Native para 0.79.2

## [0.8.5] - 2024-05-15

### Adicionado
- CRUD completo de pets
- Tela de detalhes do paciente
- Sistema de busca básico
- Backup manual de dados

### Corrigido
- Crash ao abrir tela de perfil
- Erro na formatação de datas
- Problema de memória em imagens

### Segurança
- Implementação de validação server-side
- Criptografia de dados sensíveis
- Timeout de sessão automático

## [0.8.0] - 2024-05-01

### Adicionado
- CRUD completo de clientes
- Sistema de autenticação com Supabase
- Tela de perfil do usuário
- Validação de email e telefone

### Corrigido
- Erro de conexão com o banco
- Problema na navegação entre telas
- Bug na validação de formulários

### Alterado
- Migração do Firebase para Supabase
- Nova arquitetura de componentes
- Sistema de cores atualizado

## [0.7.5] - 2024-04-15

### Adicionado
- Tela inicial com dashboard básico
- Componentes de loading e erro
- Sistema de cores e estilos globais
- Configuração básica do projeto

### Corrigido
- Problemas de build do projeto
- Erros de dependências
- Configuração do Metro bundler

## [0.7.0] - 2024-04-01

### Adicionado
- 🎉 **Início do projeto PetCare Pro**
- Configuração inicial do React Native
- Estrutura básica de pastas
- Configuração do Expo
- Setup inicial do ESLint e Prettier

### Infraestrutura
- Configuração do repositório Git
- Setup do ambiente de desenvolvimento
- Documentação inicial
- Configuração do package.json

---

## Tipos de Mudanças

- `Adicionado` para novas funcionalidades
- `Alterado` para mudanças em funcionalidades existentes
- `Descontinuado` para funcionalidades que serão removidas
- `Removido` para funcionalidades removidas
- `Corrigido` para correções de bugs
- `Segurança` para correções de vulnerabilidades

## Convencões de Versionamento

Este projeto segue o [Versionamento Semântico](https://semver.org/lang/pt-BR/):

- **MAJOR** (X.0.0): Mudanças incompatíveis na API
- **MINOR** (0.X.0): Funcionalidades adicionadas de forma compatível
- **PATCH** (0.0.X): Correções de bugs compatíveis

### Exemplos
- `1.0.0`: Primeira versão estável
- `1.1.0`: Nova funcionalidade compatível
- `1.1.1`: Correção de bug
- `2.0.0`: Mudança que quebra compatibilidade

## Links Úteis

- [Repositório no GitHub](https://github.com/PetCareAi/consultorio-app)
- [Issues e Bugs](https://github.com/PetCareAi/consultorio-app/issues)
- [Releases](https://github.com/PetCareAi/consultorio-app/releases)
- [Roadmap](https://github.com/PetCareAi/consultorio-app/projects)

---

**Nota**: As datas seguem o formato AAAA-MM-DD para melhor ordenação cronológica.
