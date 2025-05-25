# PetCare Pro

Sistema completo para gestão de clínicas veterinárias e petshops desenvolvido com React Native e Expo.

## 🚀 Características

### ✅ Implementado
- ✅ Sistema de autenticação completo
- ✅ Dashboard com estatísticas em tempo real
- ✅ Gestão de clientes (CRUD completo)
- ✅ Gestão de pets (CRUD completo)
- ✅ Histórico de consultas
- ✅ Interface responsiva e moderna
- ✅ Componentes reutilizáveis
- ✅ Navegação intuitiva
- ✅ Armazenamento local (AsyncStorage)
- ✅ Validação de formulários
- ✅ Estados de loading e erro

### 🚧 Em Desenvolvimento
- 🚧 Cadastro de usuários
- 🚧 Agendamento de consultas
- 🚧 Biblioteca veterinária
- 🚧 Relatórios e estatísticas
- 🚧 Backup e sincronização
- 🚧 Notificações push
- 🚧 Modo offline

## 📱 Compatibilidade

- ✅ iOS
- ✅ Android
- ✅ Expo Go (SDK 53)
- ✅ Expo Development Build

## 🛠️ Tecnologias

- **React Native** - Framework principal
- **Expo SDK 53** - Plataforma de desenvolvimento
- **React Navigation v6** - Navegação
- **AsyncStorage** - Armazenamento local
- **Expo Vector Icons** - Ícones
- **React Native Gesture Handler** - Gestos
- **React Native Reanimated** - Animações

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── common/         # Button, Input, Card, Loading
│   └── forms/          # Componentes de formulário
├── screens/            # Telas da aplicação
│   ├── auth/          # Telas de autenticação
│   ├── clients/       # Gestão de clientes
│   ├── pets/          # Gestão de pets
│   ├── library/       # Biblioteca veterinária
│   └── profile/       # Perfil do usuário
├── services/          # Serviços de dados
├── contexts/          # Contextos React
├── constants/         # Constantes (cores, dados)
├── utils/            # Utilitários e helpers
├── styles/           # Estilos globais
└── navigation/       # Configuração de navegação
```

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- Expo CLI
- iOS Simulator ou Android Emulator (opcional)
- Expo Go no dispositivo móvel

### Instalação Automática
```bash
# Executar o script de setup
node setup-petcare-pro.js
```

### Instalação Manual
```bash
# Criar projeto Expo
npx create-expo-app PetCarePro --template blank
cd PetCarePro

# Instalar dependências
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage @expo/vector-icons @react-native-picker/picker react-native-gesture-handler react-native-reanimated

# Iniciar projeto
npx expo start
```

## 🔐 Credenciais de Demonstração

Para testar o aplicativo, use:
- **Email:** admin@petcare.com
- **Senha:** 123456

## 📊 Funcionalidades Principais

### Dashboard
- Estatísticas em tempo real
- Consultas do dia
- Ações rápidas
- Histórico recente

### Gestão de Clientes
- Cadastro completo
- Validação de CPF
- Busca e filtros
- Histórico de pets

### Gestão de Pets
- Cadastro detalhado
- Espécies e raças
- Histórico médico
- Fotos e documentos

### Sistema de Consultas
- Registro de atendimentos
- Prescrições
- Procedimentos
- Acompanhamento

## 🎨 Design System

### Cores
- **Primary:** #2E7D32 (Verde Veterinário)
- **Secondary:** #81C784 (Verde Claro)
- **Background:** #F1F8E9 (Verde Muito Claro)
- **Surface:** #FFFFFF (Branco)
- **Error:** #F44336 (Vermelho)

### Componentes
- **Button:** Variações primary, secondary, outline, ghost
- **Input:** Com ícones, validação e estados
- **Card:** Container padronizado
- **Loading:** Estados de carregamento

## 📈 Próximas Versões

### v1.1.0
- [ ] Cadastro de usuários
- [ ] Recuperação de senha
- [ ] Perfil do veterinário

### v1.2.0
- [ ] Agendamento online
- [ ] Lembretes automáticos
- [ ] Integração com calendário

### v1.3.0
- [ ] Relatórios PDF
- [ ] Backup em nuvem
- [ ] Sincronização multi-device

### v2.0.0
- [ ] API REST
- [ ] Multi-clínica
- [ ] Aplicativo para clientes

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para dúvidas, sugestões ou problemas:
- 📧 Email: suporte@petcarepro.com
- 💬 Issues: GitHub Issues
- 📱 WhatsApp: Disponível no app

## 🏆 Agradecimentos

- Comunidade React Native
- Expo Team
- Veterinários que contribuíram com feedback
- Beta testers

---

**Desenvolvido com ❤️ para veterinários brasileiros**
