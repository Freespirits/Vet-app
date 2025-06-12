const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

// Interface para input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Verificar se as dependências necessárias estão instaladas
function checkDependencies() {
  console.log('🔍 Verificando dependências...');
  
  const requiredPackages = [
    '@expo/cli',
    'eas-cli'
  ];
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    const missing = requiredPackages.filter(pkg => !allDeps[pkg]);
    
    if (missing.length > 0) {
      console.log(`⚠️ Dependências faltando: ${missing.join(', ')}`);
      console.log('🔄 Instalando dependências...');
      
      execSync(`npm install -g @expo/cli eas-cli`, { stdio: 'inherit' });
      console.log('✅ Dependências instaladas globalmente!');
    } else {
      console.log('✅ Todas as dependências estão instaladas!');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar dependências:', error.message);
    return false;
  }
}

// Validar estrutura do projeto
function validateProject() {
  console.log('🔍 Validando estrutura do projeto...');
  
  const requiredFiles = ['package.json', 'app.json'];
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.error(`❌ Arquivos obrigatórios não encontrados: ${missingFiles.join(', ')}`);
    return false;
  }
  
  // Verificar se é um projeto Expo
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (!packageJson.dependencies?.expo) {
      console.error('❌ Este não parece ser um projeto Expo válido');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao ler package.json:', error.message);
    return false;
  }
  
  console.log('✅ Estrutura do projeto validada!');
  return true;
}

// Verificar e instalar Java/Android SDK se necessário
function checkAndroidEnvironment() {
  console.log('🔍 Verificando ambiente Android...');
  
  try {
    execSync('java -version', { stdio: 'ignore' });
    console.log('✅ Java JDK encontrado!');
  } catch (error) {
    console.log('⚠️ Java JDK não encontrado. Para builds locais, instale o JDK 11+');
  }
  
  try {
    execSync('keytool', { stdio: 'ignore' });
    console.log('✅ Keytool disponível!');
  } catch (error) {
    console.log('⚠️ Keytool não encontrado, mas não é necessário para builds EAS');
  }
  
  return true;
}

// Limpar pastas de build anterior
function cleanPreviousBuild() {
  console.log('🧹 Limpando builds anteriores...');
  
  const foldersToClean = ['android', 'ios', '.expo'];
  
  foldersToClean.forEach(folder => {
    if (fs.existsSync(folder)) {
      console.log(`🗑️ Removendo pasta ${folder}...`);
      try {
        if (process.platform === 'win32') {
          execSync(`rmdir /s /q ${folder}`, { stdio: 'ignore' });
        } else {
          execSync(`rm -rf ${folder}`, { stdio: 'ignore' });
        }
        console.log(`✅ Pasta ${folder} removida!`);
      } catch (error) {
        console.log(`⚠️ Falha ao remover ${folder}: ${error.message}`);
      }
    }
  });
  
  return true;
}

// Criar assets obrigatórios se não existirem
function createRequiredAssets() {
  console.log('🎨 Verificando assets obrigatórios...');
  
  if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets', { recursive: true });
    console.log('📁 Pasta assets criada!');
  }
  
  // Criar icon.png se não existir
  if (!fs.existsSync('assets/icon.png')) {
    console.log('🔄 Criando ícone padrão...');
    const iconData = createDefaultIcon();
    fs.writeFileSync('assets/icon.png', iconData);
    console.log('✅ Ícone padrão criado!');
  }
  
  // Criar splash.png se não existir
  if (!fs.existsSync('assets/splash.png')) {
    console.log('🔄 Criando splash screen padrão...');
    const splashData = createDefaultSplash();
    fs.writeFileSync('assets/splash.png', splashData);
    console.log('✅ Splash screen padrão criado!');
  }
  
  console.log('✅ Assets verificados e criados!');
  return true;
}

// Criar um ícone padrão (PNG base64 1024x1024)
function createDefaultSplash() {
  console.log('⚠️  Criando splash placeholder simples. Para produção, substitua por um splash real.');
  return Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
}

// Criar um splash screen padrão (PNG base64 2048x2048)
function createDefaultSplash() {
  // PNG base64 de um splash screen simples 2048x2048
  // Esta é uma versão comentada para reduzir o tamanho do código
  // Em produção, substitua por um splash real do seu app
  
  /*
  const base64Splash = `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mAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAUmAwAAKDAZAABAgckAAAAKTAYAAFBgMgAAgAKTAQAAFJgMAACgwGQAAAAFJgMAACgwGQAAQIHJAAAACkwGAABQYDIAAIACkwEAABSYDAAAoMBkAAAABSYDAAAoMBkAAECByQAAAApMBgAAUGAyAACAApMBAAAUmAwAAKDAZAAAAAW2LAOdqygKnxsRyZZlGacM3SfLMhcHgwIAAAAAAA==`;
  */
  
  // Retorna um buffer de um splash simples - substitua pela sua implementação
  return Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
}

