#!/bin/bash

# =============================================================================
# PetCare Pro - Script de Execução
# =============================================================================
# Este script facilita a execução do PetCare Pro em diferentes modos e
# plataformas, com verificações automáticas e opções de desenvolvimento
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
PHONE="📱"
COMPUTER="💻"

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

# Banner principal
print_banner() {
    clear
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                      PetCare Pro                            ║"
    echo "║                   Script de Execução v1.0                   ║"
    echo "║                                                              ║"
    echo "║              🚀 Pronto para desenvolvimento!                ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

# Função para mostrar help
show_help() {
    echo -e "${WHITE}📖 PetCare Pro - Guia de Execução${NC}"
    echo ""
    echo -e "${YELLOW}Uso:${NC} ./run.sh [opção]"
    echo ""
    echo -e "${YELLOW}Opções disponíveis:${NC}"
    echo ""
    echo -e "${CYAN}  start${NC}          Inicia servidor de desenvolvimento"
    echo -e "${CYAN}  ios${NC}            Inicia para iOS"
    echo -e "${CYAN}  android${NC}        Inicia para Android"
    echo -e "${CYAN}  web${NC}            Inicia para Web"
    echo -e "${CYAN}  tunnel${NC}         Inicia com tunnel (rede externa)"
    echo -e "${CYAN}  build${NC}          Menu de builds"
    echo -e "${CYAN}  test${NC}           Executa testes"
    echo -e "${CYAN}  lint${NC}           Executa verificação de código"
    echo -e "${CYAN}  clean${NC}          Limpa cache e dependências"
    echo -e "${CYAN}  check${NC}          Verifica status do projeto"
    echo -e "${CYAN}  doctor${NC}         Diagnóstico completo"
    echo -e "${CYAN}  help${NC}           Mostra esta ajuda"
    echo ""
    echo -e "${YELLOW}Exemplos:${NC}"
    echo -e "${CYAN}  ./run.sh start${NC}    # Inicia desenvolvimento normal"
    echo -e "${CYAN}  ./run.sh ios${NC}      # Testa no simulador iOS"
    echo -e "${CYAN}  ./run.sh build${NC}    # Menu de opções de build"
    echo -e "${CYAN}  ./run.sh doctor${NC}   # Diagnóstico completo"
    echo ""
}

# Verificar se está no diretório correto
check_project_directory() {
    if [ ! -f "package.json" ] || [ ! -f "App.js" ]; then
        log "ERROR" "Execute este script no diretório raiz do projeto PetCare Pro"
        exit 1
    fi

    if grep -q "petcarepro\|PetCare Pro" package.json; then
        log "SUCCESS" "Projeto PetCare Pro detectado"
    else
        log "WARNING" "Este pode não ser o projeto PetCare Pro correto"
    fi
}

# Verificar pré-requisitos
check_prerequisites() {
    local errors=0

    log "PROGRESS" "Verificando pré-requisitos..."

    # Node.js
    if command -v node >/dev/null 2>&1; then
        local node_version=$(node --version | cut -d'v' -f2)
        local major_version=$(echo $node_version | cut -d'.' -f1)

        if [ "$major_version" -ge 18 ]; then
            log "SUCCESS" "Node.js v$node_version ✓"
        else
            log "ERROR" "Node.js v$node_version é muito antiga. Necessário v18+"
            errors=$((errors + 1))
        fi
    else
        log "ERROR" "Node.js não encontrado"
        errors=$((errors + 1))
    fi

    # npm
    if command -v npm >/dev/null 2>&1; then
        local npm_version=$(npm --version)
        log "SUCCESS" "npm v$npm_version ✓"
    else
        log "ERROR" "npm não encontrado"
        errors=$((errors + 1))
    fi

    # Expo CLI
    if command -v npx >/dev/null 2>&1; then
        if npx expo --version >/dev/null 2>&1; then
            log "SUCCESS" "Expo CLI ✓"
        else
            log "WARNING" "Expo CLI não encontrado. Será instalado automaticamente."
        fi
    else
        log "ERROR" "npx não encontrado"
        errors=$((errors + 1))
    fi

    # Verificar .env
    if [ -f ".env" ]; then
        if grep -q "EXPO_PUBLIC_SUPABASE_URL" .env && grep -q "EXPO_PUBLIC_SUPABASE_ANON_KEY" .env; then
            log "SUCCESS" "Arquivo .env configurado ✓"
        else
            log "WARNING" "Arquivo .env incompleto"
        fi
    else
        log "WARNING" "Arquivo .env não encontrado"
    fi

    # Verificar node_modules
    if [ -d "node_modules" ]; then
        log "SUCCESS" "Dependências instaladas ✓"
    else
        log "WARNING" "Dependências não instaladas. Execute: npm install"
    fi

    return $errors
}

# Instalar dependências se necessário
ensure_dependencies() {
    if [ ! -d "node_modules" ]; then
        log "PROGRESS" "Instalando dependências..."
        npm install
        log "SUCCESS" "Dependências instaladas"
    fi
}

# Função para iniciar desenvolvimento normal
start_development() {
    log "PROGRESS" "Iniciando servidor de desenvolvimento..."

    ensure_dependencies

    echo ""
    echo -e "${WHITE}📱 Como conectar seu dispositivo:${NC}"
    echo ""
    echo -e "${YELLOW}📱 Dispositivo físico:${NC}"
    echo "   1. Instale o app 'Expo Go' na loja do seu dispositivo"
    echo "   2. Escaneie o QR code que aparecerá"
    echo ""
    echo -e "${YELLOW}💻 Emulador/Simulador:${NC}"
    echo "   • Pressione 'a' para Android"
    echo "   • Pressione 'i' para iOS (macOS apenas)"
    echo "   • Pressione 'w' para Web"
    echo ""
    echo -e "${CYAN}Iniciando em 3 segundos...${NC}"
    sleep 3

    npx expo start
}

# Função para iniciar no iOS
start_ios() {
    if [[ "$OSTYPE" != "darwin"* ]]; then
        log "ERROR" "iOS só é suportado no macOS"
        exit 1
    fi

    ensure_dependencies
    log "PROGRESS" "Iniciando para iOS..."
    npx expo start --ios
}

# Função para iniciar no Android
start_android() {
    ensure_dependencies
    log "PROGRESS" "Iniciando para Android..."

    # Verificar se Android SDK está configurado
    if [ -z "$ANDROID_HOME" ]; then
        log "WARNING" "ANDROID_HOME não configurado. Pode não funcionar em emulador."
    fi

    npx expo start --android
}

# Função para iniciar na web
start_web() {
    ensure_dependencies
    log "PROGRESS" "Iniciando para Web..."
    npx expo start --web
}

# Função para iniciar com tunnel
start_tunnel() {
    ensure_dependencies
    log "PROGRESS" "Iniciando com tunnel (acesso externo)..."
    log "INFO" "Tunnel permite acesso de qualquer rede"
    npx expo start --tunnel
}

# Menu de builds
build_menu() {
    echo -e "${WHITE}🏗️  Menu de Builds${NC}"
    echo ""
    echo "1. Build de desenvolvimento (local)"
    echo "2. Build de desenvolvimento (EAS)"
    echo "3. Build de produção (EAS)"
    echo "4. Build para Android apenas"
    echo "5. Build para iOS apenas"
    echo "6. Verificar status dos builds"
    echo "0. Voltar"
    echo ""

    read -p "Escolha uma opção: " choice

    case $choice in
        1)
            build_local_dev
            ;;
        2)
            build_eas_dev
            ;;
        3)
            build_eas_production
            ;;
        4)
            build_android_only
            ;;
        5)
            build_ios_only
            ;;
        6)
            check_build_status
            ;;
        0)
            return
            ;;
        *)
            log "ERROR" "Opção inválida"
            ;;
    esac
}

