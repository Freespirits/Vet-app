# Guia de Contribuição - PetCare Pro

Obrigado por seu interesse em contribuir com o PetCare Pro! Este documento fornece diretrizes para contribuições efetivas ao projeto.

## 🎯 Como Contribuir

### Tipos de Contribuições Bem-vindas
- 🐛 **Correção de bugs**
- ✨ **Novas funcionalidades**
- 📚 **Melhorias na documentação**
- 🧪 **Testes adicionais**
- 🎨 **Melhorias na interface**
- ⚡ **Otimizações de performance**
- 🌐 **Traduções**
- 🔒 **Melhorias de segurança**

### Antes de Contribuir
1. Verifique se já existe uma issue relacionada
2. Para mudanças grandes, crie uma issue para discussão primeiro
3. Leia todo este documento
4. Configure seu ambiente de desenvolvimento

## 🚀 Configuração do Ambiente

### Pré-requisitos
- Node.js 18.x ou superior
- npm ou yarn
- Git configurado
- Expo CLI instalado globalmente
- Acesso ao Supabase (para testes)

### Configuração Inicial
1. **Fork o repositório**
   ```bash
   # Clique em "Fork" no GitHub
   git clone https://github.com/SEU_USERNAME/consultorio-app.git
   cd consultorio-app
   ```

2. **Configure remotes**
   ```bash
   git remote add upstream https://github.com/PetCareAi/consultorio-app.git
   git remote -v
   ```

3. **Instale dependências**
   ```bash
   npm install
   ```

4. **Configure ambiente de desenvolvimento**
   ```bash
   cp .env.example .env
   # Edite o .env com suas configurações
   ```

5. **Execute o projeto**
   ```bash
   npm start
   ```

## 📋 Processo de Contribuição

### 1. Escolhendo uma Issue
- Procure issues marcadas com `good first issue` para começar
- Issues marcadas com `help wanted` precisam de contribuidores
- Comente na issue indicando que vai trabalhar nela

### 2. Criando uma Branch
```bash
# Sempre crie branch a partir de develop atualizado
git checkout develop
git pull upstream develop

# Crie sua branch seguindo a convenção
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
# ou
git checkout -b docs/nome-da-documentacao
```

### 3. Desenvolvimento

#### Padrões de Código
- **JavaScript/TypeScript**: Siga o ESLint configurado
- **Componentes React**: Use hooks e functional components
- **Styling**: Use StyleSheet do React Native
- **Nomenclatura**: Use camelCase para variáveis, PascalCase para componentes

#### Estrutura de Arquivos
```
src/
├── components/          # Componentes reutilizáveis
│   ├── common/         # Componentes base (Button, Input, etc.)
│   └── specific/       # Componentes específicos
├── screens/            # Telas da aplicação
├── services/           # Serviços e APIs
├── utils/              # Utilitários e helpers
├── constants/          # Constantes e configurações
├── contexts/           # Context providers
├── navigation/         # Configuração de navegação
└── styles/             # Estilos globais
```

#### Convenções de Código
```javascript
// ✅ Bom
const ClientService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('clients_consultorio')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
  }
};

// ❌ Evitar
function getAllClients() {
  return supabase.from('clients_consultorio').select('*');
}
```

### 4. Testes

#### Executando Testes
```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

#### Escrevendo Testes
```javascript
// __tests__/services/ClientService.test.js
import { ClientService } from '../src/services/ClientService';

describe('ClientService', () => {
  describe('getAll', () => {
    it('deve retornar lista de clientes', async () => {
      const clients = await ClientService.getAll();
      expect(Array.isArray(clients)).toBe(true);
    });

    it('deve retornar array vazio em caso de erro', async () => {
      // Mock error scenario
      const clients = await ClientService.getAll();
      expect(clients).toEqual([]);
    });
  });
});
```

### 5. Documentação
- Documente novas funcionalidades
- Atualize README.md se necessário
- Adicione comentários em código complexo
- Inclua exemplos de uso quando relevante

```javascript
/**
 * Busca todos os clientes do usuário autenticado
 * @returns {Promise<Array>} Lista de clientes ou array vazio
 * @throws {Error} Em caso de erro de rede ou autenticação
 */
async getAll() {
  // implementação
}
```

## 📝 Padrões de Commit

### Formato
```
tipo(escopo): descrição curta

Descrição detalhada (se necessário)

Resolve #123
```

### Tipos Aceitos
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

### Exemplos
```bash
feat(auth): adiciona recuperação de senha

fix(appointments): corrige erro de data inválida

docs(contributing): atualiza guia de contribuição

test(services): adiciona testes para ClientService
```

## 🔍 Code Review

### Preparando um Pull Request

1. **Atualize sua branch**
   ```bash
   git fetch upstream
   git rebase upstream/develop
   ```

2. **Execute verificações**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

3. **Commit e push**
   ```bash
   git add .
   git commit -m "feat(feature): implementa nova funcionalidade"
   git push origin feature/nome-da-feature
   ```

### Template de Pull Request
```markdown
## 📋 Descrição
Breve descrição das mudanças implementadas.

## 🔗 Issue Relacionada
Resolve #123

## 🧪 Tipo de Mudança
- [ ] 🐛 Bug fix
- [ ] ✨ Nova feature
- [ ] 💥 Breaking change
- [ ] 📚 Documentação

## ✅ Checklist
- [ ] Código segue os padrões do projeto
- [ ] Self-review realizado
- [ ] Comentários adicionados em código complexo
- [ ] Testes adicionados/atualizados
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Testado em iOS e Android

## 📱 Screenshots
(Adicione screenshots se houver mudanças visuais)

