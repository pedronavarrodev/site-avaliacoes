# Sistema de Vendas de Avaliações Google

Sistema web para venda de avaliações do Google, desenvolvido com Next.js, TailwindCSS e MongoDB.

## 🚀 Tecnologias

- Next.js 14
- TailwindCSS
- MongoDB
- Mercado Pago
- TypeScript

## ⚙️ Pré-requisitos

- Node.js 18+ 
- MongoDB Atlas (ou MongoDB local)
- Conta no Mercado Pago

## 🔧 Configuração do Ambiente

1. Clone o repositório
```bash
git clone https://github.com/pedronavarrodev/site-avaliacoes.git
cd site-avaliacoes
```

2. Instale as dependências:
```bash
npm install
```

3. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

4. Configure as variáveis de ambiente no arquivo `.env`:
```env
MONGODB_URI=sua_uri_mongodb_aqui
MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
ADMIN_PASSWORD=senha_admin_aqui
NEXTAUTH_SECRET=seu_secret_aqui
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

5. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

## 🌟 Funcionalidades

- Landing page moderna e responsiva
- Sistema de compra integrado com Mercado Pago
- Painel administrativo para gestão de pedidos
- Sistema de depoimentos
- Webhook para atualização automática do status do pagamento
- Sistema de autenticação para área administrativa

## 📁 Estrutura do Projeto

```
/app
  /api         - APIs e rotas da aplicação
  /admin       - Painel administrativo
  /components  - Componentes React
/lib          - Configurações e utilitários
/models       - Modelos do MongoDB
/public       - Arquivos estáticos
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça fork deste repositório
2. Crie uma conta na [Vercel](https://vercel.com)
3. Importe o projeto do GitHub
4. Configure as variáveis de ambiente:
   - Use o token de produção do Mercado Pago (`APP_USR-`)
   - Configure `NEXT_PUBLIC_BASE_URL` com a URL da sua aplicação
   - Configure as demais variáveis conforme necessário

### Variáveis de Ambiente em Produção

- `MONGODB_URI`: URI do seu banco MongoDB
- `MERCADOPAGO_ACCESS_TOKEN`: Token de produção do Mercado Pago
- `ADMIN_PASSWORD`: Senha para acesso ao painel admin
- `NEXTAUTH_SECRET`: Chave secreta para autenticação
- `NEXTAUTH_URL`: URL completa da sua aplicação
- `NEXT_PUBLIC_BASE_URL`: URL pública da sua aplicação

## 🧪 Testes

### Cartões de Teste (Ambiente de Desenvolvimento)

```
Mastercard: 5031 4332 1540 6351
CVV: 123
Data: 11/25

Visa: 4235 6477 2802 5682
CVV: 123
Data: 11/25
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Pedro Navarro - [GitHub](https://github.com/pedronavarrodev) 