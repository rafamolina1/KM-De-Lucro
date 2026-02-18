## KM de Lucro – Checklist do MVP

Este arquivo é só para você acompanhar o que falta até o MVP ficar redondinho para testar com motoristas.

### 1. Experiência dentro do app

- **Histórico mensal**
  - [x] Filtro de mês/ano na tela `/app`.
  - [x] Resumo do mês selecionado (fretes, faturamento, custos, lucro, margem).
  - [x] Destaque simples para mês atual vs anterior (ex.: setinhas ou porcentagem).

- **Melhorias de uso**
  - [x] Botão de **logout** no cabeçalho (`supabase.auth.signOut()` + redirect para `/`).
  - [x] Mostrar **plano atual** do usuário (Free/Pro) em algum canto da tela.
  - [x] Pequena mensagem de onboarding quando o usuário não tiver nenhum frete ainda (explicando passo 1, 2, 3).

### 2. Planos e monetização

- **Página de planos**
  - [x] Criar página `/planos` explicando:
    - Plano **Gratuito**: até 10 fretes.
    - Plano **Pro**: R$ 19,90/mês, fretes ilimitados.
  - [x] Mostrar **benefícios práticos** do Pro (menos planilha, visão clara de lucro, etc.).

- **PIX manual**
  - [x] Definir **chave PIX** fixa e instruções (ex.: mandar comprovante por WhatsApp).
  - [x] Mostrar instruções de pagamento e prazo de ativação manual (ex.: até 24h).

- **Upgrade de plano (admin simples)**
  - [x] Criar uma tela bem simples (protegida por um segredo/env) para:
    - Buscar usuário por e-mail.
    - Alterar `profiles.plan` de `free` para `pro`.

### 3. Ajustes de copy e foco estratégico

- **Landing page**
  - [x] Ajustar textos da home para reforçar:
    - Foco em **renda extra recorrente**.
    - Simplicidade (sem planilha, sem complicação).
    - Meta clara: 20 motoristas pagantes.

- **Mensagens dentro do app**
  - [x] Mensagem clara quando o motorista bater o limite de 10 fretes.
  - [x] Texto curto explicando por que vale a pena o Pro (sem vender demais, só o racional).

### 4. Deploy e testes

- **Deploy na Vercel**
  - [ ] Criar projeto na Vercel apontando para este repositório.
  - [ ] Configurar variáveis:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `NEXT_PUBLIC_SITE_URL` (URL da Vercel).
  - [ ] Fazer o primeiro deploy e testar login + cadastro de frete em produção.

- **Testes com motoristas reais**
  - [ ] Colher feedback de pelo menos **3–5 motoristas**:
    - Se entenderam como usar.
    - Se confiaram nos números de lucro/margem.
    - Se estariam dispostos a pagar R$ 19,90/mês.
  - [ ] Anotar objeções e ideias, mas **não adicionar novas features** antes de validar pagamento.

### 5. Revisões pós-deploy (depois de colocar em produção)

- **Admin**
  - [ ] Decidir se o link "Admin" deve aparecer também em produção (atualmente só aparece no localhost).
  - [ ] Testar o fluxo completo: receber PIX → acessar `/admin/planos` → ativar plano Pro → usuário conseguir lançar mais de 10 fretes.

- **Variáveis de ambiente na Vercel**
  - [ ] Confirmar que todas as variáveis estão configuradas:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `NEXT_PUBLIC_SITE_URL` (URL final da Vercel)
    - `SUPABASE_SERVICE_ROLE_KEY` (do Supabase → Settings → API → service_role)
    - `ADMIN_SECRET` (senha que você inventou)

- **Chave PIX na página de planos**
  - [ ] Substituir o placeholder `SEU_EMAIL_OU_CHAVE_AQUI@exemplo.com` pela sua chave PIX real na página `/planos`.

- **Testes em produção**
  - [ ] Testar login por link mágico funcionando na URL de produção.
  - [ ] Testar cadastro de frete e cálculo de lucro/margem.
  - [ ] Testar limite de 10 fretes no plano gratuito.
  - [ ] Testar ativação manual do plano Pro via admin.

