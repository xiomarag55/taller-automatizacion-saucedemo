# Guía completa — Carrito de compras (Caso 1) y sus pruebas automatizadas

> Para el equipo del taller de Calidad de Software. Cubre cómo funciona la aplicación,
> cómo están construidas las pruebas en sus tres niveles, cómo ejecutar todo y cómo
> resolver los problemas conocidos del entorno.

## 1. Vista general

Hay dos proyectos independientes que se comunican por HTTP:

```
┌─────────────────────────────┐        ┌──────────────────────────────────┐
│  saucedemo-nest (el SUT)    │        │  saucedemo-screenplay (el bot)   │
│  NestJS 11 + SPA vanilla    │◄───────│  Java 17-21 + Gradle 8.6         │
│  http://localhost:3000     │ Chrome │  Serenity BDD 4.2 + Cucumber     │
│                             │        │  Patrón Screenplay               │
│  - API REST (auth, products,│        │  - 17 escenarios Gherkin (es)    │
│    cart, checkout)          │        │  - Reporte con capturas          │
│  - Interfaz web futurista   │        │                                  │
│  - POST /api/test/reset     │◄───────┤  (reset antes de cada escenario) │
└─────────────────────────────┘        └──────────────────────────────────┘
```

El SUT replica https://www.saucedemo.com/ (mismos mensajes de error y mismos selectores
`data-test`), pero corre en local y es determinista.

## 2. La aplicación (saucedemo-nest)

### 2.1 Arranque y módulos

`src/main.ts` crea la app Nest, sirve los estáticos de `public/` y escucha en el puerto
3000 (variable `PORT` para cambiarlo). `AppModule` arma cuatro módulos de negocio más un
controlador de soporte:

| Módulo | Responsabilidad | Clases clave |
|---|---|---|
| `auth` | Login/logout con tokens en memoria; guard que protege el resto de la API | `AuthService`, `AuthGuard` |
| `products` | Catálogo fijo de 6 productos | `ProductsService` |
| `cart` | Carrito por usuario (Map en memoria) | `CartService` |
| `checkout` | Datos del cliente, resumen con impuesto y cierre de la orden | `CheckoutService` |
| `test-support` | `POST /api/test/reset`: borra sesiones, carritos y checkouts | `TestSupportController` |

Todo el estado vive en memoria: reiniciar el proceso (o llamar al reset) deja la app
como recién instalada. Eso es deliberado: cada prueba parte de cero.

### 2.2 API REST

| Método y ruta | Qué hace | Códigos |
|---|---|---|
| `POST /api/auth/login` | Entrega `{token, username}` | 200, 401 (credenciales), 403 (bloqueado) |
| `POST /api/auth/logout` | Invalida el token | 204 |
| `GET /api/products` | Lista los 6 productos | 200, 401 sin token |
| `GET /api/cart` | `{count, items}` del usuario | 200 |
| `POST /api/cart/:id` | Agrega producto | 201, 409 duplicado, 404 inexistente |
| `DELETE /api/cart/:id` | Quita producto | 200, 404 si no está |
| `POST /api/checkout/info` | Valida nombre/apellido/código postal | 200, 400 campo faltante |
| `GET /api/checkout/overview` | Subtotal + impuesto 8 % + total | 200 |
| `POST /api/checkout/finish` | Cierra la orden y vacía el carrito | 200, 400 (sin datos o carrito vacío) |
| `POST /api/test/reset` | Estado inicial total | 204 |

Usuarios: `standard_user`, `problem_user` (normales) y `locked_out_user` (bloqueado),
todos con clave `secret_sauce`.

### 2.3 Frontend (SPA en `public/`)

`app.js` es una SPA sin frameworks con rutas por hash: `#/` (login), `#/inventory`,
`#/cart`, `#/checkout-step-one`, `#/checkout-step-two`, `#/checkout-complete`. Cada
render consulta la API con el token guardado en `sessionStorage` y pinta el HTML con los
atributos `data-test` idénticos a saucedemo.com (`username`, `login-button`,
`add-to-cart-<slug>`, `shopping-cart-badge`, `checkout`, `finish`, `error`, etc.).
El badge del carrito **no existe en el DOM** cuando el carrito está vacío — las
Questions del bot dependen de ese detalle.

### 2.4 Diseño futurista

El rediseño vive solo en `styles.css`, `particles.js` y el canvas de `index.html`;
la estructura funcional no cambió:

- **Tokens** en `:root` (fondo azul profundo, acento menta `#39f0c0`, acento azul
  `#5aa7ff`, líneas finas translúcidas).
- **Grid sutil** de fondo con `body::before` (gradientes de 1px cada 44px, enmascarado).
- **Partículas plexus** en un canvas fijo (`particles.js`), con `pointer-events: none`
  y respeto a `prefers-reduced-motion`.
- **Acentos geométricos**: esquinas recortadas con `clip-path` en tarjetas y botones,
  escuadras en las esquinas del login, badge hexagonal, rombos como marcadores.