## 🧪 Como Testar
1. Passos específicos para testar
2. Cenários de edge cases
3. Dispositivos/plataformas testados
```

### Critérios de Aprovação
- ✅ Código funciona conforme esperado
- ✅ Testes passam
- ✅ Segue padrões de código
- ✅ Documentação adequada
- ✅ Performance não impactada
- ✅ Compatível com iOS e Android
- ✅ Sem breaking changes sem aviso

## 🐛 Reportando Bugs

### Template de Bug Report
```markdown
## 🐛 Descrição do Bug
Descrição clara e concisa do bug.

## 🔄 Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Faça scroll para '...'
4. Veja o erro

## 📱 Comportamento Esperado
Descrição do que deveria acontecer.

## 📱 Comportamento Atual
Descrição do que está acontecendo.

## 📸 Screenshots
Adicione screenshots se aplicável.

## 🔧 Ambiente
- **Dispositivo**: [e.g. iPhone 12, Samsung Galaxy S21]
- **SO**: [e.g. iOS 15.1, Android 12]
- **Versão do App**: [e.g. 1.2.0]
- **Plataforma**: [e.g. Expo Go, Build de produção]

## 📋 Informações Adicionais
Qualquer contexto adicional sobre o problema.
```

## ✨ Solicitando Features

### Template de Feature Request
```markdown
## 🚀 Feature Request

### 📋 Problema Relacionado
Descrição clara do problema que esta feature resolve.

### 💡 Solução Proposta
Descrição clara da solução desejada.

### 🎯 Alternativas Consideradas
Outras soluções consideradas.

### 📱 Mockups/Exemplos
Screenshots, mockups ou exemplos de outras aplicações.

### 📊 Impacto
- **Usuários afetados**: [quantidade/tipo]
- **Prioridade**: [baixa/média/alta]
- **Complexidade estimada**: [baixa/média/alta]
```

## 🏷️ Convenções de Labels

### Tipos
- `bug` - Problemas confirmados
- `enhancement` - Melhorias
- `feature` - Novas funcionalidades
- `documentation` - Melhorias na documentação
- `question` - Dúvidas

### Prioridade
- `priority: high` - Alta prioridade
- `priority: medium` - Média prioridade
- `priority: low` - Baixa prioridade

### Status
- `good first issue` - Bom para iniciantes
- `help wanted` - Precisa de ajuda
- `in progress` - Em desenvolvimento
- `needs review` - Precisa de revisão

### Plataforma
- `platform: ios` - Específico do iOS
- `platform: android` - Específico do Android
- `platform: web` - Específico da web

## 🎨 Padrões de UI/UX

### Design System
- Siga as cores definidas em `src/constants/Colors.js`
- Use componentes base de `src/components/common/`
- Mantenha consistência visual
- Teste em diferentes tamanhos de tela

### Acessibilidade
- Adicione `accessibilityLabel` em elementos interativos
- Use cores com contraste adequado
- Teste com leitores de tela
- Suporte a diferentes tamanhos de fonte

```javascript
// ✅ Bom
<TouchableOpacity
  accessibilityLabel="Salvar consulta"
  accessibilityRole="button"
  onPress={handleSave}
>
  <Text>Salvar</Text>
</TouchableOpacity>
```

## 🌐 Internacionalização

### Adicionando Traduções
```javascript
// src/constants/strings.js
export const strings = {
  pt: {
    save: 'Salvar',
    cancel: 'Cancelar',
    // ...
  },
  en: {
    save: 'Save',
    cancel: 'Cancel',
    // ...
  }
};
```

## 📊 Performance

### Diretrizes
- Use `React.memo` para componentes pesados
- Implemente lazy loading quando apropriado
- Otimize consultas ao banco
- Minimize re-renders desnecessários

```javascript
// ✅ Bom
const PetCard = React.memo(({ pet, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(pet.id)}>
      <Text>{pet.name}</Text>
    </TouchableOpacity>
  );
});
```

## 🔒 Segurança

### Checklist de Segurança
- [ ] Nunca exponha API keys no código
- [ ] Valide inputs do usuário
- [ ] Use HTTPS para todas as requisições
- [ ] Implemente rate limiting quando necessário
- [ ] Sanitize dados antes de salvar

## 🚀 Release Process

### Participando de Releases
1. Contribuições são incluídas em releases baseadas na branch `develop`
2. Releases seguem versionamento semântico
3. Changelog é atualizado automaticamente
4. Notificações são enviadas para contributors

## 🎉 Reconhecimento

### Contributors Hall of Fame
Todos os contributors são reconhecidos:
- README.md lista principais contributors
- Releases mencionam contribuições específicas
- Bot automaticamente adiciona contributors

### Badges e Conquistas
- 🥇 First Contribution
- 🐛 Bug Hunter
- ✨ Feature Creator
- 📚 Documentation Master
- 🧪 Test Champion

## 📞 Comunicação

### Canais
- **GitHub Issues**: Bugs e features
- **GitHub Discussions**: Discussões gerais
- **Discord**: Chat em tempo real (em breve)
- **Email**: contato@petcare.ai

### Etiqueta
- Seja respeitoso e construtivo
- Use linguagem clara e objetiva
- Forneça contexto suficiente
- Agradeça contributions de outros

## 🆘 Precisa de Ajuda?

### Para Iniciantes
- Comece com issues marcadas `good first issue`
- Leia toda a documentação
- Não hesite em fazer perguntas
- Peça ajuda nas discussions

### Para Contributors Experientes
- Ajude a revisar PRs
- Melhore documentação
- Sugira arquiteturas
- Mentore novos contributors

---

## 💝 Agradecimentos

Obrigado por contribuir com o PetCare Pro! Sua ajuda torna este projeto melhor para toda a comunidade veterinária.

**Lembre-se**: Toda contribuição, por menor que seja, faz diferença! 🚀
