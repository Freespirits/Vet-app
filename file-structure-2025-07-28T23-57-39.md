# 📂 Estrutura de Arquivos do Projeto

> Gerado automaticamente em 05/08/2025, 20:39:35

```
📁 consultorio-app/
├── 🪝 .githooks/                          # Scripts de automação Git customizados
│   ├── 🪝 commit-msg                          # Hook para validação de mensagens de commit
│   ├── 🪝 pre-commit                          # Hook executado antes de cada commit
│   └── 🪝 pre-push                            # Hook executado antes de cada push
├── 📁 src/                                # Código fonte principal da aplicação
│   ├── 🧩 components/                         # Componentes de interface reutilizáveis
│   │   └── 📁 common/
│   │       ├── ⚡ Button.js                           # Script JavaScript
│   │       ├── ⚡ Card.js                             # Script JavaScript
│   │       ├── ⚡ Input.js                            # Script JavaScript
│   │       ├── ⚡ Loading.js                          # Script JavaScript
│   │       └── ⚡ SearchBar.js                        # Script JavaScript
│   ├── ⚙️ config/                             # Arquivos de configuração
│   │   └── ⚡ supabase.js                         # Script JavaScript
│   ├── 📁 constants/
│   │   ├── ⚡ Colors.js                           # Script JavaScript
│   │   ├── ⚡ Data.js                             # Script JavaScript
│   │   └── ⚡ Storage.js                          # Script JavaScript
│   ├── 📁 contexts/
│   │   └── ⚡ AuthContext.js                      # Script JavaScript
│   ├── 📁 navigation/
│   │   ├── ⚡ AppNavigator.js                     # Script JavaScript
│   │   ├── ⚡ AuthNavigator.js                    # Script JavaScript
│   │   └── ⚡ MainNavigator.js                    # Script JavaScript
│   ├── 📱 screens/                            # Telas da aplicação (mobile/desktop)
│   │   ├── 📁 agenda/
│   │   │   ├── ⚡ AgendaScreen.js                     # Script JavaScript
│   │   │   └── ⚡ NewAppointmentScreen.js             # Script JavaScript
│   │   ├── 🔐 auth/                               # Autenticação e autorização
│   │   │   └── ⚡ LoginScreen.js                      # Script JavaScript
│   │   ├── 📁 clients/
│   │   │   ├── ⚡ ClientListScreen.js                 # Script JavaScript
│   │   │   └── ⚡ NewClientScreen.js                  # Script JavaScript
│   │   ├── 📁 consultations/
│   │   │   └── ⚡ NewConsultationScreen.js            # Script JavaScript
│   │   ├── 📁 library/
│   │   │   └── ⚡ VetLibraryScreen.js                 # Script JavaScript
│   │   ├── 📁 pets/
│   │   │   ├── ⚡ NewPetScreen.js                     # Script JavaScript
│   │   │   └── ⚡ PetListScreen.js                    # Script JavaScript
│   │   ├── 📁 profile/
│   │   │   ├── ⚡ AboutScreen.js                      # Script JavaScript
│   │   │   ├── ⚡ BackupSettingsScreen.js             # Script JavaScript
│   │   │   ├── ⚡ ChangePasswordScreen.js             # Script JavaScript
│   │   │   ├── ⚡ EditProfileScreen.js                # Script JavaScript
│   │   │   ├── ⚡ HelpSupportScreen.js                # Script JavaScript
│   │   │   ├── ⚡ NotificationSettingsScreen.js       # Script JavaScript
│   │   │   ├── ⚡ PrivacyScreen.js                    # Script JavaScript
│   │   │   ├── ⚡ ProfileScreen.js                    # Script JavaScript
│   │   │   └── ⚡ VersionInfoScreen.js                # Script JavaScript
│   │   ├── ⚡ AppointmentDetailsScreen.js         # Script JavaScript
│   │   ├── ⚡ HomeScreen.js                       # Script JavaScript
│   │   └── ⚡ PatientDetailsScreen.js             # Script JavaScript
│   ├── ⚙️ services/                           # Serviços e integrações externas
│   │   ├── ⚡ AppointmentService.js               # Script JavaScript
│   │   ├── ⚡ AuthService.js                      # Script JavaScript
│   │   ├── ⚡ BackupService.js                    # Script JavaScript
│   │   ├── ⚡ ClientService.js                    # Script JavaScript
│   │   ├── ⚡ ConsultationService.js              # Script JavaScript
│   │   ├── ⚡ LibraryService.js                   # Script JavaScript
│   │   ├── ⚡ NotificationService.js              # Script JavaScript
│   │   └── ⚡ PetService.js                       # Script JavaScript
│   ├── 🎨 styles/                             # Arquivos de estilo CSS/SCSS
│   │   └── ⚡ globalStyles.js                     # Script JavaScript
│   └── 🔧 utils/                              # Utilitários e funções genéricas
│       ├── ⚡ helpers.js                          # Script JavaScript
│       ├── ⚡ storage.js                          # Script JavaScript
│       └── ⚡ validators.js                       # Script JavaScript
├── 📦 assets/                             # Recursos da aplicação (imagens, ícones, etc)
│   ├── 📁 screenshots/
│   │   ├── 🖼️ add_biblioteca.png                  # Imagem PNG otimizada
│   │   ├── 🖼️ add_paciente.png                    # Imagem PNG otimizada
│   │   ├── 🖼️ agenda.png                          # Imagem PNG otimizada
│   │   ├── 🖼️ ajuda_e_suporte.png                 # Imagem PNG otimizada
│   │   ├── 🖼️ alterar_senha.png                   # Imagem PNG otimizada
│   │   ├── 🖼️ backup_e_restauracao.png            # Imagem PNG otimizada
│   │   ├── 🖼️ biblioteca.png                      # Imagem PNG otimizada
│   │   ├── 🖼️ cadastrar_pet.png                   # Imagem PNG otimizada
│   │   ├── 🖼️ clients.png                         # Imagem PNG otimizada
│   │   ├── 🖼️ editar_perfil.png                   # Imagem PNG otimizada
│   │   ├── 🖼️ home.png                            # Imagem PNG otimizada
│   │   ├── 🖼️ login.png                           # Imagem PNG otimizada
│   │   ├── 🖼️ novo_agendamento.png                # Imagem PNG otimizada
│   │   ├── 🖼️ perfil.png                          # Imagem PNG otimizada
│   │   ├── 🖼️ pets.png                            # Imagem PNG otimizada
│   │   ├── 🖼️ politicas_de_privacidade.png        # Imagem PNG otimizada
│   │   ├── 🖼️ registro.png                        # Imagem PNG otimizada
│   │   ├── 🖼️ sobre.png                           # Imagem PNG otimizada
│   │   └── 🖼️ version.png                         # Imagem PNG otimizada
│   ├── 🖼️ adaptive-icon.png                   # Imagem PNG otimizada
│   ├── 🖼️ adaptive-icon0.png                  # Imagem PNG otimizada
│   ├── 🖼️ favicon.png                         # Imagem PNG otimizada
│   ├── 🖼️ icon.png                            # Imagem PNG otimizada
│   ├── 🖼️ logo.png                            # Imagem PNG otimizada
│   ├── 🖼️ splash-icon.png                     # Imagem PNG otimizada
│   ├── 🖼️ splash.png                          # Imagem PNG otimizada
│   └── 🖼️ splash0.png                         # Imagem PNG otimizada
├── 🗄️ db/                                 # Arquivos relacionados ao banco de dados
│   └── 📄 supabase.sql                        # Script SQL de banco de dados
├── 📜 CHANGELOG.md                        # Histórico detalhado de mudanças e versões
├── 📜 LICENSE                             # Licença de uso e distribuição do software
├── 📖 README.md                           # Documentação principal e guia de introdução
├── 📦 package.json                        # Dependências e scripts do projeto NPM
├── 📝 .editorconfig                       # Configuração de formatação entre editores
├── ⚙️ .gitattributes                      # Atributos específicos de arquivos no Git
├── 🚫 .gitignore                          # Arquivos e pastas ignorados pelo Git
├── ⚙️ .markdownlint.yml                   # Configuração YAML
├── 🪝 .pre-commit-config.yaml             # Configuração de hooks pre-commit
├── 🔧 .travis.yml                         # Configuração do Travis CI
├── 🏷️ .version                            # Número da versão atual do projeto
├── ⚛️ App.js                              # Componente raiz da aplicação React
├── ⚙️ app.json                            # Dados estruturados JSON
├── 📝 ARCHITECTURE.md                     # Documentação em Markdown
├── 🏗️ BUILDING.md                         # Instruções detalhadas para build do projeto
├── 📚 citation.cff                        # Formato de citação para trabalhos acadêmicos
├── 📜 CODE_OF_CONDUCT.md                  # Código de conduta da comunidade
├── 👥 CODEOWNERS                          # Definição de responsáveis por áreas do código
├── 📝 commitlint.config.js                # Regras para validação de commits
├── ⚙️ configure.sh                        # Script de configuração do ambiente
├── 🤝 CONTRIBUTING.md                     # Guia para contribuidores do projeto
├── 👥 CONTRIBUTORS.md                     # Lista de pessoas que contribuíram
├── 👥 contributors.yml                    # Dados estruturados dos contribuidores
├── ©️ COPYRIGHT                           # Informações de direitos autorais
├── 🤖 dependabot.yml                      # Configuração do Dependabot para atualizações
├── 📝 git-build-commit.md                 # Documentação em Markdown
├── 🚀 index.js                            # Ponto de entrada principal da aplicação
├── 💾 install.sh                          # Script de instalação automática
├── 🛠️ MAINTAINING.md                      # Guia para mantenedores do projeto
├── 🔨 Makefile                            # Automação de build e tarefas do projeto
├── 📋 MANIFEST.in                         # Especificação de arquivos para distribuição
├── 🚀 release.md                          # Notas e planejamento de releases
├── 📋 requisitos-funcionais.md            # Especificação dos requisitos funcionais
├── 📋 requisitos.md                       # Documentação de requisitos do sistema
├── 🗺️ Roadmap.md                          # Planejamento e cronograma de funcionalidades
├── 🚀 run.sh                              # Script para execução da aplicação
├── 🛡️ SECURITY.md                         # Política de segurança e vulnerabilidades
├── ⚡ struct.js                           # Script JavaScript
├── 📝 TODO.md                             # Lista de tarefas pendentes e melhorias
└── 🔧 TROUBLESHOOTING.md                  # Guia de resolução de problemas comuns
```

---
*Estrutura gerada com script profissional de análise de projetos*