# Build de desenvolvimento local
build_local_dev() {
    log "PROGRESS" "Criando build de desenvolvimento local..."

    # Limpar builds anteriores
    rm -rf ios android

    # Prebuild
    npx expo prebuild --clean

    echo ""
    read -p "Executar build para qual plataforma? (android/ios/ambas): " platform

    case $platform in
        "android"|"a")
            npx expo run:android
            ;;
        "ios"|"i")
            if [[ "$OSTYPE" == "darwin"* ]]; then
                npx expo run:ios
            else
                log "ERROR" "iOS só é suportado no macOS"
            fi
            ;;
        "ambas"|"both"|"b")
            npx expo run:android &
            if [[ "$OSTYPE" == "darwin"* ]]; then
                npx expo run:ios &
            fi
            wait
            ;;
        *)
            log "ERROR" "Plataforma inválida"
            ;;
    esac
}

# Build EAS desenvolvimento
build_eas_dev() {
    log "PROGRESS" "Criando build EAS de desenvolvimento..."

    if ! command -v eas >/dev/null 2>&1; then
        log "ERROR" "EAS CLI não encontrado. Instale com: npm install -g eas-cli"
        return 1
    fi

    eas build --platform all --profile development
}

# Build EAS produção
build_eas_production() {
    log "PROGRESS" "Criando build EAS de produção..."

    if ! command -v eas >/dev/null 2>&1; then
        log "ERROR" "EAS CLI não encontrado. Instale com: npm install -g eas-cli"
        return 1
    fi

    echo -e "${YELLOW}⚠️  Build de produção! Certifique-se de que:${NC}"
    echo "   ✓ Todos os testes passam"
    echo "   ✓ Código foi revisado"
    echo "   ✓ Versão foi atualizada"
    echo ""

    read -p "Continuar com build de produção? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        eas build --platform all --profile production
    else
        log "INFO" "Build de produção cancelado"
    fi
}

