#!/bin/bash

# =============================================================================
# PetCare Pro - סקריפט הפעלה
# =============================================================================
# סקריפט זה מקל על הפעלת PetCare Pro במצבי עבודה ופלטפורמות שונים,
# עם בדיקות אוטומטיות ואפשרויות פיתוח
# =============================================================================

set -e

# צבעים לפלט
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

# סמלים
SUCCESS="✅"
ERROR="❌"
WARNING="⚠️"
INFO="ℹ️"
GEAR="⚙️"
ROCKET="🚀"
PHONE="📱"
COMPUTER="💻"

# פונקציה ללוגים
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

# באנר ראשי
print_banner() {
    clear
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                      PetCare Pro                            ║"
    echo "║                   סקריפט הפעלה v1.0                        ║"
    echo "║                                                              ║"
    echo "║              🚀 מוכן לפיתוח!                               ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

# פונקציה להצגת עזרה
show_help() {
    echo -e "${WHITE}📖 PetCare Pro - מדריך הפעלה${NC}"
    echo ""
    echo -e "${YELLOW}שימוש:${NC} ./run.sh [אפשרות]"
    echo ""
    echo -e "${YELLOW}אפשרויות זמינות:${NC}"
    echo ""
    echo -e "${CYAN}  start${NC}          מפעיל שרת פיתוח"
    echo -e "${CYAN}  ios${NC}            מפעיל עבור iOS"
    echo -e "${CYAN}  android${NC}        מפעיל עבור Android"
    echo -e "${CYAN}  web${NC}            מפעיל עבור Web"
    echo -e "${CYAN}  tunnel${NC}         מפעיל עם Tunnel (רשת חיצונית)"
    echo -e "${CYAN}  build${NC}          תפריט Builds"
    echo -e "${CYAN}  test${NC}           מריץ בדיקות"
    echo -e "${CYAN}  lint${NC}           מבצע בדיקת קוד"
    echo -e "${CYAN}  clean${NC}          מנקה מטמון ותלויות"
    echo -e "${CYAN}  check${NC}          בודק מצב הפרויקט"
    echo -e "${CYAN}  doctor${NC}         אבחון מלא"
    echo -e "${CYAN}  help${NC}           מציג עזרה זו"
    echo ""
    echo -e "${YELLOW}דוגמאות:${NC}"
    echo -e "${CYAN}  ./run.sh start${NC}    # הפעלה רגילה לפיתוח"
    echo -e "${CYAN}  ./run.sh ios${NC}      # בדיקה בסימולטור iOS"
    echo -e "${CYAN}  ./run.sh build${NC}    # פתיחת תפריט Build"
    echo -e "${CYAN}  ./run.sh doctor${NC}   # אבחון מלא"
    echo ""
}

# בדיקה שהסקריפט מורץ בתיקייה הנכונה
check_project_directory() {
    if [ ! -f "package.json" ] || [ ! -f "App.js" ]; then
        log "ERROR" "הפעילו את הסקריפט בתיקיית השורש של פרויקט PetCare Pro"
        exit 1
    fi

    if grep -q "petcarepro\|PetCare Pro" package.json; then
        log "SUCCESS" "Projeto PetCare Pro detectado"
    else
        log "WARNING" "ייתכן שזה אינו פרויקט PetCare Pro הנכון"
    fi
}

# בדיקת דרישות מקדימות
check_prerequisites() {
    local errors=0

    log "PROGRESS" "בודק דרישות מקדימות..."

    # Node.js
    if command -v node >/dev/null 2>&1; then
        local node_version=$(node --version | cut -d'v' -f2)
        local major_version=$(echo $node_version | cut -d'.' -f1)

        if [ "$major_version" -ge 18 ]; then
            log "SUCCESS" "Node.js v$node_version ✓"
        else
            log "ERROR" "גרסת Node.js v$node_version ישנה מדי. נדרש v18+"
            errors=$((errors + 1))
        fi
    else
        log "ERROR" "Node.js לא נמצא"
        errors=$((errors + 1))
    fi

    # npm
    if command -v npm >/dev/null 2>&1; then
        local npm_version=$(npm --version)
        log "SUCCESS" "npm v$npm_version ✓"
    else
        log "ERROR" "npm לא נמצא"
        errors=$((errors + 1))
    fi

    # Expo CLI
    if command -v npx >/dev/null 2>&1; then
        if npx expo --version >/dev/null 2>&1; then
            log "SUCCESS" "Expo CLI ✓"
        else
            log "WARNING" "Expo CLI לא נמצא. תתבצע התקנה אוטומטית."
        fi
    else
        log "ERROR" "npx לא נמצא"
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
        log "WARNING" "קובץ .env לא נמצא"
    fi

    # Verificar node_modules
    if [ -d "node_modules" ]; then
        log "SUCCESS" "התלויות הותקנו ✓"
    else
        log "WARNING" "תלויות אינן מותקנות. הריצו: npm install"
    fi

    return $errors
}

# התקנת תלויות במקרה הצורך
ensure_dependencies() {
    if [ ! -d "node_modules" ]; then
        log "PROGRESS" "מתקין תלויות..."
        npm install
        log "SUCCESS" "תלויות הותקנו"
    fi
}

# פונקציה להפעלה רגילה לפיתוח
start_development() {
    log "PROGRESS" "Iniciando servidor de desenvolvimento..."

    ensure_dependencies

    echo ""
    echo -e "${WHITE}📱 Como conectar seu dispositivo:${NC}"
    echo ""
    echo -e "${YELLOW}📱 מכשיר פיזי:${NC}"
    echo "   1. Instale o app 'Expo Go' na loja do seu dispositivo"
    echo "   2. סרקו את ה-QR שיופיע"
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

# פונקציה להפעלה ב-iOS
start_ios() {
    if [[ "$OSTYPE" != "darwin"* ]]; then
        log "ERROR" "iOS נתמך רק ב-macOS"
        exit 1
    fi

    ensure_dependencies
    log "PROGRESS" "Iniciando para iOS..."
    npx expo start --ios
}

# פונקציה להפעלה ב-Android
start_android() {
    ensure_dependencies
    log "PROGRESS" "Iniciando para Android..."

    # בדיקה שה-Android SDK מוגדר
    if [ -z "$ANDROID_HOME" ]; then
        log "WARNING" "ANDROID_HOME לא מוגדר. ייתכן שהאמולטור לא יעבוד."
    fi

    npx expo start --android
}

# פונקציה להפעלה ב-Web
start_web() {
    ensure_dependencies
    log "PROGRESS" "Iniciando para Web..."
    npx expo start --web
}

# פונקציה להפעלה עם Tunnel
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
    echo "3. Build פרודקשן (EAS)"
    echo "4. Build para Android apenas"
    echo "5. Build para iOS apenas"
    echo "6. Verificar status dos builds"
    echo "0. Voltar"
    echo ""

    read -p "בחרו אפשרות: " choice

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
            log "ERROR" "אפשרות לא חוקית"
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
                log "ERROR" "iOS נתמך רק ב-macOS"
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
            log "ERROR" "פלטפורמה לא תקפה"
            ;;
    esac
}

# Build EAS desenvolvimento
build_eas_dev() {
    log "PROGRESS" "Criando build EAS de desenvolvimento..."

    if ! command -v eas >/dev/null 2>&1; then
        log "ERROR" "EAS CLI לא נמצא. התקינו עם: npm install -g eas-cli"
        return 1
    fi

    eas build --platform all --profile development
}

# Build EAS לפרודקשן
build_eas_production() {
    log "PROGRESS" "יוצר Build EAS לפרודקשן..."

    if ! command -v eas >/dev/null 2>&1; then
        log "ERROR" "EAS CLI לא נמצא. התקינו עם: npm install -g eas-cli"
        return 1
    fi

    echo -e "${YELLOW}⚠️  Build פרודקשן! ודאו כי:${NC}"
    echo "   ✓ Todos os testes passam"
    echo "   ✓ הקוד עבר סקירה"
    echo "   ✓ הגרסה עודכנה"
    echo ""

    read -p "להמשיך עם Build לפרודקשן? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        eas build --platform all --profile production
    else
        log "INFO" "Build לפרודקשן בוטל"
    fi
}

# Build Android apenas
build_android_only() {
    log "PROGRESS" "Criando build Android..."

    if ! command -v eas >/dev/null 2>&1; then
        log "ERROR" "EAS CLI לא נמצא"
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
        log "ERROR" "EAS CLI לא נמצא"
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
        log "ERROR" "EAS CLI לא נמצא"
    fi
}

# Executar testes
run_tests() {
    log "PROGRESS" "Executando testes..."

    ensure_dependencies

    if grep -q "\"test\"" package.json; then
        npm test
    else
        log "WARNING" "סקריפטי בדיקה לא מוגדרים"
        log "INFO" "מגדיר בדיקות בסיסיות..."

        # הרצת בדיקות בסיסיות
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
    log "PROGRESS" "מריץ בדיקת קוד..."

    ensure_dependencies

    if grep -q "\"lint\"" package.json; then
        npm run lint
    else
        log "WARNING" "ESLint לא מוגדר"

        # בדיקת תחביר בסיסית עם Node.js
        echo "מריץ בדיקת תחביר בסיסית..."
        find src -name "*.js" -o -name "*.jsx" | while read file; do
            if node -c "$file" 2>/dev/null; then
                echo "✅ $file"
            else
                echo "❌ $file - erro de sintaxe"
            fi
        done
    fi
}

# ניקוי מטמון ותלויות
clean_project() {
    log "PROGRESS" "Limpando projeto..."

    echo "O que deseja limpar?"
    echo "1. Cache do Expo apenas"
    echo "2. node_modules e cache"
    echo "3. Limpeza completa (node_modules, cache, builds)"
    echo "0. Cancelar"

    read -p "בחרו אפשרות: " choice

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
            log "ERROR" "אפשרות לא חוקית"
            ;;
    esac
}

# Verificar status do projeto
check_status() {
    log "PROGRESS" "Verificando status do projeto..."

    echo ""
    echo -e "${WHITE}📊 Status do Projeto PetCare Pro${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # מידע בסיסי
    if [ -f "package.json" ]; then
        local app_name=$(grep -o '"name": "[^"]*"' package.json | cut -d'"' -f4)
        local app_version=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
        echo -e "${CYAN}📦 Projeto:${NC} $app_name"
        echo -e "${CYAN}🔢 גרסה:${NC} $app_version"
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
        "package.json:📄 תצורת הפרויקט"
        "App.js:⚡ Arquivo principal"
        ".env:🔐 משתני סביבה"
        "app.json:📱 תצורת האפליקציה"
        "eas.json:🏗️ תצורת EAS"
        "src/config/supabase.js:🗄️ תצורת בסיס הנתונים"
        "src/navigation/AppNavigator.js:🧭 ניווט"
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
    echo -e "${WHITE}🔧 תלויות${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if [ -d "node_modules" ]; then
        local pkg_count=$(find node_modules -maxdepth 1 -type d | wc -l)
        echo -e "${GREEN}✅${NC} $((pkg_count - 1)) pacotes instalados"

        # בדיקת תלויות חשובות
        local deps_to_check=("react" "react-native" "expo" "@supabase/supabase-js")

        for dep in "${deps_to_check[@]}"; do
            if [ -d "node_modules/$dep" ]; then
                echo -e "${GREEN}✅${NC} $dep"
            else
                echo -e "${RED}❌${NC} $dep"
            fi
        done
    else
        echo -e "${RED}❌${NC} תלויות אינן מותקנות"
    fi

    echo ""
    echo -e "${WHITE}🗄️ תצורת בסיס הנתונים${NC}"
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
            echo -e "${RED}❌${NC} כתובת Supabase לא מוגדרת"
        fi

        if grep -q "EXPO_PUBLIC_SUPABASE_ANON_KEY" .env; then
            echo -e "${GREEN}✅${NC} Chave do Supabase configurada"
        else
            echo -e "${RED}❌${NC} מפתח Supabase לא מוגדר"
        fi
    else
        echo -e "${RED}❌${NC} קובץ .env לא נמצא"
    fi

    echo ""
}

# אבחון מלא
run_doctor() {
    log "PROGRESS" "מריץ אבחון מלא..."

    print_banner

    # Status do projeto
    check_status

    echo ""
    echo -e "${WHITE}🔍 אבחון מפורט${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Verificar conectividade
    if command -v curl >/dev/null 2>&1; then
        echo ""
        log "PROGRESS" "Testando conectividade..."

        if curl -s --head --request GET https://expo.dev | grep "200 OK" > /dev/null; then
            echo -e "${GREEN}✅${NC} חיבור ל-Expo"
        else
            echo -e "${RED}❌${NC} בעיות חיבור ל-Expo"
        fi

        if [ -f ".env" ] && grep -q "EXPO_PUBLIC_SUPABASE_URL" .env; then
            local supabase_url=$(grep "EXPO_PUBLIC_SUPABASE_URL" .env | cut -d'=' -f2)
            if [ ! -z "$supabase_url" ] && [ "$supabase_url" != "your_supabase_url_here" ]; then
                if curl -s --head --request GET "$supabase_url" | grep "200\|404" > /dev/null; then
                    echo -e "${GREEN}✅${NC} חיבור ל-Supabase"
                else
                    echo -e "${RED}❌${NC} בעיות חיבור ל-Supabase"
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
                echo -e "${YELLOW}⚠️${NC}  הפורט $port בשימוש"
            else
                echo -e "${GREEN}✅${NC} הפורט $port פנוי"
            fi
        fi
    done

    # בדיקת מקום פנוי בדיסק
    echo ""
    log "PROGRESS" "בודק מקום פנוי בדיסק..."

    if command -v df >/dev/null 2>&1; then
        local available_space=$(df . | tail -1 | awk '{print $4}')
        local available_gb=$((available_space / 1024 / 1024))

        if [ $available_gb -gt 5 ]; then
            echo -e "${GREEN}✅${NC} שטח דיסק: ${available_gb}GB פנוי"
        else
            echo -e "${YELLOW}⚠️${NC}  מעט שטח דיסק: ${available_gb}GB פנוי"
        fi
    fi

    # המלצות
    echo ""
    echo -e "${WHITE}💡 המלצות${NC}"
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
        echo -e "${CYAN}8.${NC} 🔍 בדיקת קוד (lint)"
        echo -e "${CYAN}9.${NC} 🧹 Limpar projeto"
        echo -e "${CYAN}10.${NC} 📊 Status do projeto"
        echo -e "${CYAN}11.${NC} 🩺 אבחון מלא"
        echo -e "${CYAN}0.${NC} 🚪 Sair"
        echo ""

        read -p "בחרו אפשרות: " choice

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
                log "ERROR" "אפשרות לא חוקית"
                sleep 2
                ;;
        esac

        if [ $choice != 0 ]; then
            echo ""
            read -p "Pressione Enter para continuar..." -r
        fi
    done
}

# פונקציה ראשית
main() {
    # בדיקת תיקיית הפרויקט
    check_project_directory

    # אם אין ארגומנטים, מציגים תפריט אינטראקטיבי
    if [ $# -eq 0 ]; then
        interactive_menu
        exit 0
    fi

    # Processar argumentos da linha de comando
    case $1 in
        "start"|"dev"|"run")
            print_banner
            if ! check_prerequisites; then
                log "ERROR" "תקנו את הדרישות המקדימות לפני המשך"
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
            log "ERROR" "אפשרות לא מוכרת: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# בדיקת הרצה כ-root (לא מומלץ)
if [ "$EUID" -eq 0 ]; then
    log "WARNING" "לא מומלץ להריץ כ-root"
    read -p "Continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# ניקוי במקרה של עצירה
cleanup() {
    log "WARNING" "ההרצה הופסקה על ידי המשתמש"
    exit 1
}

trap cleanup SIGINT

# הפעלת הפונקציה הראשית
main "$@"
