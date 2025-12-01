#!/bin/bash

# =============================================================================
# PetCare Pro - סקריפט התקנה אוטומטי
# =============================================================================
# סקריפט זה מאיץ את התקנת ההגדרות של סביבת הפיתוח
# desenvolvimento para o aplicativo PetCare Pro
# =============================================================================

set -e  # כדי לעצור במקרה של שגיאה

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# סמלים
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
    echo "║                 סקריפט התקנה v1.0                   ║"
    echo "║                                                              ║"
    echo "║           מערכת מלאה לווטרינרים                ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

# פונקציה ללוגים
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

# פונקציה לבדיקה שהפקודה קיימת
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# פונקציה לבדוק את גרסת Node.js
check_node_version() {
    if command_exists node; then
        local node_version=$(node --version | cut -d'v' -f2)
        local major_version=$(echo $node_version | cut -d'.' -f1)

        if [ "$major_version" -ge 18 ]; then
            log "SUCCESS" "Node.js v$node_version encontrado"
            return 0
        else
            log "WARNING" "נמצאה גרסת Node.js v$node_version, מומלץ v18+"
            return 1
        fi
    else
        log "ERROR" "Node.js לא נמצא"
        return 1
    fi
}

# פונקציה להתקנת Node.js
install_nodejs() {
    log "PROGRESS" "Instalando Node.js..."

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            brew install node
        else
            log "ERROR" "Homebrew לא נמצא. התקינו בכתובת: https://brew.sh/"
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
            log "ERROR" "מנהל החבילות אינו נתמך"
            exit 1
        fi
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        # Windows
        log "WARNING" "Windows detectado. Baixe Node.js de: https://nodejs.org/"
        log "INFO" "Ou use: winget install OpenJS.NodeJS"
        exit 1
    else
        log "ERROR" "מערכת ההפעלה אינה נתמכת: $OSTYPE"
        exit 1
    fi
}

# פונקציה להתקנת Expo CLI
# פונקציה להתקנת Expo CLI (pulada, usamos CLI local via npx)
install_expo_cli() {
    log "PROGRESS" "מדלגים על התקנה גלובלית של Expo CLI (השתמשו ב-npx expo)..."
    return 0
}

# פונקציה להתקנת EAS CLI (מדולגת)
install_eas_cli() {
    log "PROGRESS" "מדלגים על התקנה גלובלית של EAS CLI (השתמשו ב-npx eas בעת הצורך)..."
    return 0
}

# פונקציה לבדוק את Git
check_git() {
    if command_exists git; then
        local git_version=$(git --version | awk '{print $3}')
        log "SUCCESS" "Git $git_version encontrado"
        return 0
    else
        log "ERROR" "Git לא נמצא"
        return 1
    fi
}

# פונקציה להתקנת Git
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

# פונקציה לשיבוט המאגר
clone_repository() {
    local repo_url="https://github.com/PetCareAi/consultorio-app.git"
    local project_dir="petcare-pro"

    if [ -d "$project_dir" ]; then
        log "WARNING" "התיקייה $project_dir כבר קיימת"
        read -p "Deseja remover e clonar novamente? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$project_dir"
        else
            log "INFO" "משתמשים בתיקייה קיימת"
            cd "$project_dir"
            return 0
        fi
    fi

    log "PROGRESS" "משכפל את מאגר PetCare Pro..."

    if git clone "$repo_url" "$project_dir"; then
        log "SUCCESS" "המאגר שוכפל בהצלחה"
        cd "$project_dir"
    else
        log "ERROR" "שגיאה בשכפול המאגר"
        exit 1
    fi
}

# פונקציה להתקנת תלויות הפרויקט
install_dependencies() {
    log "PROGRESS" "מתקין את תלויות הפרויקט..."

    if [ -f "package.json" ]; then
        if npm install; then
            log "SUCCESS" "התלויות הותקנו בהצלחה"
        else
            log "ERROR" "כשל בהתקנת תלויות"
            exit 1
        fi
    else
        log "ERROR" "package.json לא נמצא"
        exit 1
    fi
}

# פונקציה להגדרת הסביבה
setup_environment() {
    log "PROGRESS" "Configurando ambiente de desenvolvimento..."

    # יצירת קובץ .env אם אינו קיים
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log "SUCCESS" "Arquivo .env criado a partir do exemplo"
        else
            # יצירת קובץ .env בסיסי
            cat > .env << EOL
# הגדרות Supabase
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# הגדרות פיתוח
EXPO_PUBLIC_DEV_MODE=true
EXPO_PUBLIC_API_URL=http://localhost:3000
EOL
            log "SUCCESS" "Arquivo .env criado"
        fi

        log "WARNING" "Configure o arquivo .env com suas credenciais do Supabase"
    else
        log "INFO" "קובץ .env כבר קיים"
    fi
}