# Build Android apenas
build_android_only() {
    log "PROGRESS" "Criando build Android..."

    if ! command -v eas >/dev/null 2>&1; then
        log "ERROR" "EAS CLI não encontrado"
        return 1
    fi

    read -p "Perfil (development/preview/production): " profile
    profile=${profile:-development}

    eas build --platform android --profile $profile
}

# Build iOS apenas
build_ios_only() {
    log "PROGRESS" "Criando build iOS..."

    if ! command -v eas >/dev/null 2>&1; then
        log "ERROR" "EAS CLI não encontrado"
        return 1
    fi

    read -p "Perfil (development/preview/production): " profile
    profile=${profile:-development}

    eas build --platform ios --profile $profile
}

# Verificar status dos builds
check_build_status() {
    log "PROGRESS" "Verificando status dos builds..."

    if command -v eas >/dev/null 2>&1; then
        eas build:list
    else
        log "ERROR" "EAS CLI não encontrado"
    fi
}

# Executar testes
run_tests() {
    log "PROGRESS" "Executando testes..."

    ensure_dependencies

    if grep -q "\"test\"" package.json; then
        npm test
    else
        log "WARNING" "Scripts de teste não configurados"
        log "INFO" "Configurando testes básicos..."

        # Executar verificações básicas
        echo "Verificando sintaxe dos arquivos..."

        # Verificar arquivos JavaScript/TypeScript
        find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read file; do
            if node -c "$file" 2>/dev/null; then
                echo "✅ $file"
            else
                echo "❌ $file"
            fi
        done
    fi
}

# Executar lint
run_lint() {
    log "PROGRESS" "Executando verificação de código..."

    ensure_dependencies

    if grep -q "\"lint\"" package.json; then
        npm run lint
    else
        log "WARNING" "ESLint não configurado"

        # Verificação básica com Node.js
        echo "Executando verificação básica de sintaxe..."
        find src -name "*.js" -o -name "*.jsx" | while read file; do
            if node -c "$file" 2>/dev/null; then
                echo "✅ $file"
            else
                echo "❌ $file - erro de sintaxe"
            fi
        done
    fi
}

# Limpar cache e dependências
clean_project() {
    log "PROGRESS" "Limpando projeto..."

    echo "O que deseja limpar?"
    echo "1. Cache do Expo apenas"
    echo "2. node_modules e cache"
    echo "3. Limpeza completa (node_modules, cache, builds)"
    echo "0. Cancelar"

    read -p "Escolha uma opção: " choice

    case $choice in
        1)
            log "PROGRESS" "Limpando cache do Expo..."
            npx expo start --clear
            log "SUCCESS" "Cache do Expo limpo"
            ;;
        2)
            log "PROGRESS" "Limpando node_modules e cache..."
            rm -rf node_modules
            rm -f package-lock.json
            rm -rf .expo
            npm install
            log "SUCCESS" "node_modules e cache limpos"
            ;;
        3)
            log "PROGRESS" "Limpeza completa..."
            rm -rf node_modules
            rm -rf .expo
            rm -rf ios
            rm -rf android
            rm -f package-lock.json
            npm install
            npx expo prebuild --clean
            log "SUCCESS" "Limpeza completa realizada"
            ;;
        0)
            log "INFO" "Limpeza cancelada"
            ;;
        *)
            log "ERROR" "Opção inválida"
            ;;
    esac
}

