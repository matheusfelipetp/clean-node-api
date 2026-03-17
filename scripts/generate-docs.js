#!/usr/bin/env node
/**
 * generate-docs.js
 * Analisa a estrutura do projeto clean-node-api e regera o README.md automaticamente.
 * Executado pelo hook .husky/post-commit.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const README_PATH = path.join(ROOT, 'README.md');
const PKG_PATH = path.join(ROOT, 'package.json');
const SRC_PATH = path.join(ROOT, 'src');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/** Lista recursiva de arquivos .ts relativos a `baseDir` */
function listTs(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listTs(full, base));
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts') && !entry.name.endsWith('.test.ts')) {
      files.push(path.relative(base, full).replace(/\\/g, '/'));
    }
  }
  return files;
}

/** Lista subdiretórios diretos */
function subdirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);
}

// ─── Coleta de informações do projeto ─────────────────────────────────────────

const pkg = readJson(PKG_PATH);

const layers = {
  domain:       listTs(path.join(SRC_PATH, 'domain')),
  data:         listTs(path.join(SRC_PATH, 'data')),
  infra:        listTs(path.join(SRC_PATH, 'infra')),
  presentation: listTs(path.join(SRC_PATH, 'presentation')),
  utils:        listTs(path.join(SRC_PATH, 'utils')),
  main:         listTs(path.join(SRC_PATH, 'main')),
};

const routes      = subdirs(path.join(SRC_PATH, 'main', 'routes'));
const middlewares  = subdirs(path.join(SRC_PATH, 'main', 'middlewares'));
const controllers = listTs(path.join(SRC_PATH, 'presentation', 'controllers'))
  .filter(f => !f.includes('index'));
const useCases    = listTs(path.join(SRC_PATH, 'data', 'useCases'));

const now   = new Date().toISOString().split('T')[0];
const ver   = pkg.version || '1.0.0';
const name  = pkg.name || 'clean-node-api';

const deps    = Object.keys(pkg.dependencies   || {});
const devDeps = Object.keys(pkg.devDependencies || {});

// ─── Funções de detecção de estado ────────────────────────────────────────────

function detectImplementedItems() {
  const items = [
    '`AccountModel` — modelo de domínio',
    '`DbAddAccount` — caso de uso de criação de conta com criptografia',
    '`BcryptAdapter` — adaptador de criptografia',
    '`EmailValidatorAdapter` — validação de e-mail com `validator`',
    '`AccountMongoRepository` — repositório MongoDB',
    '`MongoHelper` — helper de conexão MongoDB',
    '`SignUpController` — controller com validações de entrada',
    'Middlewares globais: ' + (middlewares.length > 0 ? middlewares.join(', ') : 'nenhum detectado'),
    'Carregamento automático de rotas (`fast-glob`)',
    ...routes.map(r => `Rota \`${r}\`  definida`),
    'Cobertura de testes unitários e de integração',
  ];
  return items.map(i => `- [x] ${i}`).join('\n');
}

