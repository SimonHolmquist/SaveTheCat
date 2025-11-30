# SaveTheCat

## Overview (English)
SaveTheCat is a storytelling workspace that helps authors break down a script or novel using the “Save the Cat!” beat sheet while organizing the characters, locations, and sticky-note scenes that belong to each project. Every project owns a beat sheet, a draggable board of scene notes, and reference lists for characters and places so writers can keep structure and creative details in one place.

### Features
- **Project-based workspace** with one-to-one beat sheets plus related sticky notes, characters, and locations managed together per user project. 【F:SaveTheCat.Backend/SaveTheCat.Domain/Entities/Project.cs†L5-L21】【F:SaveTheCat.Backend/SaveTheCat.Domain/Entities/BeatSheet.cs†L3-L29】【F:SaveTheCat.Backend/SaveTheCat.Domain/Entities/StickyNote.cs†L3-L18】
- **Complete Save-the-Cat beat sheet** fields for key moments such as Opening Image, Catalyst, Midpoint, Finale, and more, ready to store and render in the UI. 【F:SaveTheCat.Backend/SaveTheCat.Domain/Entities/BeatSheet.cs†L3-L24】【F:SaveTheCat.Frontend/src/types/beatSheet.ts†L1-L25】
- **Visual sticky-note board** with positions, colors, conflicts, and emotional charge tags to map scenes spatially and link them to beat items. 【F:SaveTheCat.Backend/SaveTheCat.Domain/Entities/StickyNote.cs†L6-L18】【F:SaveTheCat.Frontend/src/types/note.ts†L1-L15】
- **Character and location catalogs** tied to each project to keep references handy while outlining. 【F:SaveTheCat.Frontend/src/types/entities.ts†L1-L8】
- **Authentication-ready backend** using ASP.NET Core 8, Identity, JWT bearer tokens, and Swagger-secured APIs, plus email service configuration. 【F:SaveTheCat.Backend/SaveTheCat.Api/Program.cs†L1-L169】
- **React + TypeScript frontend** bootstrapped with Vite and i18next for localization, consuming the API through a configurable base URL. 【F:SaveTheCat.Frontend/package.json†L1-L34】【F:SaveTheCat.Frontend/src/api/apiClient.ts†L3-L41】

### Tech stack
- **Backend:** ASP.NET Core 8, Entity Framework Core with SQL Server provider, MediatR, AutoMapper, FluentValidation, Identity + JWT, Swagger. 【F:SaveTheCat.Backend/SaveTheCat.Api/Program.cs†L1-L169】
- **Frontend:** React 19, TypeScript, Vite, Axios, React Router, i18next. 【F:SaveTheCat.Frontend/package.json†L1-L34】
- **Data storage:** SQL Server connection configurable via `DefaultConnection`. 【F:SaveTheCat.Backend/SaveTheCat.Api/appsettings.json†L9-L21】

### Project structure
- `SaveTheCat.Backend/` — .NET solution with API, Domain, Application, and Infrastructure projects (EF Core DbContext, migrations, services). 【F:SaveTheCat.Backend/SaveTheCat.Api/Program.cs†L63-L169】
- `SaveTheCat.Frontend/` — React client with components for the beat sheet, sticky board, authentication pages, and shared hooks/context. 【F:SaveTheCat.Frontend/package.json†L1-L34】【F:SaveTheCat.Frontend/src/App.tsx†L1-L120】

### Prerequisites
- .NET 8 SDK.
- Node.js 20+ (recommended for Vite/React tooling) and npm.
- SQL Server instance and a valid connection string.

### Backend setup
1. Update `SaveTheCat.Backend/SaveTheCat.Api/appsettings.json` with your SQL Server `DefaultConnection`, JWT key/issuer/audience, and allowed CORS origins. 【F:SaveTheCat.Backend/SaveTheCat.Api/appsettings.json†L9-L21】
2. Restore dependencies and run migrations (automatic on startup):
   ```bash
   cd SaveTheCat.Backend
   dotnet restore
   dotnet run --project SaveTheCat.Api
   ```
   The API applies pending EF Core migrations on launch and exposes Swagger in development. 【F:SaveTheCat.Backend/SaveTheCat.Api/Program.cs†L63-L169】

### Frontend setup
1. Configure the API base URL via `VITE_API_URL` (defaults to `http://localhost:5079/api`). 【F:SaveTheCat.Frontend/src/api/apiClient.ts†L3-L41】
2. Install dependencies and start the dev server:
   ```bash
   cd SaveTheCat.Frontend
   npm install
   npm run dev
   ```
3. Optional quality checks: `npm run lint` and `npm run build` for production assets. 【F:SaveTheCat.Frontend/package.json†L6-L34】

### Testing & health
- The backend exposes `/health` for a quick status check once running. 【F:SaveTheCat.Backend/SaveTheCat.Api/Program.cs†L138-L143】
- Run frontend lint/build scripts or add API/integration tests as needed to validate workflows.

