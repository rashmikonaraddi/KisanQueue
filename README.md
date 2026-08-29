# KisanQueue (JavaScript)

Plain JavaScript + React 19 + Vite version of the KisanQueue SIH26032 prototype.
No TypeScript — all files are `.js` / `.jsx`.

## Run
```bash
npm install
npm run dev      # http://localhost:8080
npm run build
```

## Demo credentials
- Farmer: 9999999999 / OTP 123456
- Operator: operator / demo123
- Admin: admin / demo123

## Structure
- `index.html`, `src/main.jsx` — app entry (React DOM + TanStack Router)
- `src/routes/` — file-based routes (landing, login, register, farmer/*, operator/*, admin/*)
- `src/components/ui/` — shadcn UI primitives; `src/components/kisan/` — app components
- `src/lib/kisan/` — demo data, state store, prediction engine, i18n, assistant
- `src/styles.css` — Tailwind v4 theme tokens

Prototype for Smart India Hackathon 2026 — SIH26032. Not an official Government of India portal.
