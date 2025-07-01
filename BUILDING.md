# Guia de Compilação - PetCare Pro

Este documento fornece instruções detalhadas para compilar e executar o aplicativo PetCare Pro em diferentes plataformas.

## 📋 Pré-requisitos

### Ferramentas Obrigatórias
- **Node.js**: versão 18.x ou superior
- **npm** ou **yarn**: gerenciador de pacotes
- **Expo CLI**: `npm install -g @expo/cli`
- **Git**: para controle de versão

### Para Desenvolvimento iOS
- **macOS**: obrigatório para compilação iOS
- **Xcode**: versão mais recente
- **iOS Simulator**: incluído no Xcode
- **Apple Developer Account**: para deploy em dispositivos físicos

### Para Desenvolvimento Android
- **Android Studio**: com SDK e emuladores configurados
- **Java Development Kit (JDK)**: versão 11 ou superior
- **Android SDK**: API level 33 ou superior

## 🚀 Configuração do Ambiente

### 1. Clone o Repositório
```bash
git clone https://github.com/PetCareAi/consultorio-app.git
cd consultorio-app
```

### 2. Instale as Dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure o Banco de Dados
Execute o script SQL fornecido em `db/supabase.sql` no seu projeto Supabase.

### 4. Configure as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🛠️ Processo de Compilação

### Desenvolvimento Local
```bash
# Inicia o servidor de desenvolvimento
npx expo start

# Para iOS
npx expo start --ios

# Para Android
npx expo start --android

# Para Web
npx expo start --web
```

### Compilação para Produção

#### Usando EAS Build (Recomendado)
```bash
# Instala EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Configura o projeto
eas build:configure

# Compila para Android
eas build --platform android

# Compila para iOS
eas build --platform ios

# Compila para ambas as plataformas
eas build --platform all
```

#### Compilação Local
```bash
# Gera arquivos nativos
npx expo prebuild

# Para Android
npx expo run:android

# Para iOS
npx expo run:ios
```

## 📱 Testando a Aplicação

### Emuladores
```bash
# Inicia emulador Android
npx expo start --android

# Inicia simulador iOS (macOS apenas)
npx expo start --ios
```

### Dispositivos Físicos
1. Instale o app **Expo Go** no seu dispositivo
2. Execute `npx expo start`
3. Escaneie o QR code com a câmera (iOS) ou Expo Go (Android)

## 🔧 Solução de Problemas

### Limpar Cache
```bash
# Limpa cache do Expo
npx expo start --clear

# Limpa cache do npm
npm start -- --reset-cache

# Limpa node_modules
rm -rf node_modules
npm install
```

### Problemas de Dependências
```bash
# Corrige dependências automaticamente
npx expo install --fix

# Reinstala todas as dependências
rm -rf node_modules package-lock.json
npm install
```

### Problemas com Builds
```bash
# Limpa builds anteriores
npx expo prebuild --clean

# Reseta completamente o projeto
rm -rf .expo android ios
npx expo prebuild
```

## 📊 Métricas de Build

### Tamanhos de Bundle
- **Android APK**: ~25-30 MB
- **iOS IPA**: ~30-35 MB
- **Web Bundle**: ~5-8 MB

### Tempo de Compilação
- **Desenvolvimento**: 30-60 segundos
- **Produção Android**: 5-10 minutos
- **Produção iOS**: 10-15 minutos

## 🌐 Deploy para Lojas

### Google Play Store
1. Configure as assinaturas no EAS
2. Execute `eas build --platform android --profile production`
3. Faça upload do AAB gerado para o Play Console

### Apple App Store
1. Configure certificados de distribuição
2. Execute `eas build --platform ios --profile production`
3. Use Xcode ou EAS Submit para enviar para a App Store

## 🔄 Automação CI/CD

### GitHub Actions
O projeto inclui workflows para:
- Testes automatizados
- Build de desenvolvimento
- Deploy automático
- Análise de código

### Scripts Disponíveis
```bash
# Desenvolvimento
npm start

# Testes
npm test

# Build de produção
npm run build:android
npm run build:ios

# Linting
npm run lint

# Formatação de código
npm run format
```

## 📚 Recursos Adicionais

- [Documentação do Expo](https://docs.expo.dev/)
- [Documentação do React Native](https://reactnative.dev/)
- [Guia EAS Build](https://docs.expo.dev/build/introduction/)
- [Supabase Documentation](https://supabase.com/docs)

## 🆘 Suporte

Se encontrar problemas durante a compilação:
1. Verifique os [problemas conhecidos](./TROUBLESHOOTING.md)
2. Consulte a [documentação de contribuição](./CONTRIBUTING.md)
3. Abra uma issue no GitHub com detalhes do erro