## Visión general (Español)
SaveTheCat es un espacio de trabajo narrativo que ayuda a desglosar un guion o novela con la hoja de beats de “Save the Cat!”, mientras organiza personajes, locaciones y escenas en notas adhesivas dentro de cada proyecto. Cada proyecto posee su propia hoja de beats, un tablero de notas arrastrables y listas de referencia para personajes y lugares, manteniendo la estructura y los detalles creativos juntos.

### Características
- **Espacios por proyecto** con hoja de beats uno a uno más notas adhesivas, personajes y locaciones vinculados al proyecto del usuario. 【F:SaveTheCat.Backend/SaveTheCat.Domain/Entities/Project.cs†L5-L21】【F:SaveTheCat.Backend/SaveTheCat.Domain/Entities/BeatSheet.cs†L3-L29】【F:SaveTheCat.Backend/SaveTheCat.Domain/Entities/StickyNote.cs†L3-L18】
- **Hoja de beats completa** con campos para Opening Image, Catalyst, Midpoint, Finale y otros hitos listos para almacenarse y mostrarse en la interfaz. 【F:SaveTheCat.Backend/SaveTheCat.Domain/Entities/BeatSheet.cs†L3-L24】【F:SaveTheCat.Frontend/src/types/beatSheet.ts†L1-L25】
- **Tablero visual de notas** con posiciones, colores, conflictos y etiquetas de carga emocional para mapear escenas y enlazarlas con los beats. 【F:SaveTheCat.Backend/SaveTheCat.Domain/Entities/StickyNote.cs†L6-L18】【F:SaveTheCat.Frontend/src/types/note.ts†L1-L15】
- **Catálogo de personajes y locaciones** asociado a cada proyecto para consultar referencias mientras se outlinea. 【F:SaveTheCat.Frontend/src/types/entities.ts†L1-L8】
- **Backend listo para autenticación** con ASP.NET Core 8, Identity, tokens JWT y APIs protegidas por Swagger, además de configuración de correo. 【F:SaveTheCat.Backend/SaveTheCat.Api/Program.cs†L1-L169】
- **Frontend en React + TypeScript** montado con Vite e i18next para localización, consumiendo la API mediante una URL base configurable. 【F:SaveTheCat.Frontend/package.json†L1-L34】【F:SaveTheCat.Frontend/src/api/apiClient.ts†L3-L41】

### Pila tecnológica
- **Backend:** ASP.NET Core 8, Entity Framework Core con SQL Server, MediatR, AutoMapper, FluentValidation, Identity + JWT, Swagger. 【F:SaveTheCat.Backend/SaveTheCat.Api/Program.cs†L1-L169】
- **Frontend:** React 19, TypeScript, Vite, Axios, React Router, i18next. 【F:SaveTheCat.Frontend/package.json†L1-L34】
- **Almacenamiento:** SQL Server configurable en `DefaultConnection`. 【F:SaveTheCat.Backend/SaveTheCat.Api/appsettings.json†L9-L21】

### Estructura del proyecto
- `SaveTheCat.Backend/` — Solución .NET con proyectos de API, Dominio, Aplicación e Infraestructura (DbContext de EF Core, migraciones, servicios). 【F:SaveTheCat.Backend/SaveTheCat.Api/Program.cs†L63-L169】
- `SaveTheCat.Frontend/` — Cliente React con componentes para la hoja de beats, tablero de notas, páginas de autenticación y hooks/contextos compartidos. 【F:SaveTheCat.Frontend/package.json†L1-L34】【F:SaveTheCat.Frontend/src/App.tsx†L1-L120】

### Requisitos previos
- SDK de .NET 8.
- Node.js 20+ y npm.
- Instancia de SQL Server y cadena de conexión válida.

### Configuración del backend
1. Actualiza `SaveTheCat.Backend/SaveTheCat.Api/appsettings.json` con tu `DefaultConnection`, claves JWT y orígenes CORS permitidos. 【F:SaveTheCat.Backend/SaveTheCat.Api/appsettings.json†L9-L21】
2. Restaura dependencias y ejecuta el proyecto (las migraciones se aplican al iniciar):
   ```bash
   cd SaveTheCat.Backend
   dotnet restore
   dotnet run --project SaveTheCat.Api
   ```
   La API aplica migraciones pendientes al arrancar y expone Swagger en desarrollo. 【F:SaveTheCat.Backend/SaveTheCat.Api/Program.cs†L63-L169】

### Configuración del frontend
1. Define la URL base de la API con `VITE_API_URL` (por defecto `http://localhost:5079/api`). 【F:SaveTheCat.Frontend/src/api/apiClient.ts†L3-L41】
2. Instala dependencias e inicia el servidor de desarrollo:
   ```bash
   cd SaveTheCat.Frontend
   npm install
   npm run dev
   ```
3. Validaciones opcionales: `npm run lint` y `npm run build` para generar artefactos de producción. 【F:SaveTheCat.Frontend/package.json†L6-L34】

### Pruebas y salud
- El backend expone `/health` para comprobar el estado una vez que está en ejecución. 【F:SaveTheCat.Backend/SaveTheCat.Api/Program.cs†L138-L143】
- Ejecuta los scripts de lint/build del frontend o agrega pruebas de API/integración según necesites.
