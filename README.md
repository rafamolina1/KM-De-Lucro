# 🚚 KM de Lucro - Gestão Financeira para Motoristas

O **KM de Lucro** é uma plataforma web de gestão financeira simplificada, desenvolvida especificamente para motoristas de carga autônomos. O projeto nasceu com o objetivo de substituir planilhas complexas e anotações manuais por uma interface intuitiva e focada em performance, permitindo que o motorista entenda a saúde financeira de sua operação em tempo real.

![Home do Projeto](/public/screenshots/homepage.png)

## ✨ Proposta de Valor
A aplicação resolve o problema da "conta de cabeça", automatizando o cálculo de rentabilidade. Ao inserir os dados básicos de um frete e seus respectivos custos, o sistema entrega instantaneamente o lucro líquido e a margem de lucro percentual.

![Dashboard do Projeto](/public/screenshots/dashboard.png)

## 🛠️ Funcionalidades Principais
*   **Calculadora de Rentabilidade**: Processamento imediato de margem e lucro por viagem.
*   **Gestão de Fluxo Mensal**: Histórico organizado por mês e ano, permitindo comparar o desempenho financeiro entre períodos.
*   **Business Intelligence para Motoristas**: Identificação de quais rotas e tipos de frete são mais lucrativos através de resumos financeiros detalhados.
*   **Exportação de Dados**: Geração de relatórios profissionais em PDF e CSV para controle externo ou contabilidade.
*   **Acesso Sem Senha**: Autenticação via Magic Link (Supabase Auth), priorizando a segurança e facilidade de acesso.

## 🚀 Tecnologias Utilizadas
*   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
*   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
*   **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
*   **Banco de Dados & Autenticação**: [Supabase](https://supabase.com/)
*   **Relatórios**: [jsPDF](https://github.com/parallax/jsPDF)

## 📦 Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/truck.git
   cd truck
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes chaves:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=seu_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
   ADMIN_SECRET=sua_senha_de_admin
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 🌐 Deploy
O projeto está configurado para deploy contínuo na **Vercel**. Ao conectar seu repositório GitHub, a Vercel identificará automaticamente as configurações e fará o deploy. Não esqueça de configurar as variáveis de ambiente no painel da Vercel.

---
Desenvolvido para facilitar a vida de quem vive na estrada. 🛣️💨
