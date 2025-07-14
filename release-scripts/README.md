# Scripts de Release - PetCare Pro

Este diretório contém scripts para automatizar o processo de release e deploy do PetCare Pro.

## 📁 Estrutura

```
release-scripts/
├── prepare-release.sh      # Prepara nova release
├── build-android.sh        # Build para Android
├── build-ios.sh           # Build para iOS
├── deploy-staging.sh      # Deploy para staging
├── deploy-production.sh   # Deploy para produção
├── version-bump.js        # Atualiza versões
├── changelog-generator.js # Gera changelog
├── post-release.sh        # Ações pós-release
└── utils/                 # Utilitários auxiliares
```

## 🚀 Scripts Disponíveis

### prepare-release.sh
Prepara uma nova release do projeto.

```bash
# Uso
./prepare-release.sh [major|minor|patch]

# Exemplos
./prepare-release.sh patch   # 1.0.0 -> 1.0.1
./prepare-release.sh minor   # 1.0.0 -> 1.1.0
./prepare-release.sh major   # 1.0.0 -> 2.0.0
```

**O que faz:**
- Verifica se branch está limpa
- Executa testes
- Atualiza versão no package.json
- Gera changelog
- Cria commit de release
- Cria tag Git

### build-android.sh
Cria build otimizado para Android.

```bash
./build-android.sh [environment]

# Exemplos
./build-android.sh staging
./build-android.sh production
```

**O que faz:**
- Limpa builds anteriores
- Configura ambiente
- Executa build Expo/EAS
- Valida APK gerado
- Upload para Play Console (prod)

### build-ios.sh
Cria build otimizado para iOS.

```bash
./build-ios.sh [environment]

# Exemplos
./build-ios.sh staging
./build-ios.sh production
```

**O que faz:**
- Limpa builds anteriores
- Configura certificados
- Executa build Expo/EAS
- Valida IPA gerado
- Upload para App Store Connect (prod)

### deploy-staging.sh
Deploy para ambiente de staging.

```bash
./deploy-staging.sh
```

**O que faz:**
- Verifica pré-requisitos
- Executa testes
- Faz build
- Deploy para Expo staging
- Executa smoke tests
- Notifica equipe

### deploy-production.sh
Deploy para produção (requer confirmação).

```bash
./deploy-production.sh
```

**O que faz:**
- Solicita confirmação múltipla
- Verifica se está na branch main
- Executa todos os testes
- Cria backup
- Deploy para produção
- Monitora deploy
- Notifica stakeholders

### version-bump.js
Utilitário para atualizar versões.

```bash
node version-bump.js [type] [--dry-run]

# Exemplos
node version-bump.js patch
node version-bump.js minor --dry-run
```

### changelog-generator.js
Gera changelog automaticamente.

```bash
node changelog-generator.js [from-tag] [to-tag]

# Exemplos
node changelog-generator.js v1.0.0 v1.1.0
node changelog-generator.js --last-release
```

### post-release.sh
Ações executadas após release.

```bash
./post-release.sh [version]
```

**O que faz:**
- Atualiza documentação
- Cria release no GitHub
- Notifica canais de comunicação
- Agenda próximos milestones
- Limpa arquivos temporários

## ⚙️ Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` no diretório:

```bash
# Expo/EAS
EXPO_TOKEN=seu_token_expo
EAS_BUILD_PROFILE=production

# App Stores
APPLE_ID=seu_apple_id
APPLE_PASSWORD=senha_app_specific
GOOGLE_PLAY_KEY=caminho_para_key.json

# Notificações
SLACK_WEBHOOK=url_do_webhook_slack
DISCORD_WEBHOOK=url_do_webhook_discord

# GitHub
GITHUB_TOKEN=seu_token_github

# Monitoramento
SENTRY_ORG=organizacao_sentry
SENTRY_PROJECT=projeto_sentry
```

### Pré-requisitos
```bash
# Instalar dependências
npm install -g expo-cli eas-cli

# Fazer login nos serviços
expo login
eas login

# Configurar certificados iOS
eas credentials

# Configurar Google Play
# (Seguir documentação Expo)
```

## 🔧 Personalização

### Hooks Personalizados
Crie hooks em `utils/hooks/`:

```bash
# Pre-build hook
utils/hooks/pre-build.sh

# Post-build hook  
utils/hooks/post-build.sh

# Pre-deploy hook
utils/hooks/pre-deploy.sh

# Post-deploy hook
utils/hooks/post-deploy.sh
```

### Configurações por Ambiente
```bash
utils/configs/
├── staging.env
├── production.env
└── development.env
```

## 📊 Monitoramento

### Logs de Release
Todos os scripts geram logs em:
```bash
logs/
├── release-YYYY-MM-DD.log
├── build-android-YYYY-MM-DD.log
├── build-ios-YYYY-MM-DD.log
└── deploy-YYYY-MM-DD.log
```

### Métricas
Scripts coletam métricas:
- Tempo de build
- Tamanho dos bundles
- Tempo de deploy
- Taxa de sucesso

## 🚨 Rollback

### Em caso de problemas:

```bash
# Rollback rápido
./utils/rollback.sh [version]

# Rollback com validação
./utils/rollback.sh [version] --validate
```

## 📝 Convenções

### Versionamento
Seguimos [Semantic Versioning](https://semver.org/):
- **MAJOR**: Mudanças incompatíveis
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções compatíveis

### Branches
- `main` - Produção
- `develop` - Desenvolvimento
- `release/x.x.x` - Preparação de release
- `hotfix/x.x.x` - Correções urgentes

### Tags
```bash
# Formato: vMAJOR.MINOR.PATCH
v1.0.0
v1.1.0
v2.0.0-beta.1
```

## 🔐 Segurança

### Secrets Management
- Use variáveis de ambiente
- Nunca commite credenciais
- Rotate tokens regularmente
- Use secrets do CI/CD

### Validações
- Verificação de assinatura
- Scan de vulnerabilidades
- Validação de integridade
- Testes de segurança

## 📞 Suporte

Em caso de problemas:
1. Verifique logs em `logs/`
2. Consulte troubleshooting em `utils/troubleshooting.md`
3. Contate a equipe DevOps
4. Abra issue no GitHub

## 🤝 Contribuindo

1. Teste scripts localmente
2. Documente mudanças
3. Atualize este README
4. Solicite review da equipe DevOps