Regla de QA aplicada: los elementos cuyo texto verifica el bot (título, errores,
totales, nombres de producto, confirmación) **no usan `text-transform`**, porque el
`getText()` de Selenium refleja esa transformación y rompería las comparaciones
literales. El uppercase decorativo quedó solo en logo y botones.

## 3. Las pruebas (tres niveles)

```
         UI E2E — 17 escenarios Gherkin (Serenity + Screenplay, navegador real)
        ────────────────────────────────────────────────
       API e2e — 15 pruebas (Jest + supertest, sin navegador)
      ──────────────────────────────────────────────────────
     Unitarias — 7 pruebas de CartService (Jest puro)
```

### 3.1 Unitarias (`saucedemo-nest/src/cart/cart.service.spec.ts`)

Validan la lógica del carrito aislada: vacío inicial, contador, duplicado prohibido,
producto inexistente, eliminación, independencia entre usuarios. `npm test`.

### 3.2 API e2e (`saucedemo-nest/test/app.e2e-spec.ts`)

Levantan la app Nest en memoria y la atacan con supertest: login válido e inválido
(los 4 mensajes de error), seguridad (401 sin token, token muerto tras logout),
carrito (agregar/quitar, 409, 404) y checkout (validaciones, cálculo 39.98 + 3.20 =
43.18, flujo completo, carrito vacío). `npm run test:e2e`.

### 3.3 UI E2E con Screenplay (`saucedemo-screenplay/`)

El patrón Screenplay separa el *qué* del *cómo*:

| Capa | Pregunta que responde | Ejemplos |
|---|---|---|
| **Feature** (Gherkin) | ¿Qué comportamiento de negocio se espera? | `features/carrito/carrito.feature` |
| **StepDefinitions** | ¿Qué Task/Question corresponde a cada frase? | `CarritoStepDefinitions` |
| **Tasks** | ¿Qué hace el actor en términos del negocio? | `IniciarSesion`, `AgregarAlCarrito`, `HacerCheckout` |
| **Interactions** | ¿Qué gesto concreto ejecuta? | `Click`, `Enter`, `Open`, `Pausa` (delay configurable) |
| **UserInterfaces** | ¿Dónde está cada elemento? | Targets por `data-test` en `LoginPage`, `InventoryPage`… |
| **Questions** | ¿Qué se observa para verificar? | `InsigniaDelCarrito`, `ProductosEnElCarrito`, `TextoDe` |
| **Runner** | ¿Qué features corren y con qué glue? | `CarritoRunner` |

**Ciclo de vida de un escenario** (ejemplo: *Compra E2E completa*):

1. `@Before`: `SutAdmin.reset()` llama a `POST /api/test/reset` (estado limpio) y
   `OnStage.setTheStage(new OnlineCast())` prepara al actor.
2. `Dado que Ana abrió la tienda` → Task `AbrirTienda` → Interaction `Open.url`.
3. `inicia sesión con…` → `IniciarSesion` → `Enter` en los Targets de `LoginPage` + `Click`.
4. `agrega "Sauce Labs Backpack"` → `AgregarAlCarrito` → clic en
   `add-to-cart-sauce-labs-backpack` + espera a que aparezca `remove-…`.
5. `hace checkout…` y `finaliza la compra` → `HacerCheckout` + `FinalizarCompra`.
6. `Entonces ve el mensaje…` → Question `TextoDe(COMPLETE_HEADER)` + assertion AssertJ.
7. `@After`: se cierra el telón (y el navegador, uno por escenario).

Entre cada interacción corre `Pausa.breve()` (`-Ddelay.ms`, 1000 ms por defecto, 0 en
CI) — es el delay que pide la rúbrica para observar la ejecución.

Los 17 escenarios cubren ruta feliz (compra completa), alternos (varios productos,
eliminar desde carrito e inventario, seguir comprando, totales, logout) y excepciones
(4 logins inválidos, 3 checkouts incompletos, acceso sin sesión, carrito vacío),
etiquetados con `@smoke`, `@cart`, `@checkout`, `@login`, `@negative`, `@alternate`,
`@security`, `@logout`.

### 3.4 Reporte Serenity

`./gradlew test aggregate` genera `target/site/serenity/index.html`: resultados por
feature/escenario, cada paso con su captura de pantalla, tiempos y filtros por tag.
`ignoreFailures = true` en `build.gradle` garantiza que el reporte se genere aunque
algo falle.

## 4. Cómo ejecutar todo

```bash
# Terminal 1 — la aplicación
cd saucedemo-nest
npm install            # solo la primera vez
npm run start          # http://localhost:3000

# Terminal 2 — pruebas de la app (opcional)
npm test               # unitarias
npm run test:e2e       # API

# Terminal 2 — el bot E2E
cd ../saucedemo-screenplay
./gradlew test aggregate                          # navegador visible, 1 s entre pasos
# luego abrir target/site/serenity/index.html
```

