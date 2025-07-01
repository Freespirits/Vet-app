# Arquitetura - PetCare Pro

## 📋 Visão Geral

O PetCare Pro é um aplicativo móvel desenvolvido em React Native que utiliza uma arquitetura moderna e escalável para gestão de clínicas veterinárias. O sistema segue os princípios de Clean Architecture e utiliza tecnologias atuais para garantir performance, segurança e manutenibilidade.

## 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────────┐
│                    APRESENTAÇÃO                         │
├─────────────────────────────────────────────────────────┤
│  React Native App (iOS/Android)                        │
│  ├── Screens (Telas)                                   │
│  ├── Components (Componentes)                          │
│  ├── Navigation (Navegação)                            │
│  └── Contexts (Gerenciamento de Estado)                │
├─────────────────────────────────────────────────────────┤
│                     DOMÍNIO                             │
├─────────────────────────────────────────────────────────┤
│  Business Logic                                         │
│  ├── Services (Serviços)                               │
│  ├── Utils (Utilitários)                               │
│  ├── Validators (Validadores)                          │
│  └── Constants (Constantes)                            │
├─────────────────────────────────────────────────────────┤
│                   INFRAESTRUTURA                        │
├─────────────────────────────────────────────────────────┤
│  External Services                                      │
│  ├── Supabase (Database + Auth)                        │
│  ├── AsyncStorage (Local Storage)                      │
│  ├── Expo APIs (Device Features)                       │
│  └── Third-party APIs                                  │
└─────────────────────────────────────────────────────────┘
```

## 📱 Camada de Apresentação

### Estrutura de Diretórios
```
src/
├── screens/           # Telas do aplicativo
│   ├── auth/         # Telas de autenticação
│   ├── clients/      # Gestão de clientes
│   ├── pets/         # Gestão de pets
│   ├── consultations/# Consultas veterinárias
│   ├── agenda/       # Agendamento
│   ├── library/      # Biblioteca veterinária
│   └── profile/      # Perfil do usuário
├── components/       # Componentes reutilizáveis
│   ├── common/       # Componentes básicos
│   └── specific/     # Componentes específicos
├── navigation/       # Configuração de navegação
└── contexts/         # Gerenciamento de estado global
```

### Principais Tecnologias
- **React Native 0.79.2**: Framework principal
- **React Navigation 6**: Navegação entre telas
- **React Context**: Gerenciamento de estado
- **Expo SDK 53**: Ferramentas e APIs nativas
- **React Native Gesture Handler**: Gestos e animações

## 🔧 Camada de Domínio

### Services (Serviços)
Cada entidade principal possui seu próprio service para encapsular a lógica de negócio:

```typescript
// Estrutura padrão de um Service
class EntityService {
  async getAll(): Promise<Entity[]>
  async getById(id: string): Promise<Entity>
  async create(data: EntityData): Promise<Result>
  async update(id: string, data: EntityData): Promise<Result>
  async delete(id: string): Promise<Result>
  async search(query: string): Promise<Entity[]>
}
```

### Principais Services
- **AuthService**: Autenticação e autorização
- **ClientService**: Gestão de clientes
- **PetService**: Gestão de pets
- **ConsultationService**: Consultas veterinárias
- **AppointmentService**: Agendamentos
- **LibraryService**: Biblioteca veterinária
- **BackupService**: Backup e restauração
- **NotificationService**: Notificações

### Utils e Helpers
- **Validators**: Validação de dados (email, CPF, telefone)
- **Helpers**: Formatação de dados e utilitários
- **Storage**: Abstração para armazenamento local

## 🗄️ Camada de Infraestrutura

### Banco de Dados (Supabase PostgreSQL)

#### Esquema Principal
```sql
-- Tabela de usuários (veterinários)
users_consultorio
├── id (UUID, PK)
├── email (VARCHAR, UNIQUE)
├── name (VARCHAR)
├── profession (VARCHAR)
├── clinic (VARCHAR)
├── crmv (VARCHAR)
├── phone (VARCHAR)
├── photo_url (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

-- Tabela de clientes
clients_consultorio
├── id (UUID, PK)
├── user_id (UUID, FK)
├── name (VARCHAR)
├── email (VARCHAR)
├── phone (VARCHAR)
├── cpf (VARCHAR)
├── address (TEXT)
├── city (VARCHAR)
├── state (VARCHAR)
├── zip_code (VARCHAR)
├── notes (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

-- Tabela de pets
pets_consultorio
├── id (UUID, PK)
├── client_id (UUID, FK)
├── name (VARCHAR)
├── species (VARCHAR)
├── breed (VARCHAR)
├── gender (VARCHAR)
├── birth_date (DATE)
├── weight (DECIMAL)
├── color (VARCHAR)
├── microchip (VARCHAR)
├── photo_url (TEXT)
├── notes (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

-- Tabela de consultas
consultations_consultorio
├── id (UUID, PK)
├── client_id (UUID, FK)
├── pet_id (UUID, FK)
├── user_id (UUID, FK)
├── type (VARCHAR)
├── date (TIMESTAMP)
├── symptoms (TEXT)
├── diagnosis (TEXT)
├── treatment (TEXT)
├── prescription (TEXT)
├── observations (TEXT)
├── follow_up_date (TIMESTAMP)
├── weight (DECIMAL)
├── temperature (DECIMAL)
├── heart_rate (INTEGER)
├── price (DECIMAL)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

-- Tabela de agendamentos
appointments_consultorio
├── id (UUID, PK)
├── client_id (UUID, FK)
├── pet_id (UUID, FK)
├── user_id (UUID, FK)
├── title (VARCHAR)
├── description (TEXT)
├── date (TIMESTAMP)
├── duration (INTEGER)
├── status (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

-- Tabela de biblioteca veterinária
library_items_consultorio
├── id (UUID, PK)
├── user_id (UUID, FK)
├── category (VARCHAR)
├── name (VARCHAR)
├── description (TEXT)
├── dosage (VARCHAR)
├── frequency (VARCHAR)
├── contraindications (TEXT)
├── observations (TEXT)
├── species (VARCHAR)
├── diseases (TEXT[])
├── schedule (VARCHAR)
├── booster (VARCHAR)
├── duration (INTEGER)
├── price (DECIMAL)
├── custom_fields (JSONB)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### Relacionamentos
```
users_consultorio (1) ──→ (N) clients_consultorio
clients_consultorio (1) ──→ (N) pets_consultorio
pets_consultorio (1) ──→ (N) consultations_consultorio
users_consultorio (1) ──→ (N) consultations_consultorio
users_consultorio (1) ──→ (N) appointments_consultorio
users_consultorio (1) ──→ (N) library_items_consultorio
```

### Autenticação e Autorização
- **Supabase Auth**: Sistema de autenticação JWT
- **Row Level Security (RLS)**: Desabilitado para desenvolvimento
- **Context-based Auth**: Gerenciamento de sessão no React

### Armazenamento Local
- **AsyncStorage**: Dados de configuração e cache
- **Expo SecureStore**: Tokens e dados sensíveis
- **File System**: Backup de dados locais

## 🔄 Fluxo de Dados

### Padrão de Comunicação
```
Screen/Component
    ↓ (action)
Context/Service
    ↓ (API call)
Supabase Client
    ↓ (HTTP/WebSocket)
Supabase Backend
    ↓ (SQL)
PostgreSQL Database
```

### Gerenciamento de Estado
1. **Local State**: useState para estado específico de componente
2. **Context API**: Estado global (autenticação, configurações)
3. **Services**: Lógica de negócio e chamadas API
4. **Cache Local**: AsyncStorage para dados offline

## 🔒 Segurança

### Autenticação
- JWT tokens com renovação automática
- Sessões seguras com timeout
- Logout automático em caso de inatividade

### Dados
- Validação rigorosa de inputs
- Sanitização de dados antes do armazenamento
- Criptografia para dados sensíveis locais

### API
- Rate limiting via Supabase
- Validação de permissões por usuário
- Logs de auditoria para ações críticas

## 📈 Performance

### Otimizações
- **Lazy Loading**: Carregamento sob demanda
- **Memoização**: React.memo e useMemo
- **Pagination**: Listas grandes com paginação
- **Image Optimization**: Compressão e cache de imagens

### Cache Strategy
- **Memory Cache**: Dados frequentemente acessados
- **Disk Cache**: Imagens e dados offline
- **TTL Cache**: Expiração automática de dados

## 🧪 Testes

### Estratégia de Testes
```
Pirâmide de Testes:
├── Unit Tests (70%)        # Funções e utils
├── Integration Tests (20%) # Services e APIs
└── E2E Tests (10%)        # Fluxos completos
```

### Ferramentas
- **Jest**: Framework de testes
- **React Native Testing Library**: Testes de componentes
- **Detox**: Testes E2E
- **Flipper**: Debug e profiling

## 🚀 Deploy e CI/CD

### Ambientes
- **Development**: Build local com hot reload
- **Staging**: Testes em ambiente similar à produção
- **Production**: Versão final nas lojas

### Pipeline
```
git push → GitHub Actions → Build → Test → Deploy
├── Lint & Format Check
├── Unit Tests
├── Build iOS/Android
├── E2E Tests
└── Deploy to Stores
```

## 📊 Monitoramento

### Métricas
- **Performance**: Tempo de resposta, uso de memória
- **Erros**: Crash reports, erro de API
- **Uso**: Analytics de funcionalidades
- **Negócio**: Retenção, engajamento

### Ferramentas
- **Expo Analytics**: Métricas básicas
- **Sentry**: Monitoramento de erros
- **Flipper**: Debug em desenvolvimento
- **Supabase Dashboard**: Métricas de backend

## 🔮 Escalabilidade

### Horizontal
- Múltiplas instâncias do Supabase
- CDN para assets estáticos
- Load balancer para distribuição

### Vertical
- Otimização de queries SQL
- Índices no banco de dados
- Cache em memória no backend

### Futuro
- Microserviços para funcionalidades específicas
- Event-driven architecture
- Serverless functions para processamento

## 📚 Documentação Técnica

### Padrões de Código
- **ESLint**: Linting automático
- **Prettier**: Formatação consistente
- **TypeScript**: Tipagem estática (futuro)
- **JSDoc**: Documentação de funções

### Convenções
- **Nomenclatura**: camelCase para variáveis, PascalCase para componentes
- **Estrutura**: Organização por feature
- **Imports**: Ordem alfabética com grupos
- **Commits**: Conventional Commits

---

**Versão:** 1.0.0  
**Última atualização:** 01/07/2025  
**Responsável:** Equipe de Arquitetura PetCare Pro
