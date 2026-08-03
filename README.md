# SIDocumentación

Reimplementación en **Angular 22 + NestJS 11** del sistema de documentación
construido originalmente en Laravel (`Herd/documentacion`).

Reutiliza las mismas bases de datos MySQL que el sistema original, de modo que
ambos pueden convivir durante la migración.

---

## Arquitectura

```
SIDocumentacion/
├── src/                 Frontend Angular 22 (standalone + signals)
│   ├── app/core/        Servicios HTTP, guards, interceptores y modelos
│   ├── app/layout/      Shell: sidebar, topbar y estructura general
│   ├── app/shared/      Componentes reutilizables (avisos, paginador, estados)
│   ├── app/features/    Pantallas por módulo
│   └── styles.scss      Sistema de diseño institucional sobre Bootstrap 5
└── backend/             API NestJS 11 (TypeORM + JWT)
    └── src/
        ├── auth/        Autenticación contra users_safs y roles de Spatie
        ├── menu/        Menú filtrado por rol y RFC
        ├── oficios/     registro_docs + atencion_docs
        ├── solicitudes/ registro + registro_atencions
        ├── catalogos/   Series, subseries, secciones y padrón institucional
        └── agenda/      Fechas límite de atención
```

### Conexiones a base de datos

Se replica el esquema de conexiones de Laravel:

| Conexión Laravel | Conexión NestJS | Contenido                                          |
| ---------------- | --------------- | -------------------------------------------------- |
| `mysql`          | por defecto     | Documentos, solicitudes, catálogos archivísticos    |
| `mysqlSaf`       | `saf`           | Usuarios, servidores públicos, dependencias, áreas  |

> `synchronize` está **desactivado**: el esquema lo siguen administrando las
> migraciones de Laravel. TypeORM solo lee y escribe sobre las tablas existentes.

### Particularidades del esquema

La base real no sigue una convención uniforme. Las entidades ya reflejan esto,
pero conviene tenerlo presente al agregar consultas:

| Tema | Detalle |
| --- | --- |
| Nombre del catálogo | `secciones.seccion`, `series.serie`, `sub_series.subserie`, `subfondo.subfondo`, `tipo_docs.tipo_doc` — ninguna usa `nombre`. |
| Área del catálogo | `series`/`secciones` usan `departamento_id`; `sub_series` usa `id_Departamento`. |
| Turnos de solicitudes | `registro_atencions` usa camelCase (`statusAtencion`, `tipoAtencion`, `fechaCierre`) y baja lógica con `activo`. La instrucción es `indicaciones_turno`. |
| Turnos de oficios | `atencion_docs` sí usa snake_case (`status_atencion`, `fecha_visto`, `fecha_atencion`). |
| `registro.status_envio` | `0` preregistro (espera autorización) · `2` espera visto bueno · `4` liberado. Las bandejas de entrada muestran solo el `4`. |
| Papel en un oficio | `atencion_docs.tipo_atencion` guarda `E` (elaboró), `R` (revisó) o `A` (autorizó); `registro_docs` puede acumularlos (`"E,R"`). No es "atención/conocimiento". |
| Roles de Spatie | `model_has_roles.model_type` vale `App\Models\UsersSaf`, no `App\Models\User`. |

---

## Puesta en marcha

### 1. Backend

```bash
cd backend
cp .env.example .env      # captura aquí las credenciales reales de MySQL
npm install
npm run start:dev         # http://localhost:3050/api
```

Variables obligatorias en `.env`:

- `PORT` — debe coincidir con el puerto publicado en `docker-compose.yml` (3050).
- `DB_*` — base de datos de documentación (equivale a la conexión `mysql`).
- `DB_SAF_*` — base institucional SAF (equivale a `mysqlSaf`).
- `JWT_SECRET` — **cámbiala en producción**.

> **Con Docker:** `docker compose restart` **no** vuelve a leer `env_file`. Tras
> editar `backend/.env` hay que recrear el contenedor:
> `docker compose up -d --force-recreate backend`.

### 2. Frontend

```bash
npm install
npm start                 # http://localhost:4200
```

La URL de la API se configura en `src/environments/environment.ts`
(desarrollo) y `environment.prod.ts` (producción).

---

## Autenticación

- Inicio de sesión con **RFC o correo electrónico** contra `users_safs`.
- Las contraseñas conservan el formato `bcrypt` de Laravel (`$2y$`), por lo que
  las credenciales existentes siguen funcionando sin migración.
- Tras `MAX_INTENTOS_LOGIN` intentos fallidos la cuenta se bloquea, igual que en
  el sistema original.
- Los roles se leen de `model_has_roles` / `roles` (spatie/laravel-permission) y
  se muestran en el perfil, pero **no restringen nada**: ver más abajo.
- La sesión viaja en un **JWT**; toda la API lo exige salvo `POST /api/auth/login`.

### Sobre los roles

El sistema Laravel **no valida roles en ningún punto**: no hay `hasRole`, ni
middleware `role:`, ni `can()` en controladores o vistas. Los nombres que
aparecen en `verticalMenu.json` ("SUPER USUARIO", "ANALISTA", "AUTORIZAR") son
código muerto —el filtro correspondiente está comentado en
`panels/sidebar.blade.php`— y ni siquiera existen en la tabla `roles`, que
contiene `ADMIM`, `RAC`, `RAH` y `RAT`.

Por eso esta reimplementación tampoco restringe rutas por rol: basta con la
sesión activa. La infraestructura (`@Roles`, `RolesGuard`) queda disponible por
si más adelante se decide aplicar permisos de verdad.

