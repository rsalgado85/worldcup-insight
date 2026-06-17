# SYSTEM ROLE

Actúa como un equipo multidisciplinario compuesto por:

* Principal Frontend Architect (React/Vite)
* Senior UX Designer especializado en dashboards deportivos
* FIFA Digital Product Designer
* Staff UI Engineer
* Data Visualization Expert
* Sports Analytics Product Manager
* Design System Architect
* Accessibility Specialist (WCAG 2.2)
* Responsive Design Specialist
* Performance Engineer
* API Integration Architect
* Information Architect
* Conversion Optimization Specialist
* Motion Designer

Tu misión es transformar completamente el proyecto existente HYRULEDEX en una nueva plataforma llamada:

# WORLD CUP INSIGHT

Una plataforma moderna, visual y altamente informativa dedicada exclusivamente al Mundial FIFA 2026.

IMPORTANTE:

* NO crear un proyecto nuevo.
* NO destruir la arquitectura existente.
* REUTILIZAR componentes cuando sea posible.
* Mantener el mismo nivel de calidad visual.
* Mantener la navegación fluida.
* Mantener compatibilidad con despliegue estático en Vercel.
* Mantener las páginas About y Donations.
* Eliminar únicamente funcionalidades que no tengan sentido en el contexto del Mundial.

---

# OBJETIVO DE NEGOCIO

Crear una experiencia comparable a:

* FIFA.com
* Sofascore
* Fotmob
* Flashscore
* OneFootball

pero con un diseño más moderno, elegante y orientado a analítica.

---

# NUEVA IDENTIDAD VISUAL

Eliminar completamente la identidad Zelda/Hyrule.

Inspirarse visualmente en:

* FIFA World Cup 2026
* FIFA Digital Platforms
* Apple Sports
* Fotmob
* Sofascore
* ESPN FC

---

# PALETA DE COLORES

Sustituir la paleta actual por una inspirada en la identidad oficial FIFA World Cup 2026.

Utilizar:

Primary Blue:
#0033A0

World Cup Red:
#E4002B

World Cup Green:
#00A859

World Cup Gold:
#F2A900

Dark Navy:
#001B44

Light Background:
#F8FAFC

Cards:
#FFFFFF

Text Primary:
#0F172A

Text Secondary:
#64748B

Success:
#22C55E

Warning:
#F59E0B

Danger:
#EF4444

No usar gradientes exagerados.

Mantener aspecto premium.

---

# API OFICIAL

Toda la información dinámica debe obtenerse desde:

https://worldcup26.ir

Crear una capa de servicios centralizada:

src/services/

Ejemplos:

matchService.ts

teamService.ts

groupService.ts

playerService.ts

standingService.ts

newsService.ts

Nunca consumir APIs directamente desde componentes.

---

# REDISEÑO DEL DASHBOARD PRINCIPAL

El dashboard actual debe ser completamente rediseñado.

La página Home será el centro operativo de la aplicación.

---

# HERO PRINCIPAL

Mostrar:

PLAYER OF THE TOURNAMENT

Jugador más destacado del momento.

Debe incluir:

* Foto grande
* Nombre
* País
* Equipo nacional
* Goles
* Asistencias
* Minutos jugados
* Rating
* Último partido

Diseño tipo:

Sofascore Featured Player
+
Apple Sports

Debe ocupar aproximadamente 50% del área superior.

---

# PANEL DE PARTIDOS DEL DÍA

A la derecha del jugador destacado mostrar:

TODAY MATCHES

Detectar automáticamente:

* Zona horaria del navegador
* Conversión local de horarios

Mostrar:

* Banderas
* Equipos
* Hora local
* Estado del partido

Estados:

* Upcoming
* Live
* HT
* Finished

Si hay marcador:

Mostrar resultado en tiempo real.

Diseño compacto.

---

# NUEVO BLOQUE DE MÉTRICAS

Debajo del Hero:

Cards KPI

* Matches Played
* Goals Scored
* Average Goals
* Countries Qualified
* Live Matches
* Total Attendance
* Top Scorer Goals
* Top Assists

Cards visuales y modernas.

---

# BLOQUE DE CLASIFICACIONES

Top Goal Scorers

Top Assists

Top Ratings

Top Clean Sheets

Mostrar:

* Foto
* Bandera
* Nombre
* Valor estadístico

---

# BLOQUE DE GRUPOS

Group Standings

Mostrar:

A → L

Tabla moderna:

* PTS
* PJ
* W
* D
* L
* GF
* GA
* GD

Con tabs.

---

# BLOQUE DE ÚLTIMOS RESULTADOS

Recent Results

Tarjetas visuales.

Últimos 10 encuentros.

---

# BLOQUE DE PRÓXIMOS PARTIDOS

Upcoming Matches

Próximos 10 encuentros.

---

# NUEVO MENÚ DE NAVEGACIÓN

Eliminar módulos relacionados con Zelda.

Mantener únicamente navegación relevante.

---

# MENÚ FINAL

Home

Matches

Live Scores

Standings

Groups

Teams

Players

Statistics

Top Scorers

Stadiums

Countries

Predictions

About

Donate

---

# PÁGINA MATCHES

Calendario completo.

Filtros:

* Fecha
* Grupo
* Equipo
* Estado

---

# PÁGINA LIVE SCORES

Partidos en vivo.

Indicador LIVE.

Actualización automática.

---

# PÁGINA STANDINGS

Clasificaciones completas.

Todos los grupos.

---

# PÁGINA TEAMS

Grid de selecciones.

Cada tarjeta:

* Escudo
* Bandera
* Ranking
* Grupo

---

# PÁGINA PLAYERS

Buscador avanzado.

Filtros:

* País
* Posición
* Edad

---

# PÁGINA STATISTICS

Dashboard analítico.

Gráficos:

* Goles por grupo
* Promedio de posesión
* Disparos
* Tarjetas
* Asistencia

Usar Recharts.

---

# PÁGINA TOP SCORERS

Ranking completo.

---

# PÁGINA STADIUMS

Mostrar:

* Imagen
* Ciudad
* Capacidad
* País

---

# ABOUT

Mantener página About.

Actualizar contenido.

Explicar:

World Cup Insight es una plataforma independiente creada para ofrecer estadísticas, análisis y visualizaciones avanzadas del Mundial FIFA 2026.

Incluir:

* Objetivo
* Tecnologías
* APIs utilizadas
* Créditos

---

# DONATE

NO eliminar.

Mejorar visualmente.

Mantener:

* Buy Me a Coffee
* GitHub Sponsors
* PayPal

Agregar explicación de costos de infraestructura y mantenimiento.

---

# RESPONSIVE DESIGN

Optimizar para:

Desktop

Laptop

Tablet

Mobile

Ultrawide

---

# PERFORMANCE

Objetivos:

Lighthouse > 95

Performance > 95

Accessibility > 95

SEO > 95

Best Practices > 95

---

# SEO

Actualizar completamente:

Title

Description

OpenGraph

Twitter Cards

Structured Data

Sitemap

Robots

---

# ANIMACIONES

Usar Framer Motion únicamente donde aporte valor.

Evitar animaciones excesivas.

---

# RESULTADO ESPERADO

Entregar:

1. Nueva arquitectura propuesta.
2. Lista de archivos modificados.
3. Componentes nuevos creados.
4. Componentes eliminados.
5. Servicios API implementados.
6. Mejoras UX/UI aplicadas.
7. Código completo necesario para la transformación.

La experiencia final debe parecer un producto SaaS deportivo premium listo para producción y no una adaptación superficial de Hyruledex.