function detectPendingItems() {
  const factoriesDir = path.join(SRC_PATH, 'main', 'factories');
  const emptyFactories = listTs(factoriesDir)
    .filter(f => {
      const content = fs.readFileSync(path.join(factoriesDir, f.replace(/\//g, path.sep)), 'utf8').trim();
      return content.length === 0;
    });

  const items = [];
  if (emptyFactories.length > 0) {
    emptyFactories.forEach(f => items.push(`Factory \`${f}\` ainda não implementada`));
  }
  items.push('Endpoint `/api/signup` ainda não conectado ao controller');
  items.push('Adicionar autenticação/login');
  items.push('Pipeline de CI/CD');

  return items.map(i => `- [ ] ${i}`).join('\n');
}

// ─── Geração do Markdown ───────────────────────────────────────────────────────

function buildStackTable() {
  const map = {
    'TypeScript':        devDeps.includes('typescript') ? 'typescript' : null,
    'Node.js':           'runtime',
    'Express':           deps.includes('express') ? 'express' : null,
    'MongoDB':           deps.includes('mongodb') ? 'mongodb' : null,
    'bcrypt':            deps.includes('bcrypt') ? 'bcrypt' : null,
    'validator':         deps.includes('validator') ? 'validator' : null,
    'fast-glob':         deps.includes('fast-glob') ? 'fast-glob' : null,
    'dotenv':            deps.includes('dotenv') ? 'dotenv' : null,
    'Jest':              devDeps.includes('jest') ? 'jest' : null,
    'Husky':             devDeps.includes('husky') ? 'husky' : null,
    'ESLint':            devDeps.includes('eslint') ? 'eslint' : null,
  };

  const version = (key) => {
    const all = { ...pkg.dependencies, ...pkg.devDependencies };
    return all[key] ? all[key].replace(/[\^~>=<]/, '') : '–';
  };

  const rows = Object.entries(map)
    .filter(([, pkg]) => pkg && pkg !== 'runtime')
    .map(([label, p]) => `| ${label} | ${version(p)} |`);

  return [
    '| Tecnologia | Versão |',
    '|---|---|',
    '| Node.js | runtime |',
    ...rows,
  ].join('\n');
}

function buildLayerTable() {
  const descriptions = {
    domain:       'Modelos e contratos de negócio (núcleo puro)',
    data:         'Implementação dos casos de uso',
    infra:        'MongoDB, bcrypt e adaptadores de infraestrutura',
    presentation: 'Controllers, erros HTTP e helpers de resposta',
    utils:        'Utilitários independentes de framework',
    main:         'Composition Root — servidor, rotas, middlewares e factories',
  };

  return [
    '| Camada | Arquivos | Descrição |',
    '|---|---|---|',
    ...Object.entries(layers).map(
      ([layer, files]) => `| \`${layer}/\` | ${files.length} | ${descriptions[layer] || ''} |`
    ),
  ].join('\n');
}

function buildRoutesList() {
  if (routes.length === 0) return '_Nenhuma rota detectada._';
  return routes.map(r => `- \`POST /api/${r}\``).join('\n');
}

function buildControllersList() {
  if (controllers.length === 0) return '_Nenhum controller detectado._';
  return controllers.map(c => `- \`${c}\``).join('\n');
}

function buildUseCasesList() {
  if (useCases.length === 0) return '_Nenhum caso de uso detectado._';
  return useCases.map(u => `- \`${u}\``).join('\n');
}

const readme = `# ${name}

> 📋 Documentação gerada automaticamente em **${now}** | versão \`${ver}\`

API REST em **Node.js + TypeScript** seguindo os princípios de **Clean Architecture**, **SOLID** e **TDD**.

---

## Stack

${buildStackTable()}

---

## Como Executar

### Pré-requisitos

- Node.js ≥ 18
- MongoDB rodando em \`mongodb://localhost:27017\`

### Instalação

\`\`\`bash
npm install
\`\`\`

### Desenvolvimento

\`\`\`bash
npm start
# http://localhost:5050
\`\`\`

### Testes

\`\`\`bash
npm test                   # todos os testes
npm run test:unit          # unitários (watch)
npm run test:integration   # integração (watch)
npm run test:ci            # com cobertura
\`\`\`

### Gerar documentação manualmente

\`\`\`bash
npm run docs
\`\`\`

---

## Arquitetura — Clean Architecture

\`\`\`
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
\`\`\`

---

## Camadas do Projeto

${buildLayerTable()}

---

## Rotas HTTP

${buildRoutesList()}

---

## Controllers

${buildControllersList()}

---

## Casos de Uso

${buildUseCasesList()}

---

## Estado Atual

### ✅ Implementado

${detectImplementedItems()}

### ⚠️ Pendente

${detectPendingItems()}

---

> 🤖 Este README é **gerado automaticamente** pelo script \`scripts/generate-docs.js\`
> sempre que um commit é feito (via hook \`.husky/post-commit\`).
> Não edite manualmente — as alterações serão sobrescritas no próximo commit.
`;

// ─── Escrita do arquivo ────────────────────────────────────────────────────────

fs.writeFileSync(README_PATH, readme, 'utf8');
console.log(`✅ README.md atualizado em ${now}`);

// Adiciona ao stage para ser incluído no amend pelo hook
try {
  execSync('git add README.md', { cwd: ROOT, stdio: 'inherit' });
  console.log('📄 README.md adicionado ao stage git.');
} catch (e) {
  console.error('❌ Erro ao adicionar README.md ao git:', e.message);
  process.exit(1);
}
