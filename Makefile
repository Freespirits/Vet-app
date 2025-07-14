# Makefile para PetCare Pro
# Automatiza tarefas comuns de desenvolvimento e deploy

.PHONY: help install start build test lint format clean setup deploy
.DEFAULT_GOAL := help

# ==============================================================================
# VARIÁVEIS
# ==============================================================================

# Cores para output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
BLUE=\033[0;34m
NC=\033[0m # No Color

# Configurações do projeto
PROJECT_NAME=petcare-pro
NODE_VERSION=18
EXPO_CLI_VERSION=latest

# Diretórios
SRC_DIR=src
BUILD_DIR=build
DIST_DIR=dist
DOCS_DIR=docs
TEST_DIR=__tests__

# ==============================================================================
# HELP - Lista todos os comandos disponíveis
# ==============================================================================

help: ## Mostra esta mensagem de ajuda
	@echo "${BLUE}PetCare Pro - Comandos Disponíveis${NC}"
	@echo "=================================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "${GREEN}%-20s${NC} %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "${YELLOW}Uso: make <comando>${NC}"

# ==============================================================================
# CONFIGURAÇÃO E INSTALAÇÃO
# ==============================================================================

check-node: ## Verifica se Node.js está instalado
	@echo "${BLUE}Verificando Node.js...${NC}"
	@node --version || (echo "${RED}Node.js não encontrado. Instale Node.js ${NODE_VERSION}+${NC}" && exit 1)
	@npm --version || (echo "${RED}NPM não encontrado${NC}" && exit 1)

check-expo: ## Verifica se Expo CLI está instalado
	@echo "${BLUE}Verificando Expo CLI...${NC}"
	@expo --version || (echo "${YELLOW}Expo CLI não encontrado. Instalando...${NC}" && npm install -g expo-cli@${EXPO_CLI_VERSION})

install: check-node ## Instala todas as dependências
	@echo "${BLUE}Instalando dependências...${NC}"
	npm ci
	@echo "${GREEN}✓ Dependências instaladas com sucesso${NC}"

install-dev: install ## Instala dependências incluindo as de desenvolvimento
	@echo "${BLUE}Instalando dependências de desenvolvimento...${NC}"
	npm install --include=dev
	@echo "${GREEN}✓ Dependências de desenvolvimento instaladas${NC}"

setup: check-node check-expo install ## Configuração inicial completa do projeto
	@echo "${BLUE}Configurando projeto...${NC}"
	npm run prepare || true
	@echo "${GREEN}✓ Projeto configurado com sucesso${NC}"
	@echo "${YELLOW}Execute 'make start' para iniciar o desenvolvimento${NC}"

# ==============================================================================
# DESENVOLVIMENTO
# ==============================================================================

start: ## Inicia o servidor de desenvolvimento
	@echo "${BLUE}Iniciando servidor de desenvolvimento...${NC}"
	npm start

start-ios: ## Inicia no simulador iOS
	@echo "${BLUE}Iniciando no iOS...${NC}"
	npm run ios

start-android: ## Inicia no emulador Android
	@echo "${BLUE}Iniciando no Android...${NC}"
	npm run android

start-web: ## Inicia versão web
	@echo "${BLUE}Iniciando versão web...${NC}"
	npm run web

dev: start ## Alias para start

# ==============================================================================
# BUILD E DISTRIBUIÇÃO
# ==============================================================================

build: ## Faz build para produção
	@echo "${BLUE}Criando build de produção...${NC}"
	npm run build
	@echo "${GREEN}✓ Build criado com sucesso${NC}"

build-ios: ## Build para iOS
	@echo "${BLUE}Criando build iOS...${NC}"
	expo build:ios
	@echo "${GREEN}✓ Build iOS criado${NC}"

build-android: ## Build para Android
	@echo "${BLUE}Criando build Android...${NC}"
	expo build:android
	@echo "${GREEN}✓ Build Android criado${NC}"

bundle: ## Cria bundle JavaScript
	@echo "${BLUE}Criando bundle...${NC}"
	npx react-native bundle --platform android --dev false --entry-file App.js --bundle-output android/app/src/main/assets/index.android.bundle
	@echo "${GREEN}✓ Bundle criado${NC}"

# ==============================================================================
# TESTES E QUALIDADE
# ==============================================================================

test: ## Executa todos os testes
	@echo "${BLUE}Executando testes...${NC}"
	npm test
	@echo "${GREEN}✓ Testes executados${NC}"

test-watch: ## Executa testes em modo watch
	@echo "${BLUE}Executando testes em modo watch...${NC}"
	npm run test:watch

test-coverage: ## Executa testes com relatório de cobertura
	@echo "${BLUE}Executando testes com cobertura...${NC}"
	npm run test:coverage
	@echo "${GREEN}✓ Relatório de cobertura gerado${NC}"

test-ci: ## Executa testes para CI/CD
	@echo "${BLUE}Executando testes para CI...${NC}"
	npm run test:ci

lint: ## Executa linting do código
	@echo "${BLUE}Executando linting...${NC}"
	npm run lint
	@echo "${GREEN}✓ Linting concluído${NC}"

lint-fix: ## Corrige automaticamente problemas de linting
	@echo "${BLUE}Corrigindo problemas de linting...${NC}"
	npm run lint:fix
	@echo "${GREEN}✓ Problemas de linting corrigidos${NC}"

format: ## Formata o código com Prettier
	@echo "${BLUE}Formatando código...${NC}"
	npm run format
	@echo "${GREEN}✓ Código formatado${NC}"

quality: lint test ## Executa verificações de qualidade (lint + test)

# ==============================================================================
# LIMPEZA E MANUTENÇÃO
# ==============================================================================

clean: ## Remove arquivos temporários e cache
	@echo "${BLUE}Limpando arquivos temporários...${NC}"
	rm -rf node_modules/.cache
	rm -rf .expo
	rm -rf ${BUILD_DIR}
	rm -rf ${DIST_DIR}
	rm -rf .tmp
	npm cache clean --force
	@echo "${GREEN}✓ Limpeza concluída${NC}"

clean-all: clean ## Limpeza completa incluindo node_modules
	@echo "${BLUE}Removendo node_modules...${NC}"
	rm -rf node_modules
	rm -rf package-lock.json
	@echo "${GREEN}✓ Limpeza completa concluída${NC}"

reset: clean-all install ## Reset completo do projeto

# ==============================================================================
# SEGURANÇA E AUDITORIA
# ==============================================================================

audit: ## Executa auditoria de segurança
	@echo "${BLUE}Executando auditoria de segurança...${NC}"
	npm audit
	@echo "${GREEN}✓ Auditoria concluída${NC}"

audit-fix: ## Corrige vulnerabilidades encontradas
	@echo "${BLUE}Corrigindo vulnerabilidades...${NC}"
	npm audit fix
	@echo "${GREEN}✓ Vulnerabilidades corrigidas${NC}"

security-check: ## Verificações de segurança completas
	@echo "${BLUE}Executando verificações de segurança...${NC}"
	npm run security:check || true
	@echo "${GREEN}✓ Verificações de segurança concluídas${NC}"

# ==============================================================================
# BANCO DE DADOS
# ==============================================================================

db-setup: ## Configura banco de dados
	@echo "${BLUE}Configurando banco de dados...${NC}"
	@if [ -f "db/setup.sql" ]; then \
		echo "Executando setup do banco..."; \
		npm run db:setup; \
	else \
		echo "${YELLOW}Arquivo db/setup.sql não encontrado${NC}"; \
	fi

db-migrate: ## Executa migrações do banco
	@echo "${BLUE}Executando migrações...${NC}"
	npm run db:migrate || echo "${YELLOW}Comando db:migrate não configurado${NC}"

db-seed: ## Popula banco com dados de teste
	@echo "${BLUE}Populando banco com dados de teste...${NC}"
	npm run db:seed || echo "${YELLOW}Comando db:seed não configurado${NC}"

# ==============================================================================
# DOCUMENTAÇÃO
# ==============================================================================

docs: ## Gera documentação
	@echo "${BLUE}Gerando documentação...${NC}"
	@if [ -d "${DOCS_DIR}" ]; then \
		npm run docs:generate || echo "${YELLOW}Comando docs:generate não configurado${NC}"; \
	else \
		echo "${YELLOW}Diretório ${DOCS_DIR} não encontrado${NC}"; \
	fi

docs-serve: ## Serve documentação localmente
	@echo "${BLUE}Servindo documentação...${NC}"
	npm run docs:serve || echo "${YELLOW}Comando docs:serve não configurado${NC}"

# ==============================================================================
# DEPLOY E RELEASE
# ==============================================================================

deploy-staging: ## Deploy para ambiente de staging
	@echo "${BLUE}Fazendo deploy para staging...${NC}"
	npm run deploy:staging
	@echo "${GREEN}✓ Deploy para staging concluído${NC}"

deploy-prod: build ## Deploy para produção
	@echo "${BLUE}Fazendo deploy para produção...${NC}"
	@echo "${RED}⚠️  Você está fazendo deploy para PRODUÇÃO!${NC}"
	@read -p "Tem certeza? (y/N): " confirm && [ "$$confirm" = "y" ]
	npm run deploy:production
	@echo "${GREEN}✓ Deploy para produção concluído${NC}"

release: ## Cria nova release
	@echo "${BLUE}Criando nova release...${NC}"
	npm run release
	@echo "${GREEN}✓ Release criada${NC}"

# ==============================================================================
# UTILITÁRIOS
# ==============================================================================

logs: ## Mostra logs da aplicação
	@echo "${BLUE}Mostrando logs...${NC}"
	npm run logs || expo logs

debug: ## Inicia modo debug
	@echo "${BLUE}Iniciando modo debug...${NC}"
	npm run debug || expo start --dev-client

tunnel: ## Inicia com tunnel público
	@echo "${BLUE}Iniciando com tunnel...${NC}"
	expo start --tunnel

info: ## Mostra informações do ambiente
	@echo "${BLUE}Informações do Ambiente${NC}"
	@echo "========================"
	@echo "${GREEN}Node.js:${NC} $$(node --version)"
	@echo "${GREEN}NPM:${NC} $$(npm --version)"
	@echo "${GREEN}Expo CLI:${NC} $$(expo --version 2>/dev/null || echo 'Não instalado')"
	@echo "${GREEN}Sistema:${NC} $$(uname -s)"
	@echo "${GREEN}Arquitetura:${NC} $$(uname -m)"
	@echo "${GREEN}Diretório:${NC} $$(pwd)"
	@echo "${GREEN}Git Branch:${NC} $$(git branch --show-current 2>/dev/null || echo 'N/A')"
	@echo "${GREEN}Git Status:${NC} $$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ') arquivos modificados"

dependencies: ## Lista dependências do projeto
	@echo "${BLUE}Dependências do Projeto${NC}"
	@echo "======================="
	@npm list --depth=0

outdated: ## Verifica dependências desatualizadas
	@echo "${BLUE}Verificando dependências desatualizadas...${NC}"
	npm outdated

update-deps: ## Atualiza dependências
	@echo "${BLUE}Atualizando dependências...${NC}"
	npm update
	@echo "${GREEN}✓ Dependências atualizadas${NC}"

# ==============================================================================
# COMANDOS COMPOSTOS
# ==============================================================================

ci: install lint test build ## Pipeline completa de CI
	@echo "${GREEN}✓ Pipeline de CI concluída com sucesso${NC}"

full-check: clean install lint test-coverage audit build ## Verificação completa do projeto
	@echo "${GREEN}✓ Verificação completa concluída${NC}"

quick-check: lint test ## Verificação rápida (lint + test)
	@echo "${GREEN}✓ Verificação rápida concluída${NC}"

# ==============================================================================
# ALIASES ÚTEIS
# ==============================================================================

i: install ## Alias para install
s: start ## Alias para start
b: build ## Alias para build
t: test ## Alias para test
l: lint ## Alias para lint
f: format ## Alias para format
c: clean ## Alias para clean