# פונקציה לבדוק Android SDK (רשות)
check_android_sdk() {
    if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
        log "SUCCESS" "Android SDK encontrado em: $ANDROID_HOME"
    else
        log "WARNING" "Android SDK לא נמצא"
        log "INFO" "Para desenvolvimento Android, instale Android Studio"
        log "INFO" "Download: https://developer.android.com/studio"
    fi
}

# פונקציה לבדוק Xcode (macOS בלבד)
check_xcode() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command_exists xcodebuild; then
            local xcode_version=$(xcodebuild -version | head -n1)
            log "SUCCESS" "$xcode_version encontrado"
        else
            log "WARNING" "Xcode לא נמצא"
            log "INFO" "Para desenvolvimento iOS, instale Xcode da App Store"
        fi
    fi
}

# פונקציה להרצת בדיקות בסיסיות
run_basic_tests() {
    log "PROGRESS" "מריץ בדיקות בסיסיות..."

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
            log "ERROR" "קובץ חיוני לא נמצא: $file"
        fi
    done
}

# פונקציה להצגת הצעדים הבאים
show_next_steps() {
    echo ""
    echo -e "${GREEN}${ROCKET} ההתקנה הושלמה בהצלחה!${NC}"
    echo ""
    echo -e "${WHITE}📋 צעדים הבאים:${NC}"
    echo ""
    echo -e "${YELLOW}1.${NC} Configure o arquivo .env com suas credenciais do Supabase:"
    echo -e "   ${CYAN}nano .env${NC}"
    echo ""
    echo -e "${YELLOW}2.${NC} Execute o banco de dados SQL:"
    echo -e "   ${CYAN}# העתיקו והריצו את התוכן של db/supabase.sql בפרויקט Supabase שלכם${NC}"
    echo ""
    echo -e "${YELLOW}3.${NC} Inicie o servidor de desenvolvimento:"
    echo -e "   ${CYAN}npm start${NC}"
    echo ""
    echo -e "${YELLOW}4.${NC} כדי לבדוק במכשיר פיזי:"
    echo -e "   ${CYAN}# Instale o app 'Expo Go' no seu dispositivo${NC}"
    echo -e "   ${CYAN}# סרקו את קוד ה-QR שיופיע${NC}"
    echo ""
    echo -e "${YELLOW}5.${NC} כדי לקמפל לפרודקשן:"
    echo -e "   ${CYAN}eas build --platform all${NC}"
    echo ""
    echo -e "${WHITE}📚 משאבים שימושיים:${NC}"
    echo -e "   ${BLUE}• תיעוד: README.md${NC}"
    echo -e "   ${BLUE}• Problemas: TROUBLESHOOTING.md${NC}"
    echo -e "   ${BLUE}• Contribuir: CONTRIBUTING.md${NC}"
    echo ""
    echo -e "${GREEN}Divirta-se desenvolvendo com PetCare Pro! 🐾${NC}"
}

# פונקציה ראשית
main() {
    print_banner

    log "INFO" "מתחיל את התקנת PetCare Pro..."

    # בדיקות דרישות מקדימות
    log "PROGRESS" "בודק דרישות מקדימות..."

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
            log "ERROR" "נדרש Node.js v18+"
            exit 1
        fi
    fi

    # בדיקת תקינות npm
    if ! command_exists npm; then
        log "ERROR" "npm לא נמצא לאחר התקנת Node.js"
        exit 1
    fi

    # Instalar ferramentas globais
    install_expo_cli
    install_eas_cli

    # Configurar projeto
    clone_repository
    install_dependencies
    setup_environment

    # בדיקות רשות
    check_android_sdk
    check_xcode

    # בדיקות בסיסיות
    run_basic_tests

    # סיום
    show_next_steps

    log "SUCCESS" "התקנת PetCare Pro הושלמה!"
}

# פונקציה לניקוי במקרה של עצירה
cleanup() {
    log "WARNING" "ההתקנה הופסקה על ידי המשתמש"
    exit 1
}

# Capturar Ctrl+C
trap cleanup SIGINT

# בדיקת הרצה כ-root (לא מומלץ)
if [ "$EUID" -eq 0 ]; then
    log "WARNING" "לא מומלץ להריץ כ-root"
    read -p "Continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# הפעלת הפונקציה הראשית
main "$@"
