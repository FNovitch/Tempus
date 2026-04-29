<p align="center">
  <img
    loading="lazy"
    src="https://img.shields.io/static/v1?label=STATUS&message=%20CONCLUIDO&color=GREEN&style=for-the-badge"
  />
</p>

<h1 align="center">Tempus</h1>

<p align="center">
  Aplicacao de consulta de clima com interface minimalista e back-end proprio
  em Node.js para consumo seguro da API da OpenWeather.
</p>

## Sobre o projeto

O **Tempus** e um projeto de portifolio criado para praticar fundamentos de
desenvolvimento web com foco em experiencia do usuario, integracao com API
externa e organizacao de uma aplicacao full stack simples.

O projeto permite pesquisar cidades e visualizar informacoes atuais de clima,
como temperatura e velocidade do vento, em uma interface limpa, responsiva e
objetiva.

## Funcionalidades

- Busca de clima por cidade
- Exibicao de temperatura atual e velocidade do vento
- Interface responsiva para desktop e mobile
- Consumo de API externa com tratamento de erros
- Back-end proprio para proteger a chave da API
- Cache em memoria para reduzir chamadas repetidas
- Rate limit simples para proteger o endpoint

## Tecnologias utilizadas

- `HTML5`
- `CSS3`
- `TypeScript`
- `JavaScript`
- `Node.js`
- `OpenWeather API`

## Estrutura do projeto

```text
Tempus/
|- dist/
|- server/
|  |- cache.js
|  |- config.js
|  |- rate-limiter.js
|  |- server.js
|  |- static.js
|  |- weather-service.js
|- src/
|  |- css/
|  |- images/
|  |- ts/
|- index.html
|- package.json
```

## Arquitetura atual

O projeto foi evoluido de uma aplicacao front-end pura para uma estrutura com
back-end proprio.

### Front-end

- Interface feita com `HTML`, `CSS` e `TypeScript`
- Consome a rota local `/api/weather`
- Trata respostas invalidas e mensagens de erro para o usuario

### Back-end

- Servidor HTTP em `Node.js`
- Endpoint `GET /api/health` para validacao do servidor
- Endpoint `GET /api/weather?city=...` para consulta de clima
- Leitura de chave via variavel de ambiente
- Cache em memoria para respostas repetidas
- Rate limit simples por IP

## Como executar localmente

1. Crie um arquivo `.env` na raiz do projeto.
2. Adicione a chave da OpenWeather:

```env
OPENWEATHER_API_KEY=sua_chave_aqui
PORT=3000
```

3. Inicie o servidor:

```bash
node server/server.js
```

4. Acesse no navegador:

```text
http://localhost:3000
```

## Scripts disponiveis

```bash
npm start
npm run dev
```

## Objetivos de aprendizado demonstrados

- Consumo de API REST
- Manipulacao do DOM com TypeScript
- Separacao entre front-end e back-end
- Uso de variaveis de ambiente
- Tratamento de erros no cliente e no servidor
- Estruturacao inicial de uma aplicacao para portifolio

## Melhorias realizadas nesta versao

- Criacao de back-end proprio para esconder a chave da API
- Refatoracao visual para uma interface mais moderna e minimalista
- Novo logo com melhor contraste no header
- Melhor responsividade para telas menores
- Melhor tratamento de erro quando a API nao responde em JSON

## 🚀 Acesse o projeto

Deploy atual do projeto:

👉 [(https://tempus-fnovitchs-projects.vercel.app)]
