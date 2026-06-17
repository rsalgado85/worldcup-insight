# Player Modal — Click-to-Detail Implementation Plan

> **Para Hermes:** Implementar usando delegación paralela donde aplique.

**Goal:** Donde sea que aparezca el nombre de un jugador, al hacer click se abra un modal mostrando su avatar, bandera del equipo, y estadísticas del Mundial 2026.

**Architecture:** Componente `PlayerModal` global con estado en Zustand (`useAppStore`). Recibe `playerId`/`playerName`+`team`, busca stats desde la API (`usePlayers`) o constantes, y despliega avatar según país (francia→france-mbappe.jpg, argentina→argentina-messi.jpg, resto→bandera).

**Tech Stack:** React 19, TypeScript, TailwindCSS v4, Framer Motion (para animación del modal), Zustand (estado global).

---

## Files to create
- `src/components/modals/PlayerModal.tsx` — El modal
- `src/store/playerModalStore.ts` — Estado global del modal (o integrarlo en `useAppStore`)

## Files to modify
- `src/pages/HomePage.tsx` — Nombres clickeables: TrendingPlayerRow, featured card
- `src/pages/TopScorersPage.tsx` — Nombres clickeables: lista y podium
- `src/pages/PlayersPage.tsx` — Nombres clickeables
- `src/constants/index.ts` — Mapa de avatares por país (avatarByTeam)
- `src/types/worldcup.ts` — Extender Player con avatar si falta

---

### Task 1: Crear `PlayerModal` store en Zustand

**Objective:** Estado global para abrir/cerrar el modal con datos del jugador.

**Files:**
- Create: `src/store/playerModalStore.ts`

**Code:**

```typescript
import { create } from 'zustand';

export interface PlayerModalData {
  name: string;
  team: string;
  flag: string;
  avatar?: string;
  goals?: number;
  assists?: number;
  rating?: number;
  cleanSheets?: number;
}

interface PlayerModalState {
  isOpen: boolean;
  player: PlayerModalData | null;
  open: (player: PlayerModalData) => void;
  close: () => void;
}

export const usePlayerModalStore = create<PlayerModalState>((set) => ({
  isOpen: false,
  player: null,
  open: (player) => set({ isOpen: true, player }),
  close: () => set({ isOpen: false, player: null }),
}));
```

**Verification:** TypeScript compila sin errores con `tsc -b`.

---

### Task 2: Crear `PlayerModal` component

**Objective:** Componente visual del modal con avatar, stats y animación.

**Files:**
- Create: `src/components/modals/PlayerModal.tsx`

**Code:** (completo)

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X, Goal, Zap, Star, Shield } from 'lucide-react';
import { usePlayerModalStore } from '@/store/playerModalStore';
import { FlagImage } from '@/components/common/FlagImage';