// Fazer login no EAS
async function loginToEAS() {
  console.log('🔐 Verificando login no EAS...');
  
  try {
    // Verificar se já está logado
    execSync('npx eas whoami', { stdio: 'ignore' });
    console.log('✅ Já está logado no EAS!');
    return true;
  } catch (error) {
    console.log('🔄 Fazendo login no EAS...');
    
    return new Promise((resolve) => {
      rl.question('Deseja fazer login automaticamente no EAS? (S/n): ', (answer) => {
        if (answer.toLowerCase() !== 'n') {
          try {
            execSync('npx eas login', { stdio: 'inherit' });
            console.log('✅ Login no EAS realizado com sucesso!');
            resolve(true);
          } catch (loginError) {
            console.error('❌ Falha no login do EAS:', loginError.message);
            console.log('💡 Tente executar manualmente: npx eas login');
            resolve(false);
          }
        } else {
          console.log('⚠️ Login no EAS é necessário para builds na nuvem.');
          resolve(false);
        }
      });
    });
  }
}

// Atualizar eas.json com configuração válida
function updateEasJsonRobust() {
  console.log('📋 Atualizando configuração do eas.json...');
  
  // Configuração corrigida - removendo buildType inválido
  const validEasConfig = {
    "cli": {
      "version": ">= 0.60.0",
      "appVersionSource": "local"
    },
    "build": {
      "development": {
        "developmentClient": true,
        "distribution": "internal"
      },
      "preview": {
        "distribution": "internal",
        "android": {
          "buildType": "apk"
        }
      },
      "production": {
        "android": {
          "buildType": "apk",
          "credentialsSource": "remote"
        }
      },
      "production-aab": {
        "android": {
          "buildType": "app-bundle",
          "credentialsSource": "remote"
        }
      }
    },
    "submit": {
      "production": {}
    }
  };
  
  fs.writeFileSync('eas.json', JSON.stringify(validEasConfig, null, 2));
  console.log('✅ Configuração válida do eas.json aplicada!');
  
  return true;
}

// Configurar/executar eas init se necessário
function initializeEAS() {
  return new Promise((resolve) => {
    console.log('📋 Verificando inicialização do EAS...');
    
    try {
      // Verificar se já foi inicializado
      execSync('npx eas project:info', { stdio: 'ignore' });
      console.log('✅ Projeto EAS já está inicializado!');
      resolve(true);
    } catch (error) {
      console.log('🔄 Inicializando projeto EAS...');
      
      rl.question('Deseja inicializar o projeto EAS automaticamente? (S/n): ', (answer) => {
        if (answer.toLowerCase() !== 'n') {
          try {
            // Primeiro gerar eas.json válido
            updateEasJsonRobust();
            
            // Depois executar o init
            execSync('npx eas init --non-interactive', { stdio: 'inherit' });
            console.log('✅ Projeto EAS inicializado com sucesso!');
            resolve(true);
          } catch (initError) {
            console.log('⚠️ Falha na inicialização automática. Tentando método manual...');
            
            try {
              execSync('npx eas init', { stdio: 'inherit' });
              console.log('✅ Projeto EAS inicializado com sucesso!');
              resolve(true);
            } catch (manualError) {
              console.error('❌ Falha ao inicializar projeto EAS:', manualError.message);
              console.log('💡 Tente executar manualmente: npx eas init');
              resolve(false);
            }
          }
        } else {
          console.log('⚠️ Inicialização do EAS é necessária para continuar. Processo interrompido.');
          resolve(false);
        }
      });
    }
  });
}

