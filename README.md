# Controle-Dinococo-Kits

Aplicação web (React + Vite) para controle de estoque com persistência centralizada em Supabase. O deploy é pensado para Vercel usando funções serverless (endpoints em /api) que usam a SERVICE ROLE key do Supabase para operações administrativas.

Instalação local:
1. npm install
2. npm run dev

Build / Deploy (Vercel):
- Build command: `npm run build`
- Output directory: `dist`

Variáveis de ambiente necessárias no Vercel (Project > Settings > Environment Variables):
- SUPABASE_URL — URL do projeto Supabase (ex.: https://xyz.supabase.co)
- SUPABASE_SERVICE_ROLE_KEY — Service Role Key (privado, usado nas funções serverless)
- VITE_SUPABASE_ANON_KEY — (opcional) anon key para uso direto no client se necessário
- VITE_SUPABASE_URL — (opcional) mesma SUPABASE_URL para client

Banco Supabase (recomendado esquema):
- products table:
  - id: bigint (primary key, auto increment)
  - name: text
  - sku: text
  - stock: integer
  - price: numeric
  - inserted_at: timestamptz default now()

- movements table:
  - id: bigint (primary key, auto increment)
  - product_id: bigint (references products.id)
  - product_name: text
  - type: text (IN/OUT)
  - qty: integer
  - timestamp: timestamptz default now()
  - cpf_cliente: text
  - seller_name: text

Depois de criar o projeto Supabase, crie as tabelas acima (SQL no SQL editor) e configure as variáveis no Vercel.

Arquivos principais:
- /api - endpoints serverless que conversam com o Supabase (usam SERVICE_ROLE_KEY)
- /src - frontend React que consome /api endpoints

---
