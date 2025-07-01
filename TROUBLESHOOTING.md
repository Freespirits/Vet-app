# Solução de Problemas - PetCare Pro

Este documento contém soluções para problemas comuns encontrados durante o desenvolvimento e uso do PetCare Pro.

## 🚨 Problemas Comuns de Instalação

### Erro: "expo: command not found"
**Problema**: Expo CLI não está instalado globalmente.

**Solução**:
```bash
npm install -g @expo/cli
# ou
yarn global add @expo/cli
```

### Erro: "Module not found" após npm install
**Problema**: Dependências não foram instaladas corretamente.

**Solução**:
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install

# Para projetos Expo
npx expo install --fix
```

### Erro: "Unable to resolve module"
**Problema**: Problemas com resolução de módulos do Metro bundler.

**Solução**:
```bash
# Limpe o cache do Metro
npx expo start --clear

# ou
npx react-native start --reset-cache
```

## 📱 Problemas de Execução

### App trava na tela de splash
**Problema**: Erro durante a inicialização do app.

**Solução**:
1. Verifique o console para erros JavaScript
2. Teste em modo de desenvolvimento:
```bash
npx expo start --dev-client
```
3. Verifique se todas as dependências estão instaladas corretamente

### Erro: "Network request failed"
**Problema**: Problemas de conectividade com Supabase.

**Solução**:
1. Verifique a URL e chave do Supabase em `src/config/supabase.js`
2. Confirme se o projeto Supabase está ativo
3. Teste a conectividade:
```javascript
// Teste simples de conectividade
import { supabase } from './src/config/supabase';

const testConnection = async () => {
  const { data, error } = await supabase.from('users_consultorio').select('count');
  console.log('Teste de conexão:', { data, error });
};
```

### Login/Registro não funciona
**Problema**: Problemas com autenticação.

**Solução**:
1. Verifique se o RLS (Row Level Security) está desabilitado durante desenvolvimento
2. Confirme se as tabelas foram criadas corretamente:
```sql
-- Execute no SQL Editor do Supabase
SELECT table_name FROM information_schema.tables 
WHERE table_name LIKE '%consultorio%';
```
3. Verifique se a autenticação está habilitada no Supabase Dashboard

## 🛠️ Problemas de Build

### Erro: "Build failed" no EAS
**Problema**: Falha durante o processo de build.

**Solução**:
1. Verifique os logs detalhados no EAS Dashboard
2. Confirme se `app.json` está configurado corretamente
3. Teste localmente primeiro:
```bash
npx expo prebuild --clean
npx expo run:android
```

### Erro: "Unable to find a matching configuration"
**Problema**: Configuração do EAS Build incorreta.

**Solução**:
1. Reconfigure o EAS:
```bash
eas build:configure
```
2. Verifique o arquivo `eas.json`:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### App crasha ao abrir no dispositivo
**Problema**: Erro em produção que não ocorre em desenvolvimento.

**Solução**:
1. Habilite crash reporting:
```bash
npx expo install expo-application expo-constants
```
2. Adicione logs de debug
3. Teste com build de desenvolvimento primeiro

## 🗄️ Problemas de Banco de Dados

### Erro: "relation does not exist"
**Problema**: Tabelas não foram criadas no banco.

**Solução**:
1. Execute o script SQL completo em `db/supabase.sql`
2. Verifique se está conectado ao projeto correto
3. Confirme permissões:
```sql
-- No SQL Editor do Supabase
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
```

### Dados não aparecem na aplicação
**Problema**: Problemas com consultas ou permissões.

**Solução**:
1. Teste consultas diretamente no Supabase:
```sql
SELECT * FROM users_consultorio LIMIT 5;
SELECT * FROM clients_consultorio LIMIT 5;
```
2. Verifique filtros por `user_id`
3. Confirme se o usuário está autenticado

### Erro: "duplicate key value violates unique constraint"
**Problema**: Tentativa de inserir dados duplicados.

**Solução**:
1. Verifique se está usando IDs únicos
2. Para recriar o banco:
```sql
-- CUIDADO: Isto apaga todos os dados!
DROP TABLE IF EXISTS library_items_consultorio CASCADE;
DROP TABLE IF EXISTS appointments_consultorio CASCADE;
-- Execute todo o script de criação novamente
```

## 📱 Problemas Específicos de Plataforma

### iOS: "Developer Mode" não habilitado
**Problema**: App não roda em dispositivo iOS físico.

**Solução**:
1. Vá para Configurações > Privacidade e Segurança > Modo Desenvolvedor
2. Habilite o Modo Desenvolvedor
3. Reinicie o dispositivo

### Android: "Installation failed"
**Problema**: Falha ao instalar APK.

**Solução**:
1. Habilite "Fontes desconhecidas" nas configurações
2. Use `adb` para instalar manualmente:
```bash
adb install app-release.apk
```
3. Limpe o armazenamento do app anterior

### Problema de performance em Android
**Problema**: App lento em dispositivos Android.

**Solução**:
1. Habilite Hermes no `metro.config.js`:
```javascript
module.exports = {
  transformer: {
    hermesCommand: 'hermes',
  },
};
```
2. Otimize imagens e reduza bundle size
3. Use `React.memo` para componentes pesados

## 🔐 Problemas de Segurança

### Expo Go não carrega o app
**Problema**: App não aparece no Expo Go.

**Solução**:
1. Confirme que dispositivo e computador estão na mesma rede
2. Use tunnel mode:
```bash
npx expo start --tunnel
```
3. Verifique firewall e antivírus

### Erro de CORS
**Problema**: Requisições bloqueadas pelo navegador.

**Solução**:
1. Configure headers no Supabase
2. Para desenvolvimento web, use proxy
3. Verifique configurações de rede

## 🐛 Debug e Logs

### Como habilitar logs detalhados
```javascript
// Em App.js
if (__DEV__) {
  console.log('Modo desenvolvimento ativado');
  // Habilita logs detalhados do Supabase
  supabase.auth.debug = true;
}
```

### Como capturar erros
```javascript
// ErrorBoundary personalizado
import React from 'react';
import { View, Text } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Algo deu errado!</Text>
          <Text>{this.state.error?.message}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}
```

## 📞 Obtendo Ajuda

### Informações para Incluir em Issues
1. **Versão do Node.js**: `node --version`
2. **Versão do Expo**: `npx expo --version`
3. **Sistema operacional**: Windows/macOS/Linux
4. **Tipo de dispositivo**: iOS/Android/Web
5. **Logs completos**: copie e cole erros completos
6. **Passos para reproduzir**: descreva o que estava fazendo

### Canais de Suporte
- **GitHub Issues**: Para bugs e problemas técnicos
- **Discussions**: Para perguntas gerais
- **Email**: contato@petcare.ai para suporte direto

### Antes de Abrir uma Issue
1. ✅ Procure em issues existentes
2. ✅ Teste com versão mais recente
3. ✅ Reproduza o problema em ambiente limpo
4. ✅ Inclua informações completas do sistema
5. ✅ Adicione logs e screenshots quando relevante

## 🔄 Reset Completo

Se nada mais funcionar, tente um reset completo:

```bash
# 1. Limpe tudo
rm -rf node_modules
rm -rf .expo
rm -rf ios
rm -rf android
rm package-lock.json

# 2. Reinstale dependências
npm install

# 3. Reconfigure Expo
npx expo prebuild --clean

# 4. Inicie novamente
npx expo start --clear
```

Este reset resolve a maioria dos problemas relacionados a cache e configurações corrompidas.
