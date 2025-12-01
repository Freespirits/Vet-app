# Makefile עבור PetCare Pro
# אוטומטיזציה של משימות פיתוח ופריסה נפוצות

.PHONY: help install start build test lint format clean setup deploy
.DEFAULT_GOAL := help

# ==============================================================================
# משתנים
# ==============================================================================

# צבעים לפלט
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
BLUE=\033[0;34m
NC=\033[0m # No Color

# הגדרות הפרויקט
PROJECT_NAME=petcare-pro
NODE_VERSION=18
EXPO_CLI_VERSION=latest

# תיקיות
SRC_DIR=src
BUILD_DIR=build
DIST_DIR=dist
DOCS_DIR=docs
TEST_DIR=__tests__

# ==============================================================================
# עזרה - רשימת כל הפקודות הזמינות
# ==============================================================================

help: ## מציג הודעת עזרה זו
	@echo "${BLUE}PetCare Pro - פקודות זמינות${NC}"
	@echo "=================================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "${GREEN}%-20s${NC} %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "${YELLOW}שימוש: make <פקודה>${NC}"

# ==============================================================================
# תצורה והתקנה
# ==============================================================================

check-node: ## בודק אם Node.js מותקן
	@echo "${BLUE}בודק את Node.js...${NC}"
	@node --version || (echo "${RED}Node.js לא נמצא. התקן Node.js ${NODE_VERSION}+${NC}" && exit 1)
	@npm --version || (echo "${RED}NPM לא נמצא${NC}" && exit 1)

check-expo: ## בודק אם Expo CLI מותקן
	@echo "${BLUE}בודק את Expo CLI...${NC}"
	@expo --version || (echo "${YELLOW}Expo CLI לא נמצא. מתקין...${NC}" && npm install -g expo-cli@${EXPO_CLI_VERSION})

install: check-node ## מתקין את כל התלויות
	@echo "${BLUE}מתקין תלויות...${NC}"
	npm ci
	@echo "${GREEN}✓ התלויות הותקנו בהצלחה${NC}"

install-dev: install ## מתקין תלויות כולל תלויות פיתוח
	@echo "${BLUE}מתקין תלויות פיתוח...${NC}"
	npm install --include=dev
	@echo "${GREEN}✓ תלויות הפיתוח הותקנו${NC}"

setup: check-node check-expo install ## הגדרת פרויקט מלאה
	@echo "${BLUE}מגדיר את הפרויקט...${NC}"
	npm run prepare || true
	@echo "${GREEN}✓ הפרויקט הוגדר בהצלחה${NC}"
	@echo "${YELLOW}הריצו 'make start' כדי להתחיל בפיתוח${NC}"

# ==============================================================================
# פיתוח
# ==============================================================================

start: ## מפעיל את שרת הפיתוח
	@echo "${BLUE}מפעיל שרת פיתוח...${NC}"
	npm start

start-ios: ## מפעיל בסימולטור iOS
	@echo "${BLUE}מפעיל ב-iOS...${NC}"
	npm run ios

start-android: ## מפעיל באמולטור Android
	@echo "${BLUE}מפעיל ב-Android...${NC}"
	npm run android

start-web: ## מפעיל גרסת ווב
	@echo "${BLUE}מפעיל גרסת ווב...${NC}"
	npm run web

dev: start ## קיצור להפעלת start

# ==============================================================================
# Build והפצה
# ==============================================================================

build: ## יוצר Build לסביבת הפקה
	@echo "${BLUE}יוצר Build לפרודקשן...${NC}"
	npm run build
	@echo "${GREEN}✓ Build נוצר בהצלחה${NC}"

build-ios: ## Build ל-iOS
	@echo "${BLUE}יוצר Build ל-iOS...${NC}"
	expo build:ios
	@echo "${GREEN}✓ Build ל-iOS נוצר${NC}"

build-android: ## Build ל-Android
	@echo "${BLUE}יוצר Build ל-Android...${NC}"
	expo build:android
	@echo "${GREEN}✓ Build ל-Android נוצר${NC}"

bundle: ## יוצר Bundle של JavaScript
	@echo "${BLUE}יוצר Bundle...${NC}"
	npx react-native bundle --platform android --dev false --entry-file App.js --bundle-output android/app/src/main/assets/index.android.bundle
	@echo "${GREEN}✓ Bundle נוצר${NC}"

# ==============================================================================
# בדיקות ואיכות
# ==============================================================================

test: ## מפעיל את כל הבדיקות
	@echo "${BLUE}מריץ בדיקות...${NC}"
	npm test
	@echo "${GREEN}✓ בדיקות הושלמו${NC}"

test-watch: ## מפעיל בדיקות במצב מעקב
	@echo "${BLUE}מריץ בדיקות במצב watch...${NC}"
	npm run test:watch

test-coverage: ## מפעיל בדיקות עם דוח כיסוי
	@echo "${BLUE}מריץ בדיקות עם כיסוי...${NC}"
	npm run test:coverage
	@echo "${GREEN}✓ דוח כיסוי נוצר${NC}"

test-ci: ## מפעיל בדיקות ל-CI/CD
	@echo "${BLUE}מריץ בדיקות ל-CI...${NC}"
	npm run test:ci

lint: ## מפעיל Linting על הקוד
	@echo "${BLUE}מריץ Linting...${NC}"
	npm run lint
	@echo "${GREEN}✓ Linting הסתיים${NC}"

lint-fix: ## מתקן אוטומטית בעיות Linting
	@echo "${BLUE}מתקן בעיות Linting...${NC}"
	npm run lint:fix
	@echo "${GREEN}✓ בעיות Linting תוקנו${NC}"

format: ## מפעיל עיצוב קוד עם Prettier
	@echo "${BLUE}מעצב קוד...${NC}"
	npm run format
	@echo "${GREEN}✓ הקוד עוצב${NC}"

quality: lint test ## מפעיל בדיקות איכות (lint + test)

# ==============================================================================
# ניקוי ותחזוקה
# ==============================================================================

clean: ## מסיר קבצים זמניים ומטמון
	@echo "${BLUE}מנקה קבצים זמניים...${NC}"
	rm -rf node_modules/.cache
	rm -rf .expo
	rm -rf ${BUILD_DIR}
	rm -rf ${DIST_DIR}
	rm -rf .tmp
	npm cache clean --force
	@echo "${GREEN}✓ הניקוי הסתיים${NC}"

clean-all: clean ## ניקוי מלא כולל node_modules
	@echo "${BLUE}מסיר node_modules...${NC}"
	rm -rf node_modules
	rm -rf package-lock.json
	@echo "${GREEN}✓ ניקוי מלא הושלם${NC}"

reset: clean-all install ## איפוס מלא של הפרויקט

# ==============================================================================
# אבטחה וביקורת
# ==============================================================================

audit: ## מפעיל ביקורת אבטחה
	@echo "${BLUE}מריץ ביקורת אבטחה...${NC}"
	npm audit
	@echo "${GREEN}✓ ביקורת הסתיימה${NC}"

audit-fix: ## מתקן פגיעויות שנמצאו
	@echo "${BLUE}מתקן פגיעויות...${NC}"
	npm audit fix
	@echo "${GREEN}✓ פגיעויות תוקנו${NC}"

security-check: ## בדיקות אבטחה מלאות
	@echo "${BLUE}מריץ בדיקות אבטחה...${NC}"
	npm run security:check || true
	@echo "${GREEN}✓ בדיקות האבטחה הסתיימו${NC}"

# ==============================================================================
# בסיס נתונים
# ==============================================================================

db-setup: ## מגדיר את בסיס הנתונים
	@echo "${BLUE}מגדיר את בסיס הנתונים...${NC}"
	@if [ -f "db/setup.sql" ]; then \
	echo "מריץ הגדרת בסיס נתונים..."; \
	npm run db:setup; \
	else \
	echo "${YELLOW}הקובץ db/setup.sql לא נמצא${NC}"; \
	fi

db-migrate: ## מפעיל מיגרציות למסד הנתונים
	@echo "${BLUE}מריץ מיגרציות...${NC}"
	npm run db:migrate || echo "${YELLOW}הפקודה db:migrate לא מוגדרת${NC}"

db-seed: ## מאכלס את הבסיס בנתוני בדיקה
	@echo "${BLUE}מזין נתוני בדיקה...${NC}"
	npm run db:seed || echo "${YELLOW}הפקודה db:seed לא מוגדרת${NC}"

# ==============================================================================
# תיעוד
# ==============================================================================

docs: ## יוצר תיעוד
	@echo "${BLUE}מייצר תיעוד...${NC}"
	@if [ -d "${DOCS_DIR}" ]; then \
	npm run docs:generate || echo "${YELLOW}הפקודה docs:generate לא מוגדרת${NC}"; \
	else \
	echo "${YELLOW}התיקייה ${DOCS_DIR} לא נמצאה${NC}"; \
	fi

docs-serve: ## מגיש תיעוד מקומית
	@echo "${BLUE}מגיש תיעוד מקומית...${NC}"
	npm run docs:serve || echo "${YELLOW}הפקודה docs:serve לא מוגדרת${NC}"

# ==============================================================================
# פריסה ו-Release
# ==============================================================================

deploy-staging: ## פריסה לסביבת Staging
	@echo "${BLUE}מפריס ל-Staging...${NC}"
	npm run deploy:staging
	@echo "${GREEN}✓ הפריסה ל-Staging הושלמה${NC}"

deploy-prod: build ## פריסה לסביבת הפקה
	@echo "${BLUE}מפריס לפרודקשן...${NC}"
	@echo "${RED}⚠️  אתה עומד לפרוס לפרודקשן!${NC}"
	@read -p "להמשיך? (y/N): " confirm && [ "$$confirm" = "y" ]
	npm run deploy:production
	@echo "${GREEN}✓ הפריסה לפרודקשן הושלמה${NC}"

release: ## יוצר Release חדשה
	@echo "${BLUE}יוצר Release חדשה...${NC}"
	npm run release
	@echo "${GREEN}✓ Release נוצרה${NC}"

# ==============================================================================
# כלים נוספים
# ==============================================================================

logs: ## מציג לוגים של היישום
	@echo "${BLUE}מציג לוגים...${NC}"
	npm run logs || expo logs

debug: ## מפעיל מצב Debug
	@echo "${BLUE}מפעיל מצב Debug...${NC}"
	npm run debug || expo start --dev-client

tunnel: ## מפעיל עם מנהרת גישה ציבורית
	@echo "${BLUE}מפעיל עם Tunnel...${NC}"
	expo start --tunnel

info: ## מציג מידע על הסביבה
	@echo "${BLUE}מידע על הסביבה${NC}"
	@echo "========================"
	@echo "${GREEN}Node.js:${NC} $$(node --version)"
	@echo "${GREEN}NPM:${NC} $$(npm --version)"
	@echo "${GREEN}Expo CLI:${NC} $$(expo --version 2>/dev/null || echo 'לא מותקן')"
	@echo "${GREEN}מערכת:${NC} $$(uname -s)"
	@echo "${GREEN}ארכיטקטורה:${NC} $$(uname -m)"
	@echo "${GREEN}תיקייה:${NC} $$(pwd)"
	@echo "${GREEN}Git Branch:${NC} $$(git branch --show-current 2>/dev/null || echo 'N/A')"
	@echo "${GREEN}Git Status:${NC} $$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ') קבצים שהשתנו"

dependencies: ## מציג את התלויות של הפרויקט
@echo "${BLUE}תלויות הפרויקט${NC}"
@echo "======================="
@npm list --depth=0

outdated: ## בודק תלויות מיושנות
@echo "${BLUE}בודק תלויות מיושנות...${NC}"
npm outdated

update-deps: ## מעדכן תלויות
@echo "${BLUE}מעדכן תלויות...${NC}"
npm update
@echo "${GREEN}✓ התלויות עודכנו${NC}"

# ==============================================================================
# פקודות מורכבות
# ==============================================================================

ci: install lint test build ## פייפליין CI מלאה
@echo "${GREEN}✓ פייפליין CI הסתיימה בהצלחה${NC}"

full-check: clean install lint test-coverage audit build ## בדיקה מלאה של הפרויקט
@echo "${GREEN}✓ בדיקה מלאה הושלמה${NC}"

quick-check: lint test ## בדיקה מהירה (lint + test)
@echo "${GREEN}✓ בדיקה מהירה הושלמה${NC}"

# ==============================================================================
# קיצורי דרך שימושיים
# ==============================================================================

i: install ## קיצור ל-install
s: start ## קיצור ל-start
b: build ## קיצור ל-build
t: test ## קיצור ל-test
l: lint ## קיצור ל-lint
f: format ## קיצור ל-format
c: clean ## קיצור ל-clean