---

## Firma electrónica (FEPLEM)

`backend/src/firma/` habla con el servicio institucional. El contrato está
aislado en `feplem.client.ts`:

| Endpoint | Respuesta |
| --- | --- |
| `POST /api/validaCertificados` `{ rfc, password }` | `0` si la contraseña es incorrecta o el certificado venció; el **hash de firma** en caso contrario. |
| `POST /api/firmaDocumentos` `{ path, user_rfc, contra, docI, tipo, … }` | `1` cuando el documento quedó firmado. |

Ambas devuelven **texto plano**, no JSON. La URL se configura con `FEPLEM_URL`.

Puntos importantes:

- La contraseña de la FIEL **nunca se almacena ni se escribe en la bitácora**;
  solo viaja en el cuerpo de la petición.
- Los intentos fallidos comparten el contador del login: a los tres, la cuenta
  se bloquea (`users_safs.bloqueo`), igual que en el sistema original.
- Antes de contactar a FEPLEM se verifica propiedad del documento, que no esté
  ya firmado y que tenga archivo almacenado.
- `firma` va fijo en `8` y `tipo` distingue `documentacion/oficios` de
  `documentacion`, replicando `RegistroDocumentosController`.

> **Advertencia:** firmar es irreversible y actúa sobre el servicio de
> producción. Las validaciones previas se probaron sin contactar a FEPLEM; la
> firma real debe probarla una persona con su propia FIEL.

---

## Navegación

El menú lateral lo entrega el backend (`GET /api/menu`) ya filtrado por **RFC**,
replicando la única regla vigente del `sidebar.blade.php` original. Su
definición vive en `backend/src/menu/menu.data.ts`, portada desde
`resources/json/verticalMenu.json`.

Esto evita duplicar las reglas de visibilidad en el cliente: agregar una opción
al menú se hace en un solo archivo.

---

## Sistema de diseño

`src/styles.scss` configura Bootstrap 5.3 mediante `@use ... with ()`:

- **Paleta**: guinda institucional como color primario y dorado como acento.
- **Tipografía**: pila del sistema, sin dependencias remotas.
- **Tokens** (`--sid-*`): el resto de la interfaz consume variables CSS, así que
  un cambio de identidad institucional se resuelve editando ese único bloque.
- **Accesibilidad**: foco visible, estados que combinan color e icono (nunca solo
  color) y etiquetas para lectores de pantalla.
- **Responsivo**: el sidebar se contrae a iconos en escritorio y se convierte en
  panel deslizante por debajo de 992 px; las tablas anchas se desplazan dentro de
  su contenedor, nunca la página.

---

## Estado de la migración

### Implementado

- Autenticación, sesión, roles y cambio de contraseña.
- Menú dinámico filtrado por rol y RFC.
- **Oficios**: bandeja de entrada, bandeja de salida, alta con destinatarios,
  detalle con trazabilidad, acuse de vista y cierre de atención.
- **Solicitudes**: alta con turnos, preregistro (autorizar/rechazar), bandejas de
  entrada y salida, atendidos de entrada y salida, consulta de folios, detalle
  con trazabilidad de turnos.
- **Firma electrónica**: integración con el servicio institucional FEPLEM
  (`validaCertificados` + `firmaDocumentos`). Ver detalle abajo.
- **Agenda**: calendario mensual de fechas límite.
- **Catálogos**: secciones, series, subseries, subfondos, tipos de documento y de
  atención, y buscador del padrón institucional.
- Tablero de inicio con indicadores y pendientes.

### Pendiente

Estos módulos existen en el sistema Laravel y **aún no se han portado**:

- **Sellado visual del PDF al firmar**: el sistema original estampa el bloque de
  firma, el hash y el código QR sobre el PDF (FPDI + QrCode) antes de enviarlo a
  FEPLEM. Aquí se solicita la firma sobre el archivo ya almacenado, sin
  regenerar el PDF; depende de la carga de archivos.
- **Carga y descarga de archivos** (PDF, acuses, XML): las entidades ya
  contemplan `path`/`uuid`, falta el almacenamiento y los endpoints de descarga.
  Por eso solo pueden firmarse documentos que ya tengan archivo en el
  almacenamiento compartido.
- **Generación de PDF y códigos QR** (`QrController`, sellos en documentos).
- **Reportes y exportación a Excel** (`ReportesController`).
- **Administración archivística**: alta y edición de secciones, series,
  subseries, subfondos, disposición documental, expedientes concluidos,
  inventarios y responsables de archivo (hoy solo se consultan como catálogos).
- **Solicitudes de información, grupos, comentarios y respuestas**
  (`SolicitudInfoController`, `GroupController`, `BusquedasController`).
- **Notificaciones por correo** al turnar un documento.

---

## Verificación

```bash
cd backend && npm run build   # compila sin errores
npm run build                 # compila sin errores ni advertencias
```

Verificado contra la base de datos real (usuario `SAGM990220`): login, perfil,
menú, resúmenes, ambas bandejas de oficios y de solicitudes, preregistro,
folios, agenda, los nueve catálogos y las dos pantallas de detalle responden
`200` con datos consistentes.

Prueba rápida de humo:

```bash
TOKEN=$(curl -s -X POST http://localhost:3050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"TU_RFC","password":"TU_PASSWORD"}' | jq -r .access_token)

curl -s http://localhost:3050/api/menu -H "Authorization: Bearer $TOKEN" | jq
```