// Configurar/atualizar o app.json mais robustamente
async function updateAppJsonRobust() {
  console.log('📋 Verificando e atualizando configuração do app.json...');
  
  if (!fs.existsSync('app.json')) {
    console.error('❌ Arquivo app.json não encontrado!');
    return false;
  }
  
  try {
    let appConfig = JSON.parse(fs.readFileSync('app.json', 'utf8'));
    let needsUpdate = false;
    
    if (!appConfig.expo) {
      console.error('❌ Formato inválido do app.json. Chave "expo" não encontrada.');
      return false;
    }
    
    // Configurações essenciais
    const requiredConfigs = {
      android: {},
      ios: {},
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
      },
      icon: './assets/icon.png',
      version: '1.0.0',
      orientation: 'portrait',
      userInterfaceStyle: 'light'
    };
    
    // Aplicar configurações essenciais
    Object.keys(requiredConfigs).forEach(key => {
      if (!appConfig.expo[key]) {
        appConfig.expo[key] = requiredConfigs[key];
        needsUpdate = true;
        console.log(`🔄 Adicionando configuração: ${key}`);
      }
    });
    
    // Configuração específica do Android
    if (!appConfig.expo.android.package) {
      return new Promise((resolve) => {
        rl.question('Digite o ID do pacote para o Android (ex: com.seuapp.nome): ', (packageId) => {
          if (!packageId.trim()) {
            console.log('⚠️ ID do pacote é obrigatório!');
            resolve(false);
            return;
          }
          
          appConfig.expo.android.package = packageId.trim();
          appConfig.expo.android.versionCode = 1;
          appConfig.expo.android.adaptiveIcon = {
            foregroundImage: './assets/icon.png',
            backgroundColor: '#FFFFFF'
          };
          
          fs.writeFileSync('app.json', JSON.stringify(appConfig, null, 2));
          console.log(`✅ ID do pacote ${packageId} adicionado ao app.json!`);
          resolve(true);
        });
      });
    }
    
    // Configurações adicionais do Android
    if (!appConfig.expo.android.versionCode) {
      appConfig.expo.android.versionCode = 1;
      needsUpdate = true;
    }
    
    if (!appConfig.expo.android.adaptiveIcon) {
      appConfig.expo.android.adaptiveIcon = {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#FFFFFF'
      };
      needsUpdate = true;
    }
    
    // Salvar se houve alterações
    if (needsUpdate) {
      fs.writeFileSync('app.json', JSON.stringify(appConfig, null, 2));
      console.log('✅ Configuração do app.json atualizada com sucesso!');
    } else {
      console.log('✅ Configuração do app.json já está correta!');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao processar app.json:', error.message);
    return false;
  }
}

// Configurar o projeto de forma mais robusta
async function setupProjectRobust() {
  console.log('🔧 Configurando projeto para build...\n');
  
  // 1. Verificar dependências
  if (!checkDependencies()) {
    console.error('❌ Falha na verificação de dependências');
    return false;
  }
  
  // 2. Validar projeto
  if (!validateProject()) {
    console.error('❌ Falha na validação do projeto');
    return false;
  }
  
  // 3. Limpar builds anteriores
  cleanPreviousBuild();
  
  // 4. Criar assets necessários
  if (!createRequiredAssets()) {
    console.error('❌ Falha na criação de assets');
    return false;
  }
  
  // 5. Verificar ambiente Android
  checkAndroidEnvironment();
  
  // 6. Atualizar app.json
  const appJsonResult = await updateAppJsonRobust();
  if (!appJsonResult) {
    console.error('❌ Falha na configuração do app.json');
    return false;
  }
  
  // 7. Atualizar eas.json ANTES do login e init
  if (!updateEasJsonRobust()) {
    console.error('❌ Falha na configuração do eas.json');
    return false;
  }
  
  // 8. Fazer login no EAS
  const loginResult = await loginToEAS();
  if (!loginResult) {
    console.error('❌ Falha no login do EAS');
    return false;
  }
  
  // 9. Inicializar EAS
  const initResult = await initializeEAS();
  if (!initResult) {
    console.error('❌ Falha na inicialização do EAS');
    return false;
  }
  
  console.log('✅ Projeto configurado com sucesso para build!\n');
  return true;
}

