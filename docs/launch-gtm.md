# Launch / GTM — checklist enxuto

Escopo reduzido pra lançar rápido: tier grátis (guarda fechada) já usável + checkout de compra
única (Mercado Pago link) + shareability/SEO + deploy. Cortado até pós-launch: progresso (E5),
drills fora-do-mapa (E6), preview de vídeo (E7), entitlement/gating automático.

## ✅ Já no código (este pass)

- **Metadata + OG**: `openGraph`/`twitter` + `metadataBase` em `src/app/layout.tsx`.
- **OG image dinâmica**: `src/app/opengraph-image.tsx` (next/og) — preview no WhatsApp/IG/Twitter.
- **SEO**: `src/app/sitemap.ts` (rotas públicas + posições publicadas) + `src/app/robots.ts`.
- **Checkout**: botões de `/precos` apontam pros links de pagamento via env
  (`NEXT_PUBLIC_MP_LINK_ATLAS`, `NEXT_PUBLIC_MP_LINK_TRILHA`). Sem env → "Em breve" (seguro).

## Passos manuais (você)

### 1. Mercado Pago — links de pagamento
1. Conta em mercadopago.com.br → **Seu negócio → Link de pagamento**.
2. Criar 2 links de compra única:
   - "Atlas Completo" R$ 19
   - "Trilha avulsa" R$ 12
3. Copiar as URLs pros envs `NEXT_PUBLIC_MP_LINK_ATLAS` / `NEXT_PUBLIC_MP_LINK_TRILHA`.

> Fulfillment: o link de pagamento NÃO destrava conteúdo automaticamente (não há gating/auth
> ainda — `acesso: "paid"` hoje é só visual). Pós-compra, entregue acesso manual/por email.
> **Upgrade futuro**: SDK `mercadopago` + API route `/api/checkout` + webhook + entitlement
> por email/magic-link. Documentado como Fase pós-launch.

### 2. Deploy — Vercel
1. `vercel` (ou conectar o repo git no painel Vercel). Framework detectado: Next.js.
2. Setar env no projeto Vercel: `NEXT_PUBLIC_SITE_URL=https://<dominio>`, e os 2 links MP.
3. Apontar domínio. Pronto — SSG já gera as 310 páginas no build.

### 3. Pós-deploy
- Submeter `https://<dominio>/sitemap.xml` no Google Search Console.
- Testar preview do link (WhatsApp/IG) — deve puxar a OG image.
- (Quando quiser medir ativação) plugar analytics — pulado por ora.

## Verificação local

```bash
pnpm test      # 149 testes
pnpm build     # 310 páginas, OG/sitemap/robots gerados
pnpm dev       # conferir /precos (botões), /mapa (trilha+legenda+onboarding)
```
