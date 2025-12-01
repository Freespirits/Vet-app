#!/bin/bash

# =============================================================================
# PetCare Pro - Script de Instalação Automatizada
# =============================================================================
# Este script automatiza a instalação e configuração do ambiente de
# desenvolvimento para o aplicativo PetCare Pro
# =============================================================================

set -e  # Para execução em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Símbolos
SUCCESS="✅"
ERROR="❌"
WARNING="⚠️"
INFO="ℹ️"
ROCKET="🚀"
GEAR="⚙️"

# Banner de boas-vindas
print_banner() {
    clear
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                        PetCare Pro                          ║"
    echo "║                 Script de Instalação v1.0                   ║"
    echo "║                                                              ║"
    echo "║           Sistema Completo para Veterinários                ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

# Função para logging
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case $level in
        "SUCCESS")
            echo -e "${GREEN}${SUCCESS} [${timestamp}] ${message}${NC}"
            ;;
        "ERROR")
            echo -e "${RED}${ERROR} [${timestamp}] ${message}${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}${WARNING} [${timestamp}] ${message}${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}${INFO} [${timestamp}] ${message}${NC}"
            ;;
        "PROGRESS")
            echo -e "${CYAN}${GEAR} [${timestamp}] ${message}${NC}"
            ;;
    esac
}

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para verificar versão do Node.js
check_node_version() {
    if command_exists node; then
        local node_version=$(node --version | cut -d'v' -f2)
        local major_version=$(echo $node_version | cut -d'.' -f1)

        if [ "$major_version" -ge 18 ]; then
            log "SUCCESS" "Node.js v$node_version encontrado"
            return 0
        else
            log "WARNING" "Node.js v$node_version encontrado, mas é recomendado v18+"
            return 1
        fi
    else
        log "ERROR" "Node.js não encontrado"
        return 1
    fi
}

# Função para instalar Node.js
install_nodejs() {
    log "PROGRESS" "Instalando Node.js..."

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            brew install node
        else
            log "ERROR" "Homebrew não encontrado. Instale em: https://brew.sh/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command_exists apt-get; then
            # Ubuntu/Debian
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif command_exists yum; then
            # CentOS/RHEL
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
            sudo yum install -y nodejs npm
        else
            log "ERROR" "Gerenciador de pacotes não suportado"
            exit 1
        fi
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        # Windows
        log "WARNING" "Windows detectado. Baixe Node.js de: https://nodejs.org/"
        log "INFO" "Ou use: winget install OpenJS.NodeJS"
        exit 1
    else
        log "ERROR" "Sistema operacional não suportado: $OSTYPE"
        exit 1
    fi
}

# Função para instalar Expo CLI
# Função para instalar Expo CLI (pulada, usamos CLI local via npx)
install_expo_cli() {
    log "PROGRESS" "Pulando instalação global do Expo CLI (use npx expo)..."
    return 0
}

# Função para instalar EAS CLI (pulada)
install_eas_cli() {
    log "PROGRESS" "Pulando instalação global do EAS CLI (use npx eas se necessário)..."
    return 0
}

# Função para verificar Git
check_git() {
    if command_exists git; then
        local git_version=$(git --version | awk '{print $3}')
        log "SUCCESS" "Git $git_version encontrado"
        return 0
    else
        log "ERROR" "Git não encontrado"
        return 1
    fi
}

# Função para instalar Git
install_git() {
    log "PROGRESS" "Instalando Git..."

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            brew install git
        else
            log "INFO" "Instale Git de: https://git-scm.com/download/mac"
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command_exists apt-get; then
            sudo apt-get update
            sudo apt-get install -y git
        elif command_exists yum; then
            sudo yum install -y git
        fi
    else
        log "INFO" "Instale Git de: https://git-scm.com/downloads"
    fi
}

# Função para clonar repositório
clone_repository() {
    local repo_url="https://github.com/PetCareAi/consultorio-app.git"
    local project_dir="petcare-pro"

    if [ -d "$project_dir" ]; then
        log "WARNING" "Diretório $project_dir já existe"
        read -p "Deseja remover e clonar novamente? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$project_dir"
        else
            log "INFO" "Usando diretório existente"
            cd "$project_dir"
            return 0
        fi
    fi

    log "PROGRESS" "Clonando repositório PetCare Pro..."

    if git clone "$repo_url" "$project_dir"; then
        log "SUCCESS" "Repositório clonado com sucesso"
        cd "$project_dir"
    else
        log "ERROR" "Falha ao clonar repositório"
        exit 1
    fi
}

# Função para instalar dependências do projeto
install_dependencies() {
    log "PROGRESS" "Instalando dependências do projeto..."

    if [ -f "package.json" ]; then
        if npm install; then
            log "SUCCESS" "Dependências instaladas com sucesso"
        else
            log "ERROR" "Falha ao instalar dependências"
            exit 1
        fi
    else
        log "ERROR" "package.json não encontrado"
        exit 1
    fi
}