# Verificar status do projeto
check_status() {
    log "PROGRESS" "Verificando status do projeto..."

    echo ""
    echo -e "${WHITE}📊 Status do Projeto PetCare Pro${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Informações básicas
    if [ -f "package.json" ]; then
        local app_name=$(grep -o '"name": "[^"]*"' package.json | cut -d'"' -f4)
        local app_version=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
        echo -e "${CYAN}📦 Projeto:${NC} $app_name"
        echo -e "${CYAN}🔢 Versão:${NC} $app_version"
    fi

    # Node.js e npm
    if command -v node >/dev/null 2>&1; then
        echo -e "${CYAN}⚡ Node.js:${NC} $(node --version)"
    fi

    if command -v npm >/dev/null 2>&1; then
        echo -e "${CYAN}📦 npm:${NC} v$(npm --version)"
    fi

    # Expo
    if npx expo --version >/dev/null 2>&1; then
        echo -e "${CYAN}🚀 Expo:${NC} v$(npx expo --version 2>/dev/null)"
    fi

    echo ""
    echo -e "${WHITE}📁 Estrutura do Projeto${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Verificar arquivos importantes
    local files_to_check=(
        "package.json:📄 Configuração do projeto"
        "App.js:⚡ Arquivo principal"
        ".env:🔐 Variáveis de ambiente"
        "app.json:📱 Configuração do app"
        "eas.json:🏗️ Configuração EAS"
        "src/config/supabase.js:🗄️ Configuração do banco"
        "src/navigation/AppNavigator.js:🧭 Navegação"
    )

    for item in "${files_to_check[@]}"; do
        local file="${item%%:*}"
        local desc="${item##*:}"

        if [ -f "$file" ]; then
            echo -e "${GREEN}✅${NC} $desc"
        else
            echo -e "${RED}❌${NC} $desc"
        fi
    done

    echo ""
    echo -e "${WHITE}🔧 Dependências${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if [ -d "node_modules" ]; then
        local pkg_count=$(find node_modules -maxdepth 1 -type d | wc -l)
        echo -e "${GREEN}✅${NC} $((pkg_count - 1)) pacotes instalados"

        # Verificar algumas dependências importantes
        local deps_to_check=("react" "react-native" "expo" "@supabase/supabase-js")

        for dep in "${deps_to_check[@]}"; do
            if [ -d "node_modules/$dep" ]; then
                echo -e "${GREEN}✅${NC} $dep"
            else
                echo -e "${RED}❌${NC} $dep"
            fi
        done
    else
        echo -e "${RED}❌${NC} Dependências não instaladas"
    fi

    echo ""
    echo -e "${WHITE}🗄️ Configuração do Banco${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if [ -f ".env" ]; then
        if grep -q "EXPO_PUBLIC_SUPABASE_URL" .env; then
            local supabase_url=$(grep "EXPO_PUBLIC_SUPABASE_URL" .env | cut -d'=' -f2)
            if [[ $supabase_url =~ ^https://.*\.supabase\.co$ ]]; then
                echo -e "${GREEN}✅${NC} URL do Supabase configurada"
            else
                echo -e "${YELLOW}⚠️${NC}  URL do Supabase pode estar incorreta"
            fi
        else
            echo -e "${RED}❌${NC} URL do Supabase não configurada"
        fi

        if grep -q "EXPO_PUBLIC_SUPABASE_ANON_KEY" .env; then
            echo -e "${GREEN}✅${NC} Chave do Supabase configurada"
        else
            echo -e "${RED}❌${NC} Chave do Supabase não configurada"
        fi
    else
        echo -e "${RED}❌${NC} Arquivo .env não encontrado"
    fi

    echo ""
}

# Diagnóstico completo
run_doctor() {
    log "PROGRESS" "Executando diagnóstico completo..."

    print_banner

    # Status do projeto
    check_status

    echo ""
    echo -e "${WHITE}🔍 Diagnóstico Detalhado${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Verificar conectividade
    if command -v curl >/dev/null 2>&1; then
        echo ""
        log "PROGRESS" "Testando conectividade..."

        if curl -s --head --request GET https://expo.dev | grep "200 OK" > /dev/null; then
            echo -e "${GREEN}✅${NC} Conexão com Expo"
        else
            echo -e "${RED}❌${NC} Problemas de conexão com Expo"
        fi

        if [ -f ".env" ] && grep -q "EXPO_PUBLIC_SUPABASE_URL" .env; then
            local supabase_url=$(grep "EXPO_PUBLIC_SUPABASE_URL" .env | cut -d'=' -f2)
            if [ ! -z "$supabase_url" ] && [ "$supabase_url" != "your_supabase_url_here" ]; then
                if curl -s --head --request GET "$supabase_url" | grep "200\|404" > /dev/null; then
                    echo -e "${GREEN}✅${NC} Conexão com Supabase"
                else
                    echo -e "${RED}❌${NC} Problemas de conexão com Supabase"
                fi
            fi
        fi
    fi

    # Verificar portas
    echo ""
    log "PROGRESS" "Verificando portas..."

    local ports_to_check=(19000 19001 19002 8081)
    for port in "${ports_to_check[@]}"; do
        if command -v lsof >/dev/null 2>&1; then
            if lsof -i :$port >/dev/null 2>&1; then
                echo -e "${YELLOW}⚠️${NC}  Porta $port está em uso"
            else
                echo -e "${GREEN}✅${NC} Porta $port disponível"
            fi
        fi
    done

    # Verificar espaço em disco
    echo ""
    log "PROGRESS" "Verificando espaço em disco..."

    if command -v df >/dev/null 2>&1; then
        local available_space=$(df . | tail -1 | awk '{print $4}')
        local available_gb=$((available_space / 1024 / 1024))

        if [ $available_gb -gt 5 ]; then
            echo -e "${GREEN}✅${NC} Espaço em disco: ${available_gb}GB disponível"
        else
            echo -e "${YELLOW}⚠️${NC}  Pouco espaço em disco: ${available_gb}GB disponível"
        fi
    fi

    # Recomendações
    echo ""
    echo -e "${WHITE}💡 Recomendações${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}📝${NC} Configure o arquivo .env com suas credenciais"
    fi

    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦${NC} Execute: npm install"
    fi

    if ! command -v eas >/dev/null 2>&1; then
        echo -e "${YELLOW}🏗️${NC}  Instale EAS CLI: npm install -g eas-cli"
    fi

    echo -e "${GREEN}🚀${NC} Para iniciar: ./run.sh start"
    echo ""
}

# Menu interativo
interactive_menu() {
    while true; do
        print_banner

        echo -e "${WHITE}🚀 Menu Principal - PetCare Pro${NC}"
        echo ""
        echo -e "${CYAN}1.${NC} ${PHONE} Iniciar desenvolvimento"
        echo -e "${CYAN}2.${NC} ${COMPUTER} Desenvolvimento para Web"
        echo -e "${CYAN}3.${NC} 📱 Iniciar para iOS"
        echo -e "${CYAN}4.${NC} 🤖 Iniciar para Android"
        echo -e "${CYAN}5.${NC} 🌐 Iniciar com tunnel"
        echo -e "${CYAN}6.${NC} 🏗️  Menu de builds"
        echo -e "${CYAN}7.${NC} 🧪 Executar testes"
        echo -e "${CYAN}8.${NC} 🔍 Verificar código (lint)"
        echo -e "${CYAN}9.${NC} 🧹 Limpar projeto"
        echo -e "${CYAN}10.${NC} 📊 Status do projeto"
        echo -e "${CYAN}11.${NC} 🩺 Diagnóstico completo"
        echo -e "${CYAN}0.${NC} 🚪 Sair"
        echo ""

        read -p "Escolha uma opção: " choice

        case $choice in
            1) start_development ;;
            2) start_web ;;
            3) start_ios ;;
            4) start_android ;;
            5) start_tunnel ;;
            6) build_menu ;;
            7) run_tests ;;
            8) run_lint ;;
            9) clean_project ;;
            10) check_status ;;
            11) run_doctor ;;
            0)
                log "INFO" "Saindo..."
                exit 0
                ;;
            *)
                log "ERROR" "Opção inválida"
                sleep 2
                ;;
        esac

        if [ $choice != 0 ]; then
            echo ""
            read -p "Pressione Enter para continuar..." -r
        fi
    done
}

