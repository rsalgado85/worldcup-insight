# World Cup Insight v2 — FIFA World Cup 2026 Analytics

> Plataforma moderna de estadísticas, análisis y visualizaciones para el Mundial FIFA 2026. Construida con React 19, TypeScript, Vite y Tailwind CSS v4.

🔗 **[worldcup-eight-topaz.vercel.app](https://worldcup-eight-topaz.vercel.app)**

## ✨ Características

| Sección | Descripción |
|---|---|
| **Dashboard** | Panel principal con KPIs, jugador destacado, últimos resultados |
| **Matches** | Calendario completo con filtros por fecha, grupo, equipo y estado |
| **Live Scores** | Partidos en vivo con actualización automática |
| **Standings** | Tablas de clasificación por grupos (A–L) |
| **Groups** | Vista detallada de cada grupo con estadísticas |
| **Teams** | Grid de selecciones con escudos, banderas y rankings |
| **Players** | Buscador avanzado con filtros por país, posición y edad |
| **Statistics** | Dashboard analítico con gráficos Recharts |
| **Top Scorers** | Ranking completo de goleadores y asistencias |
| **Stadiums** | Sedes con imágenes, capacidad y ubicación |
| **Countries** | Información de países participantes |
| **Predictions** | Predicciones y simulaciones |
| **About** | Información del proyecto y stack tecnológico |
| **Donate** | Apoyo al proyecto vía PayPal y Buy Me a Coffee |

## 🎨 Diseño

- **Light + Dark mode** con toggle persistente
- **Bilingüe** (ES/EN) con selector de idioma
- **Responsive**: desktop, tablet, mobile con bottom nav
- **Sidebar colapsable** con animaciones Framer Motion
- **Paleta**: French Blue, Steel Blue, Baltic Blue, Vintage Grape, Sand

## 🛠 Stack

- **Frontend**: React 19, TypeScript, Vite 8
- **Estilos**: Tailwind CSS v4 con temas CSS custom properties
- **Estado**: Zustand con persistencia
- **Routing**: React Router v7 con lazy loading
- **Datos**: React Query (TanStack Query v5)
- **Gráficos**: Recharts, Chart.js
- **Animaciones**: Framer Motion
- **Íconos**: Lucide React
- **API**: worldcup26.ir

## 📂 Estructura

```
src/
├── components/    # UI components (Sidebar, charts, cards)
├── constants/     # Colores, rutas, traducciones, datos estáticos
├── hooks/         # Custom hooks (useMatches, useTeams, useGroups, etc.)
├── layouts/       # MainLayout con sidebar + mobile nav
├── pages/         # 14 páginas (lazy-loaded)
├── routes/        # React Router config
├── services/      # API clients (match, team, group, player, stadium)
├── store/         # Zustand (tema, idioma, favoritos, sidebar)
├── styles/        # CSS con temas light/dark
└── types/         # TypeScript interfaces (World Cup)
```

## 🚀 Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Build de producción
```

## 📦 Deploy

```bash
npx vercel --prod --yes
```

Producción: **[worldcup-eight-topaz.vercel.app](https://worldcup-eight-topaz.vercel.app)**

---

Creado por [Robinson Salgado](https://github.com/rsalgado85) • [LinkedIn](https://linkedin.com/in/robinsonsalgado)
