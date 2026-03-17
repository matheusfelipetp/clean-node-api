# clean-node-api

> 📋 Documentação gerada automaticamente em **2026-03-17** | versão `1.0.0`

API REST em **Node.js + TypeScript** seguindo os princípios de **Clean Architecture**, **SOLID** e **TDD**.

---

## Stack

| Tecnologia | Versão |
|---|---|
| Node.js | runtime |
| TypeScript | 5.9.3 |
| Express | 5.2.1 |
| MongoDB | 7.1.0 |
| bcrypt | 6.0.0 |
| validator | 13.15.26 |
| fast-glob | 3.3.3 |
| dotenv | 17.3.1 |
| Jest | 30.3.0 |
| Husky | 9.1.7 |
| ESLint | 9.39.4 |

---

## Como Executar

### Pré-requisitos

- Node.js ≥ 18
- MongoDB rodando em `mongodb://localhost:27017`

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm start
# http://localhost:5050
```

### Testes

```bash
npm test                   # todos os testes
npm run test:unit          # unitários (watch)
npm run test:integration   # integração (watch)
npm run test:ci            # com cobertura
```

### Gerar documentação manualmente

```bash
npm run docs
```

---

## Arquitetura — Clean Architecture

```
┌──────────────────────────────────────────────────────┐
│  main  (Composition Root / Frameworks & Drivers)     │
│  ┌────────────────────────────────────────────────┐  │
│  │  infra + presentation  (Interface Adapters)    │  │
│  │  ┌──────────────────────────────────────────┐  │  │
│  │  │  data  (Application Business Rules)      │  │  │
│  │  │  ┌────────────────────────────────────┐  │  │  │
│  │  │  │  domain  (Enterprise Rules)        │  │  │  │
│  │  │  └────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## Camadas do Projeto

| Camada | Arquivos | Descrição |
|---|---|---|
| `domain/` | 2 | Modelos e contratos de negócio (núcleo puro) |
| `data/` | 4 | Implementação dos casos de uso |
| `infra/` | 3 | MongoDB, bcrypt e adaptadores de infraestrutura |
| `presentation/` | 11 | Controllers, erros HTTP e helpers de resposta |
| `utils/` | 2 | Utilitários independentes de framework |
| `main/` | 11 | Composition Root — servidor, rotas, middlewares e factories |

---

## Rotas HTTP

- `POST /api/signup`

---

## Controllers

- `signup/signup-protocols.ts`
- `signup/signup.ts`

---

## Casos de Uso

- `add-account/db-add-account-protocols.ts`
- `add-account/db-add-account.ts`

---

## Estado Atual

### ✅ Implementado

- [x] `AccountModel` — modelo de domínio
- [x] `DbAddAccount` — caso de uso de criação de conta com criptografia
- [x] `BcryptAdapter` — adaptador de criptografia
- [x] `EmailValidatorAdapter` — validação de e-mail com `validator`
- [x] `AccountMongoRepository` — repositório MongoDB
- [x] `MongoHelper` — helper de conexão MongoDB
- [x] `SignUpController` — controller com validações de entrada
- [x] Middlewares globais: body-parser, content-type, cors
- [x] Carregamento automático de rotas (`fast-glob`)
- [x] Rota `signup`  definida
- [x] Cobertura de testes unitários e de integração

### ⚠️ Pendente

- [ ] Endpoint `/api/signup` ainda não conectado ao controller
- [ ] Adicionar autenticação/login
- [ ] Pipeline de CI/CD

---

> 🤖 Este README é **gerado automaticamente** pelo script `scripts/generate-docs.js`
> sempre que um commit é feito (via hook `.husky/post-commit`).
> Não edite manualmente — as alterações serão sobrescritas no próximo commit.
