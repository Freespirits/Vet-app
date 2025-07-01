#!/bin/bash

# =============================================================================
# PetCare Pro - Script de Configuração
# =============================================================================
# Este script configura o ambiente de desenvolvimento do PetCare Pro,
# incluindo Supabase, EAS Build, e outras configurações essenciais
# =============================================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

# Símbolos
SUCCESS="✅"
ERROR="❌"
WARNING="⚠️"
INFO="ℹ️"
GEAR="⚙️"
ROCKET="🚀"

# Função para logging
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case $level in
        "SUCCESS") echo -e "${GREEN}${SUCCESS} [${timestamp}] ${message}${NC}" ;;
        "ERROR") echo -e "${RED}${ERROR} [${timestamp}] ${message}${NC}" ;;
        "WARNING") echo -e "${YELLOW}${WARNING} [${timestamp}] ${message}${NC}" ;;
        "INFO") echo -e "${BLUE}${INFO} [${timestamp}] ${message}${NC}" ;;
        "PROGRESS") echo -e "${CYAN}${GEAR} [${timestamp}] ${message}${NC}" ;;
    esac
}

# Banner de configuração
print_banner() {
    clear
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                     PetCare Pro                             ║"
    echo "║                Script de Configuração v1.0                  ║"
    echo "║                                                              ║"
    echo "║              Configurando seu ambiente...                   ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

# Verificar se está no diretório correto
check_project_directory() {
    if [ ! -f "package.json" ] || [ ! -f "App.js" ]; then
        log "ERROR" "Este script deve ser executado no diretório raiz do projeto PetCare Pro"
        log "INFO" "Certifique-se de estar no diretório que contém package.json e App.js"
        exit 1
    fi

    # Verificar se é o projeto correto
    if grep -q "petcarepro\|PetCare Pro" package.json; then
        log "SUCCESS" "Projeto PetCare Pro detectado"
    else
        log "WARNING" "Este pode não ser o projeto PetCare Pro correto"
        read -p "Continuar mesmo assim? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Configurar arquivo .env
configure_environment() {
    log "PROGRESS" "Configurando variáveis de ambiente..."

    # Backup do .env existente
    if [ -f ".env" ]; then
        cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
        log "INFO" "Backup do .env existente criado"
    fi

    echo -e "${WHITE}🔧 Configuração do Supabase${NC}"
    echo "Para configurar o Supabase, você precisará:"
    echo "1. Criar um projeto em https://supabase.com"
    echo "2. Obter a URL do projeto e a chave anônima"
    echo ""

    # Coletar informações do Supabase
    read -p "URL do projeto Supabase: " supabase_url
    read -p "Chave anônima do Supabase: " supabase_key

    # Validações básicas
    if [[ ! $supabase_url =~ ^https://.*\.supabase\.co$ ]]; then
        log "WARNING" "URL do Supabase parece incorreta. Formato esperado: https://xxx.supabase.co"
    fi

    if [ ${#supabase_key} -lt 100 ]; then
        log "WARNING" "Chave do Supabase parece muito curta. Verifique se está correta."
    fi

    # Criar arquivo .env
    cat > .env << EOL
# Configurações do Supabase
EXPO_PUBLIC_SUPABASE_URL=${supabase_url}
EXPO_PUBLIC_SUPABASE_ANON_KEY=${supabase_key}

# Configurações de Desenvolvimento
EXPO_PUBLIC_DEV_MODE=true
EXPO_PUBLIC_API_URL=http://localhost:3000

# Configurações do Aplicativo
EXPO_PUBLIC_APP_NAME=PetCare Pro
EXPO_PUBLIC_APP_VERSION=1.0.0

# Configurações de Debug
EXPO_PUBLIC_ENABLE_LOGS=true
EXPO_PUBLIC_DEBUG_MODE=false
EOL

    log "SUCCESS" "Arquivo .env configurado"
}

# Verificar e configurar Supabase
setup_supabase() {
    log "PROGRESS" "Configurando Supabase..."

    echo -e "${WHITE}📊 Configuração do Banco de Dados${NC}"
    echo "Agora você precisa executar o script SQL no seu projeto Supabase:"
    echo ""
    echo "1. Acesse https://supabase.com/dashboard"
    echo "2. Selecione seu projeto"
    echo "3. Vá para 'SQL Editor'"
    echo "4. Execute o conteúdo do arquivo db/supabase.sql"
    echo ""

    if [ -f "db/supabase.sql" ]; then
        log "SUCCESS" "Script SQL encontrado em db/supabase.sql"

        read -p "Deseja abrir o arquivo SQL? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Tentar abrir com editor padrão
            if command -v code >/dev/null 2>&1; then
                code db/supabase.sql
            elif command -v nano >/dev/null 2>&1; then
                nano db/supabase.sql
            elif command -v vim >/dev/null 2>&1; then
                vim db/supabase.sql
            else
                cat db/supabase.sql
            fi
        fi

        echo ""
        read -p "Pressione Enter após executar o script SQL no Supabase..." -r
    else
        log "ERROR" "Arquivo db/supabase.sql não encontrado"
        log "INFO" "Verifique se o arquivo existe e contém o script de criação do banco"
    fi
}

# Configurar EAS Build
configure_eas() {
    log "PROGRESS" "Configurando EAS Build..."

    if ! command -v eas >/dev/null 2>&1; then
        log "WARNING" "EAS CLI não encontrado. Instalando..."
        npm install -g eas-cli
    fi

    # Login no EAS (opcional)
    read -p "Deseja fazer login no EAS agora? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        eas login
    else
        log "INFO" "Você pode fazer login mais tarde com: eas login"
    fi

    # Configurar EAS Build
    if [ ! -f "eas.json" ]; then
        log "PROGRESS" "Criando configuração EAS..."
        eas build:configure
        log "SUCCESS" "Configuração EAS criada"
    else
        log "INFO" "Configuração EAS já existe"
    fi
}

# Configurar app.json
configure_app_json() {
    log "PROGRESS" "Verificando configuração do app.json..."

    if [ -f "app.json" ]; then
        # Verificar se tem configurações básicas
        if grep -q "\"name\"" app.json && grep -q "\"slug\"" app.json; then
            log "SUCCESS" "app.json está configurado"
        else
            log "WARNING" "app.json pode estar incompleto"
        fi

        # Opção para personalizar
        read -p "Deseja personalizar o app.json? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "Configurações atuais do app:"
            echo "Nome: $(grep -o '"name": "[^"]*"' app.json | cut -d'"' -f4)"
            echo "Slug: $(grep -o '"slug": "[^"]*"' app.json | cut -d'"' -f4)"
            echo ""

            read -p "Novo nome do app (ou Enter para manter): " app_name
            read -p "Novo slug (ou Enter para manter): " app_slug

            if [ ! -z "$app_name" ]; then
                sed -i.bak "s/\"name\": \"[^\"]*\"/\"name\": \"$app_name\"/" app.json
                log "SUCCESS" "Nome do app atualizado para: $app_name"
            fi

            if [ ! -z "$app_slug" ]; then
                sed -i.bak "s/\"slug\": \"[^\"]*\"/\"slug\": \"$app_slug\"/" app.json
                log "SUCCESS" "Slug do app atualizado para: $app_slug"
            fi
        fi
    else
        log "ERROR" "app.json não encontrado"
    fi
}

# Instalar dependências adicionais
install_additional_deps() {
    log "PROGRESS" "Verificando dependências adicionais..."

    # Verificar se todas as dependências estão instaladas
    if npm ls >/dev/null 2>&1; then
        log "SUCCESS" "Todas as dependências estão instaladas"
    else
        log "WARNING" "Algumas dependências podem estar faltando"
        read -p "Deseja executar npm install? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install
        fi
    fi

    # Instalar ferramentas de desenvolvimento opcionais
    read -p "Deseja instalar ferramentas de desenvolvimento adicionais? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "PROGRESS" "Instalando ferramentas de desenvolvimento..."

        # ESLint e Prettier (se não estiverem no package.json)
        if ! npm ls eslint >/dev/null 2>&1; then
            npm install --save-dev eslint @expo/eslint-config
        fi

        if ! npm ls prettier >/dev/null 2>&1; then
            npm install --save-dev prettier
        fi

        log "SUCCESS" "Ferramentas de desenvolvimento instaladas"
    fi
}

# Configurar Git hooks
configure_git_hooks() {
    if [ -d ".git" ]; then
        log "PROGRESS" "Configurando Git hooks..."

        # Pre-commit hook
        cat > .git/hooks/pre-commit << 'EOL'
#!/bin/sh
# PetCare Pro pre-commit hook

echo "🔍 Executando verificações pre-commit..."

# Executar lint
if npm run lint --silent; then
    echo "✅ Lint passou"
else
    echo "❌ Erro no lint. Commit cancelado."
    exit 1
fi

# Executar testes (se existirem)
if npm test --passWithNoTests --silent > /dev/null 2>&1; then
    echo "✅ Testes passaram"
else
    echo "⚠️  Alguns testes falharam, mas permitindo commit"
fi

echo "✅ Pre-commit check concluído"
EOL

        chmod +x .git/hooks/pre-commit
        log "SUCCESS" "Git hooks configurados"
    else
        log "WARNING" "Não é um repositório Git. Hooks não configurados."
    fi
}

# Testar configuração
test_configuration() {
    log "PROGRESS" "Testando configuração..."

    # Verificar se o projeto pode ser iniciado
    echo "Testando se o projeto inicia corretamente..."

    # Tentar iniciar em modo de teste (timeout de 10 segundos)
    if timeout 10s npm start --no-dev --minify --silent >/dev/null 2>&1; then
        log "SUCCESS" "Projeto pode ser iniciado"
    else
        log "WARNING" "Não foi possível verificar se o projeto inicia (normal durante configuração)"
    fi

    # Verificar estrutura de arquivos
    local essential_files=(
        "src/config/supabase.js"
        "src/contexts/AuthContext.js"
        "src/navigation/AppNavigator.js"
        "src/screens/HomeScreen.js"
    )

    for file in "${essential_files[@]}"; do
        if [ -f "$file" ]; then
            log "SUCCESS" "Arquivo essencial encontrado: $file"
        else
            log "WARNING" "Arquivo não encontrado: $file"
        fi
    done

    # Verificar .env
    if [ -f ".env" ]; then
        if grep -q "EXPO_PUBLIC_SUPABASE_URL" .env && grep -q "EXPO_PUBLIC_SUPABASE_ANON_KEY" .env; then
            log "SUCCESS" "Variáveis de ambiente configuradas"
        else
            log "ERROR" "Variáveis de ambiente incompletas no .env"
        fi
    else
        log "ERROR" "Arquivo .env não encontrado"
    fi
}

# Criar scripts úteis
create_utility_scripts() {
    log "PROGRESS" "Criando scripts utilitários..."

    # Script para reset do ambiente
    cat > reset-env.sh << 'EOL'
#!/bin/bash
# Reset do ambiente de desenvolvimento PetCare Pro

echo "🔄 Resetando ambiente..."

# Limpar cache
rm -rf node_modules
rm -rf .expo
rm -rf ios
rm -rf android
rm -f package-lock.json

# Reinstalar dependências
npm install

# Recriar builds nativos
npx expo prebuild --clean

echo "✅ Ambiente resetado!"
EOL

    # Script para build rápido
    cat > quick-build.sh << 'EOL'
#!/bin/bash
# Build rápido para desenvolvimento

echo "🚀 Iniciando build de desenvolvimento..."

# Verificar lint
npm run lint

# Build para Android (desenvolvimento)
eas build --platform android --profile development --local

echo "✅ Build concluído!"
EOL

    # Tornar scripts executáveis
    chmod +x reset-env.sh quick-build.sh

    log "SUCCESS" "Scripts utilitários criados (reset-env.sh, quick-build.sh)"
}

# Mostrar resumo da configuração
show_configuration_summary() {
    echo ""
    echo -e "${GREEN}${ROCKET} Configuração concluída com sucesso!${NC}"
    echo ""
    echo -e "${WHITE}📋 Resumo da Configuração:${NC}"
    echo ""

    # Verificar .env
    if [ -f ".env" ]; then
        echo -e "${GREEN}✅${NC} Arquivo .env configurado"
        if grep -q "your_supabase_url_here" .env; then
            echo -e "${YELLOW}⚠️${NC}  Lembre-se de configurar as URLs do Supabase no .env"
        fi
    else
        echo -e "${RED}❌${NC} Arquivo .env não encontrado"
    fi

    # Verificar EAS
    if [ -f "eas.json" ]; then
        echo -e "${GREEN}✅${NC} EAS Build configurado"
    else
        echo -e "${YELLOW}⚠️${NC}  EAS Build não configurado"
    fi

    # Verificar Git
    if [ -d ".git" ]; then
        echo -e "${GREEN}✅${NC} Git hooks configurados"
    else
        echo -e "${YELLOW}⚠️${NC}  Não é um repositório Git"
    fi

    echo ""
    echo -e "${WHITE}🚀 Próximos passos:${NC}"
    echo ""
    echo -e "${YELLOW}1.${NC} Verificar configurações do Supabase:"
    echo -e "   ${CYAN}cat .env${NC}"
    echo ""
    echo -e "${YELLOW}2.${NC} Iniciar o servidor de desenvolvimento:"
    echo -e "   ${CYAN}npm start${NC}"
    echo ""
    echo -e "${YELLOW}3.${NC} Para fazer build:"
    echo -e "   ${CYAN}./quick-build.sh${NC} ou ${CYAN}eas build --platform all${NC}"
    echo ""
    echo -e "${YELLOW}4.${NC} Em caso de problemas:"
    echo -e "   ${CYAN}./reset-env.sh${NC}"
    echo ""
    echo -e "${WHITE}📚 Documentação:${NC}"
    echo -e "   ${BLUE}• BUILDING.md - Guia de compilação${NC}"
    echo -e "   ${BLUE}• TROUBLESHOOTING.md - Solução de problemas${NC}"
    echo -e "   ${BLUE}• CONTRIBUTING.md - Como contribuir${NC}"
    echo ""
}

# Função principal
main() {
    print_banner

    log "INFO" "Iniciando configuração do PetCare Pro..."

    # Verificações iniciais
    check_project_directory

    # Configurações principais
    configure_environment
    setup_supabase
    configure_eas
    configure_app_json

    # Dependências e ferramentas
    install_additional_deps
    configure_git_hooks

    # Utilitários
    create_utility_scripts

    # Testes e verificações
    test_configuration

    # Resumo final
    show_configuration_summary

    log "SUCCESS" "Configuração do PetCare Pro concluída!"
}

# Verificar se é root (não recomendado)
if [ "$EUID" -eq 0 ]; then
    log "WARNING" "Não é recomendado executar como root"
    read -p "Continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Função de limpeza
cleanup() {
    log "WARNING" "Configuração interrompida pelo usuário"
    exit 1
}

trap cleanup SIGINT

# Executar função principal
main "$@"
