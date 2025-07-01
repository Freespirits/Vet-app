# Git Build Commit Guide - PetCare Pro

Este documento descreve o fluxo de trabalho Git e convenções de commit para o projeto PetCare Pro.

## 🌿 Estratégia de Branching

### Branches Principais
- **main**: Branch de produção, sempre estável
- **develop**: Branch de desenvolvimento, integração de novas features
- **release/x.x.x**: Branches para preparação de releases
- **hotfix/x.x.x**: Correções urgentes para produção

### Branches de Feature
- **feature/nome-da-feature**: Novas funcionalidades
- **bugfix/nome-do-bug**: Correção de bugs
- **chore/nome-da-tarefa**: Tarefas de manutenção
- **docs/nome-da-doc**: Atualizações de documentação

## 📝 Convenções de Commit

### Formato Padrão
```
tipo(escopo): descrição curta

Descrição detalhada (opcional)

- Lista de mudanças (opcional)
- Outras informações relevantes

Closes #123
```

### Tipos de Commit
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Atualizações de documentação
- **style**: Mudanças de formatação (sem impacto na lógica)
- **refactor**: Refatoração de código
- **test**: Adição ou correção de testes
- **chore**: Tarefas de manutenção
- **perf**: Melhorias de performance
- **ci**: Mudanças em CI/CD
- **build**: Mudanças no sistema de build

### Exemplos de Commits
```bash
# Nova funcionalidade
feat(auth): adiciona sistema de recuperação de senha

# Correção de bug
fix(appointments): corrige erro ao agendar consulta para hoje

# Documentação
docs(readme): atualiza instruções de instalação

# Refatoração
refactor(components): reorganiza estrutura de componentes comuns

# Performance
perf(database): otimiza consultas de listagem de pets

# Build/CI
ci(github): adiciona workflow para testes automatizados
```

## 🔄 Fluxo de Desenvolvimento

### 1. Criando uma Nova Feature
```bash
# 1. Atualiza branch develop
git checkout develop
git pull origin develop

# 2. Cria branch da feature
git checkout -b feature/nova-funcionalidade

# 3. Desenvolve a feature
git add .
git commit -m "feat(feature): implementa nova funcionalidade"

# 4. Push da branch
git push -u origin feature/nova-funcionalidade

# 5. Cria Pull Request para develop
```

### 2. Preparando um Release
```bash
# 1. Cria branch de release
git checkout develop
git checkout -b release/1.2.0

# 2. Atualiza versão e changelog
npm version 1.2.0
git add package.json CHANGELOG.md
git commit -m "chore(release): prepara versão 1.2.0"

# 3. Testa e corrige bugs se necessário
git add .
git commit -m "fix(release): corrige problema X antes do release"

# 4. Merge para main e develop
git checkout main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"

git checkout develop
git merge --no-ff release/1.2.0

# 5. Remove branch de release
git branch -d release/1.2.0

# 6. Push tudo
git push origin main develop --tags
```

### 3. Correção Urgente (Hotfix)
```bash
# 1. Cria branch de hotfix a partir de main
git checkout main
git checkout -b hotfix/1.2.1

# 2. Corrige o problema
git add .
git commit -m "fix(critical): corrige bug crítico na autenticação"

# 3. Atualiza versão
npm version patch
git add package.json
git commit -m "chore(hotfix): versão 1.2.1"

# 4. Merge para main e develop
git checkout main
git merge --no-ff hotfix/1.2.1
git tag -a v1.2.1 -m "Hotfix version 1.2.1"

git checkout develop
git merge --no-ff hotfix/1.2.1

# 5. Remove branch de hotfix
git branch -d hotfix/1.2.1

# 6. Push tudo
git push origin main develop --tags
```

## 🏗️ Build e Deploy

### Builds Automáticos

#### GitHub Actions
```yaml
# .github/workflows/build.yml
name: Build and Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test
      - run: npm run lint

  build-android:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx eas build --platform android --non-interactive
```

### Comandos de Build

#### Desenvolvimento
```bash
# Inicia ambiente de desenvolvimento
npm start

# Build local para teste
npx expo prebuild
npx expo run:android
npx expo run:ios
```

#### Produção
```bash
# Build para produção via EAS
eas build --platform all --profile production

# Build local para produção
npx expo export
```

### Versionamento Semântico

#### Formato: MAJOR.MINOR.PATCH
- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

#### Comandos npm version
```bash
# Incrementa patch (1.2.3 → 1.2.4)
npm version patch

# Incrementa minor (1.2.3 → 1.3.0)
npm version minor

# Incrementa major (1.2.3 → 2.0.0)
npm version major

# Versão específica
npm version 1.5.0
```

## 🔍 Code Review

### Checklist para Pull Requests
- [ ] Código segue padrões de estilo do projeto
- [ ] Todos os testes passam
- [ ] Documentação atualizada se necessário
- [ ] Commit messages seguem convenções
- [ ] Sem console.logs ou código de debug
- [ ] Performance não foi impactada negativamente
- [ ] Funcionalidade testada em iOS e Android

### Template de Pull Request
```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Mudança breaking
- [ ] Documentação

## Como Testar
1. Passos para testar
2. Cenários específicos
3. Dispositivos/plataformas testados

## Screenshots
(Se aplicável)

## Checklist
- [ ] Código testado localmente
- [ ] Testes automatizados passando
- [ ] Documentação atualizada
- [ ] Self-review realizado
```

## 📊 Métricas e Qualidade

### Hooks de Git
```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run lint
npm run test:unit
```

### Análise de Código
```bash
# ESLint
npm run lint

# Prettier
npm run format

# Testes
npm test

# Coverage
npm run test:coverage
```

## 🚀 Deploy Automático

### Triggers de Deploy
- **main**: Deploy automático para produção
- **develop**: Deploy para ambiente de staging
- **tags v\***: Release oficial

### Workflow de Deploy
```bash
# 1. Merge aprovado para main
# 2. CI executa testes
# 3. Build automático via EAS
# 4. Deploy para lojas (se configurado)
# 5. Notificação de sucesso/falha
```

## 📋 Comandos Úteis

### Git Shortcuts
```bash
# Status resumido
git status -s

# Log com grafo
git log --oneline --graph --decorate

# Diferenças staged
git diff --cached

# Último commit
git show

# Branches remotas
git branch -r

# Limpa branches locais órfãs
git remote prune origin
```

### Aliases Recomendados
```bash
# Adicione ao ~/.gitconfig
[alias]
    st = status -s
    co = checkout
    br = branch
    ci = commit
    lg = log --oneline --graph --decorate
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = !gitk
```

## 🔒 Segurança

### Informações Sensíveis
- **NUNCA** commite keys/secrets
- Use `.env` files (já no .gitignore)
- Revise diffs antes de commits
- Use `.gitignore` apropriado

### .gitignore Essencial
```
# Dependências
node_modules/

# Builds
dist/
build/
.expo/

# Ambiente
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/

# Logs
*.log

# Sistema
.DS_Store
Thumbs.db
```

Esta estratégia garante um desenvolvimento organizado e releases estáveis do PetCare Pro.