export function PlayerModal() {
  const { isOpen, player, close } = usePlayerModalStore();

  return (
    <AnimatePresence>
      {isOpen && player && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>

            {/* Avatar background */}
            {player.avatar && (
              <div className="absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden">
                <img
                  src={player.avatar}
                  alt=""
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-[130%] w-auto max-w-none object-cover opacity-30"
                  style={{
                    maskImage: 'linear-gradient(to left, black 20%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to left, black 20%, transparent 100%)',
                  }}
                />
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 p-6">
              {/* Flag + Team */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center overflow-hidden">
                  <FlagImage flag={player.flag} size="md" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{player.name}</h2>
                  <p className="text-sm text-white/60">{player.team}</p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {player.goals !== undefined && (
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Goal size={14} className="text-live" />
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">Goals</span>
                    </div>
                    <p className="text-2xl font-black text-white">{player.goals}</p>
                  </div>
                )}
                {player.assists !== undefined && (
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap size={14} className="text-warm" />
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">Assists</span>
                    </div>
                    <p className="text-2xl font-black text-white">{player.assists}</p>
                  </div>
                )}
                {player.rating !== undefined && (
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Star size={14} className="text-warm" />
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">Rating</span>
                    </div>
                    <p className="text-2xl font-black text-white">{player.rating}</p>
                  </div>
                )}
                {player.cleanSheets !== undefined && (
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Shield size={14} className="text-success" />
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">Clean Sheets</span>
                    </div>
                    <p className="text-2xl font-black text-white">{player.cleanSheets}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Verification:** `npm run build` — 0 errores.

---

### Task 3: Montar `PlayerModal` en `App.tsx`

**Objective:** El modal debe estar disponible globalmente en la app.

**Files:**
- Modify: `src/App.tsx` (o el entry point donde se montan layouts)

**Step 1:** Importar y renderizar `<PlayerModal />` al nivel raíz de la app (fuera de rutas).

**Verification:** El modal no se ve hasta que se abra. Build OK.

---

### Task 4: Crear mapa `AVATAR_BY_TEAM` y helper `getPlayerAvatar`

**Objective:** Determinar qué avatar usar según el país del jugador.

**Files:**
- Modify: `src/constants/index.ts`

**Code a agregar:**

```typescript
export const AVATAR_BY_TEAM: Record<string, string> = {
  France: '/images/players/france-mbappe.jpg',
  Argentina: '/images/players/argentina-messi.jpg',
};

export function getPlayerAvatar(team: string): string | undefined {
  return AVATAR_BY_TEAM[team];
}
```

**Verification:** `tsc -b` compila.

---

### Task 5: Hacer clickeables los nombres en HomePage

**Objective:** Al hacer click en un nombre de jugador, abrir el modal.

**Files:**
- Modify: `src/pages/HomePage.tsx`

**Changes:**

1. `TrendingPlayerRow` (línea 34): El nombre debe ser un botón/span clickeable.

```tsx
// Antes:
<p className="text-xs font-bold text-text truncate">{player.name}</p>

// Después:
<button
  onClick={() => usePlayerModalStore.getState().open({
    name: player.name,
    team: player.team,
    flag: player.flag,
    avatar: getPlayerAvatar(player.team),
    goals: player.goals,
    assists: player.assists,
    rating: player.rating,
    cleanSheets: player.cleanSheets,
  })}
  className="text-xs font-bold text-text truncate text-left hover:text-primary-light transition-colors cursor-pointer"
>
  {player.name}
</button>
```

2. Importar `getPlayerAvatar` y `usePlayerModalStore`.

3. Featured player card name (línea 141): también hacerlo clickeable con los datos de `featured`.

**Verification:** Click en nombre → modal se abre con stats.

---

### Task 6: Hacer clickeables los nombres en TopScorersPage

**Objective:** Click en nombres de la lista y podium abre el modal.

**Files:**
- Modify: `src/pages/TopScorersPage.tsx`

**Changes:**

1. Lista (línea 34): Convertir `player.name` en botón.
2. Podium (línea 187): Convertir `p.name` en botón.
3. Importar `usePlayerModalStore` y `getPlayerAvatar`.

```tsx
// Lista:
<button
  onClick={() => usePlayerModalStore.getState().open({
    name: player.name,
    team: player.team,
    flag: player.flag,
    avatar: getPlayerAvatar(player.team),
    goals: player.goals,
    assists: player.assists,
    rating: player.rating,
    cleanSheets: (player as any).cleanSheets,
  })}
  className="text-sm font-bold text-text truncate text-left hover:text-primary-light transition-colors cursor-pointer"
>
  {player.name}
</button>
```

**Verification:** Click en nombre en TopScorers → modal con stats.

---

### Task 7: Hacer clickeables los nombres en PlayersPage

**Objective:** Click en nombre de la grilla de jugadores abre modal.

**Files:**
- Modify: `src/pages/PlayersPage.tsx`

**Changes:**

1. Línea 130: Convertir `player.name` en botón clickeable con los mismos datos.
2. Importar `usePlayerModalStore` y `getPlayerAvatar`.

**Verification:** Modal se abre desde la página de Players.

---

### Task 8: Build + Deploy

**Objective:** Verificar que todo compila y deployar.

**Commands:**
```bash
cd /Users/appleuser/Documents/Proyectos/worldcup-insight-v2
npm run build
npx vercel deploy --prod --yes
```

**Expected:** Build 0 errores. Deploy ~20s. Modal funcional en todas las páginas.

---

## Verification Checklist
- [ ] Click en Mbappé (HomePage card) → modal con avatar Francia, 8 goles, 2 asistencias, 9.2 rating
- [ ] Click en Messi (rankings HomePage) → modal con avatar Argentina, 7 goles, 3 asistencias, 9.1 rating
- [ ] Click en Haaland → modal con bandera Noruega (sin avatar), 9 goles
- [ ] Click en TopScorersPage lista → modal funcional
- [ ] Click en TopScorersPage podium → modal funcional
- [ ] Click en PlayersPage → modal funcional
- [ ] Cerrar modal con X o click fuera → se cierra
- [ ] Animación de entrada/salida suave