# Função para configurar ambiente
setup_environment() {
    log "PROGRESS" "Configurando ambiente de desenvolvimento..."

    # Criar arquivo .env se não existir
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log "SUCCESS" "Arquivo .env criado a partir do exemplo"
        else
            # Criar .env básico
            cat > .env << EOL
# Configurações do Supabase
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Configurações de Desenvolvimento
EXPO_PUBLIC_DEV_MODE=true
EXPO_PUBLIC_API_URL=http://localhost:3000
EOL
            log "SUCCESS" "Arquivo .env criado"
        fi

        log "WARNING" "Configure o arquivo .env com suas credenciais do Supabase"
    else
        log "INFO" "Arquivo .env já existe"
    fi
}

# Função para verificar Android SDK (opcional)
check_android_sdk() {
    if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
        log "SUCCESS" "Android SDK encontrado em: $ANDROID_HOME"
    else
        log "WARNING" "Android SDK não encontrado"
        log "INFO" "Para desenvolvimento Android, instale Android Studio"
        log "INFO" "Download: https://developer.android.com/studio"
    fi
}

# Função para verificar Xcode (macOS apenas)
check_xcode() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command_exists xcodebuild; then
            local xcode_version=$(xcodebuild -version | head -n1)
            log "SUCCESS" "$xcode_version encontrado"
        else
            log "WARNING" "Xcode não encontrado"
            log "INFO" "Para desenvolvimento iOS, instale Xcode da App Store"
        fi
    fi
}

# Função para executar testes básicos
run_basic_tests() {
    log "PROGRESS" "Executando verificações básicas..."

    # Verificar se o projeto pode ser iniciado
    if npm run lint --silent > /dev/null 2>&1; then
        log "SUCCESS" "Lint passou"
    else
        log "WARNING" "Alguns problemas de lint encontrados"
    fi

    # Verificar estrutura de arquivos essenciais
    local essential_files=("package.json" "App.js" "src/config/supabase.js")

    for file in "${essential_files[@]}"; do
        if [ -f "$file" ]; then
            log "SUCCESS" "Arquivo essencial encontrado: $file"
        else
            log "ERROR" "Arquivo essencial não encontrado: $file"
        fi
    done
}

# Função para mostrar próximos passos
show_next_steps() {
    echo ""
    echo -e "${GREEN}${ROCKET} Instalação concluída com sucesso!${NC}"
    echo ""
    echo -e "${WHITE}📋 Próximos passos:${NC}"
    echo ""
    echo -e "${YELLOW}1.${NC} Configure o arquivo .env com suas credenciais do Supabase:"
    echo -e "   ${CYAN}nano .env${NC}"
    echo ""
    echo -e "${YELLOW}2.${NC} Execute o banco de dados SQL:"
    echo -e "   ${CYAN}# Copie e execute o conteúdo de db/supabase.sql no seu projeto Supabase${NC}"
    echo ""
    echo -e "${YELLOW}3.${NC} Inicie o servidor de desenvolvimento:"
    echo -e "   ${CYAN}npm start${NC}"
    echo ""
    echo -e "${YELLOW}4.${NC} Para testar em dispositivo físico:"
    echo -e "   ${CYAN}# Instale o app 'Expo Go' no seu dispositivo${NC}"
    echo -e "   ${CYAN}# Escaneie o QR code que aparecerá${NC}"
    echo ""
    echo -e "${YELLOW}5.${NC} Para compilar para produção:"
    echo -e "   ${CYAN}eas build --platform all${NC}"
    echo ""
    echo -e "${WHITE}📚 Recursos úteis:${NC}"
    echo -e "   ${BLUE}• Documentação: README.md${NC}"
    echo -e "   ${BLUE}• Problemas: TROUBLESHOOTING.md${NC}"
    echo -e "   ${BLUE}• Contribuir: CONTRIBUTING.md${NC}"
    echo ""
    echo -e "${GREEN}Divirta-se desenvolvendo com PetCare Pro! 🐾${NC}"
}

# Função principal
main() {
    print_banner

    log "INFO" "Iniciando instalação do PetCare Pro..."

    # Verificações de pré-requisitos
    log "PROGRESS" "Verificando pré-requisitos..."

    # Verificar/instalar Git
    if ! check_git; then
        install_git
    fi

    # Verificar/instalar Node.js
    if ! check_node_version; then
        read -p "Deseja instalar Node.js v18+? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_nodejs
        else
            log "ERROR" "Node.js v18+ é obrigatório"
            exit 1
        fi
    fi

    # Verificar se npm está funcionando
    if ! command_exists npm; then
        log "ERROR" "npm não encontrado após instalação do Node.js"
        exit 1
    fi

    # Instalar ferramentas globais
    install_expo_cli
    install_eas_cli

    # Configurar projeto
    clone_repository
    install_dependencies
    setup_environment

    # Verificações opcionais
    check_android_sdk
    check_xcode

    # Testes básicos
    run_basic_tests

    # Finalização
    show_next_steps

    log "SUCCESS" "Instalação do PetCare Pro concluída!"
}

# Função de limpeza em caso de interrupção
cleanup() {
    log "WARNING" "Instalação interrompida pelo usuário"
    exit 1
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Verificar se é root (não recomendado)
if [ "$EUID" -eq 0 ]; then
    log "WARNING" "Não é recomendado executar como root"
    read -p "Continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Executar função principal
main "$@"