# Função principal
main() {
    # Verificar diretório do projeto
    check_project_directory

    # Se não há argumentos, mostrar menu interativo
    if [ $# -eq 0 ]; then
        interactive_menu
        exit 0
    fi

    # Processar argumentos da linha de comando
    case $1 in
        "start"|"dev"|"run")
            print_banner
            if ! check_prerequisites; then
                log "ERROR" "Corrija os pré-requisitos antes de continuar"
                exit 1
            fi
            start_development
            ;;
        "ios")
            print_banner
            check_prerequisites
            start_ios
            ;;
        "android")
            print_banner
            check_prerequisites
            start_android
            ;;
        "web")
            print_banner
            check_prerequisites
            start_web
            ;;
        "tunnel")
            print_banner
            check_prerequisites
            start_tunnel
            ;;
        "build")
            print_banner
            build_menu
            ;;
        "test")
            print_banner
            run_tests
            ;;
        "lint")
            print_banner
            run_lint
            ;;
        "clean")
            print_banner
            clean_project
            ;;
        "check"|"status")
            print_banner
            check_status
            ;;
        "doctor"|"diagnose")
            run_doctor
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log "ERROR" "Opção desconhecida: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
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

# Função de limpeza em caso de interrupção
cleanup() {
    log "WARNING" "Execução interrompida pelo usuário"
    exit 1
}

trap cleanup SIGINT

# Executar função principal
main "$@"