// Método de build melhorado com interação para keystore
async function performBuild() {
  console.log('🚀 Iniciando processo de build APK...\n');
  
  const buildMethods = [
    {
      name: 'Build de Preview (APK) - Interativo',
      command: 'npx eas build --platform android --profile preview',
      description: 'Build de teste usando profile preview (permite geração de keystore)'
    },
    {
      name: 'Build de Produção (APK) - Interativo',
      command: 'npx eas build --platform android --profile production',
      description: 'Build oficial de produção usando EAS (permite geração de keystore)'
    },
    {
      name: 'Build Local (Prebuild + Gradle)',
      command: 'local',
      description: 'Build local usando Expo prebuild e Gradle'
    }
  ];
  
  for (let i = 0; i < buildMethods.length; i++) {
    const method = buildMethods[i];
    console.log(`📱 Tentativa ${i + 1}: ${method.name}`);
    console.log(`   ${method.description}`);
    
    try {
      if (method.command === 'local') {
        // Método local
        console.log('🔄 Gerando projeto nativo...');
        execSync('npx expo prebuild --platform android --clean', { stdio: 'inherit' });
        
        console.log('🔄 Compilando APK com Gradle...');
        process.chdir('./android');
        
        const gradlewCmd = process.platform === 'win32' ? '.\\gradlew.bat' : './gradlew';
        execSync(`${gradlewCmd} assembleRelease`, { stdio: 'inherit' });
        
        process.chdir('..');
        
        console.log('\n✅ APK gerado com sucesso localmente!');
        console.log('📁 Localização: ./android/app/build/outputs/apk/release/app-release.apk');
        return true;
        
      } else {
        // Método EAS - INTERATIVO para permitir geração de keystore
        console.log('🔄 Executando build na nuvem...');
        console.log('⚠️ IMPORTANTE: O EAS pode solicitar criação de keystore. Responda "Y" quando perguntado.');
        console.log('⏳ Aguarde as interações necessárias...\n');
        
        execSync(method.command, { stdio: 'inherit' });
        
        console.log('\n✅ Build na nuvem iniciado com sucesso!');
        console.log('📲 Acesse https://expo.dev para acompanhar o progresso e baixar o APK');
        return true;
      }
      
    } catch (error) {
      console.log(`❌ Falha no método ${i + 1}: ${method.name}`);
      console.log(`   Erro: ${error.message}\n`);
      
      if (i === buildMethods.length - 1) {
        console.log('❌ Todos os métodos de build falharam!');
        return false;
      } else {
        console.log('🔄 Tentando próximo método...\n');
      }
    }
  }
  
  return false;
}

// Função principal atualizada
async function startBuildProcess() {
  try {
    console.log('🎯 Script de Build APK - Pedacinho do Céu Gestão\n');
    console.log('=' + '='.repeat(50) + '\n');
    
    // Configurar projeto
    const setupSuccess = await setupProjectRobust();
    if (!setupSuccess) {
      console.error('\n❌ Falha na configuração do projeto. Abortando...');
      rl.close();
      process.exit(1);
    }
    
    console.log('🔨 Iniciando processo de build...\n');
    
    // Executar build
    const buildSuccess = await performBuild();
    
    if (buildSuccess) {
      console.log('\n' + '='.repeat(60));
      console.log('🎉 BUILD CONCLUÍDO COM SUCESSO!');
      console.log('='.repeat(60));
      
      console.log('\n📝 Próximos passos:');
      console.log('1. 📱 Teste o APK em dispositivos Android');
      console.log('2. 🏪 Prepare assets para a Google Play Store');
      console.log('3. 📊 Configure analytics e crash reporting');
      console.log('4. 🚀 Publique na Google Play Console');
      
      rl.question('\n🌐 Deseja abrir o dashboard do Expo? (S/n): ', (answer) => {
        if (answer.toLowerCase() !== 'n') {
          const openCmd = process.platform === 'win32' ? 'start' : 
                         process.platform === 'darwin' ? 'open' : 'xdg-open';
          try {
            execSync(`${openCmd} https://expo.dev`);
          } catch (e) {
            console.log('🔗 Acesse manualmente: https://expo.dev');
          }
        }
        
        console.log('\n✨ Obrigado por usar o script de build!');
        rl.close();
      });
      
    } else {
      console.log('\n' + '='.repeat(60));
      console.log('❌ FALHA NO BUILD');
      console.log('='.repeat(60));
      
      console.log('\n🛠️ Soluções alternativas:');
      console.log('1. Execute: npx eas build --platform android --clear-cache');
      console.log('2. Verifique se todas as dependências estão instaladas');
      console.log('3. Certifique-se de ter Java JDK 11+ instalado');
      console.log('4. Execute: npx expo doctor para diagnóstico');
      console.log('5. Execute manualmente: npx eas build --platform android --profile preview');
      
      rl.close();
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Erro crítico no script:', error.message);
    console.log('\n💡 Para suporte, verifique:');
    console.log('- Conexão com internet');
    console.log('- Versões do Node.js e npm');
    console.log('- Logs detalhados acima');
    
    rl.close();
    process.exit(1);
  }
}

// Executar processo
startBuildProcess();