| Variante | Para qué |
|---|---|
| `-Ddelay.ms=2000` | Exposición: se ve cada acción |
| `-Dheadless.mode=true -Ddelay.ms=0` | Rápido / CI |
| `-Dcucumber.filter.tags="@smoke"` | Un solo tag |
| `-Dsut.url=http://localhost:3100` | App en otro puerto |
| `--rerun-tasks` | Forzar ejecución si Gradle dice "up-to-date" (el alias `--rerun` no existe) |

Requisitos: Node 18+, JDK 17–21 (`JAVA_HOME` → jdk-21; Gradle 8.6 no soporta el
JDK 26 del PATH) e internet la primera vez (Gradle, dependencias, chromedriver).

## 5. Solución de problemas

| Síntoma | Causa / solución |
|---|---|
| `No se pudo contactar el SUT` | Falta `npm run start` en saucedemo-nest |
| Gradle no arranca | `JAVA_HOME` debe apuntar al JDK 21 |
| "BUILD SUCCESSFUL" en segundos y sin pruebas | Gradle cacheó: agrega `--rerun-tasks` |
| Puerto 3000 ocupado | `PORT=3100 npm run start` + `-Dsut.url=…` |
| **En PowerShell, Gradle dice "Task '.filter.tags=…' not found" o "Task '.ms=2000' not found"** | PowerShell 5.1 parte un argumento `-Dclave.con.puntos=valor` en el primer punto cuando va **sin comillas** alrededor de todo el argumento. `-Dsingle=2000` (sin punto en la clave) funciona suelto; `-Ddelay.ms=2000` o `-Dcucumber.filter.tags=@x` **necesitan comillas simples envolviendo todo el argumento**: `'-Ddelay.ms=2000'`. Confirmado probando ambas formas. |
| **Clics que "no hacen nada"** (el paso pasa pero la página no reacciona, o el reporte dice que un elemento nunca apareció) | Bug intermitente del Chrome instalado: en algunas versiones/momentos descarta clics sintetizados de WebDriver (el renderer sigue vivo pero el `pointerdown` nunca llega al DOM). **No hay una solución de configuración confiable**: se intentó fijar el navegador a una build antigua vía `serenity.conf` (`capabilities."goog:chromeOptions".binary` y, después, `browserVersion`), y también vía la variable `SE_CHROME_BINARY`. Las tres vías fueron verificadas directamente (revisando qué `chrome.exe` se lanza de verdad durante la prueba, y leyendo el código fuente de Serenity/Selenium) y **ninguna tiene efecto** en esta combinación de versiones — el navegador real que se lanza siempre es el de `Program Files`, nunca un binario fijado. La carpeta `tools/chrome/` quedó sin uso por esto. **Mitigación real**: el bug es intermitente, no permanente — si falla, corre el comando de nuevo (`--rerun-tasks`). Si vuelve a fallar seguido durante la exposición, considera agregar un reintento al clic en `AgregarAlCarrito`/`AbrirCarrito`/`QuitarDelCarrito` (click → esperar ~3s → si no cambió, click de nuevo) en vez de seguir peleando con la configuración del navegador. |
| El reporte no aparece | Ejecuta `test` y `aggregate` juntos |

Nota de método (lección del taller): cuando la suite pase de verde a rojo **sin cambios
de código**, sospecha del entorno (navegador auto-actualizado, driver, SO) — pero
verifica la sospecha con evidencia directa (qué proceso se lanza realmente, qué dice
el código fuente de la librería) antes de dar una config por "arreglada". Un log que
*parece* confirmar el fix (p. ej. que no muestre errores) no prueba que se haya aplicado.

## 6. Mapa de archivos

```
taller-calidad/
├── README.md                      ← este documento
├── tools/chrome/…                 ← Chrome for Testing 157.0.8103.40 (sin uso actualmente, ver §5)
├── saucedemo-nest/
│   ├── src/{auth,products,cart,checkout}/   módulos NestJS
│   ├── src/test-support.controller.ts       POST /api/test/reset
│   ├── public/{index.html,app.js,styles.css,particles.js}   SPA + diseño futurista
│   ├── src/cart/cart.service.spec.ts        7 unitarias
│   ├── test/app.e2e-spec.ts                 15 API e2e
│   └── docs/carrito.feature                 escenarios de referencia
└── saucedemo-screenplay/
    ├── serenity.conf / serenity.properties  navegador, capturas, delay
    ├── src/main/java/co/com/taller/saucedemo/
    │   ├── userinterfaces/  Targets por data-test
    │   ├── tasks/           9 tareas de negocio
    │   ├── interactions/    Pausa (delay -Ddelay.ms)
    │   ├── questions/       4 verificaciones
    │   └── utils/           Config, SutAdmin (reset)
    ├── src/test/java/…/stepdefinitions/     glue Gherkin→Screenplay
    ├── src/test/java/…/runners/             CarritoRunner
    ├── src/test/resources/features/carrito/ carrito.feature (17 escenarios)
    └── target/site/serenity/index.html      reporte con capturas
```
