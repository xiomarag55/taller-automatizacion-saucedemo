# Bot E2E (Screenplay + Serenity BDD) para el carrito de compras

Automatiza `../saucedemo-nest` con Java 17+, Gradle, Cucumber (Gherkin en español) y Serenity BDD.
Sigue la estructura del scaffold de `jumosqu12/ScreenplayArchitecture`
(`userinterfaces`, `interactions`, `tasks`, `questions`, `stepdefinitions`, `runners`, `features`).

## Cómo ejecutarlo

Terminal 1 - levantar la aplicación bajo prueba:
```bash
cd saucedemo-nest
npm install
npm run start          # http://localhost:3000
```

Terminal 2 - correr el bot:
```bash
cd saucedemo-screenplay
./gradlew test aggregate                       # con navegador visible y 1 s entre pasos
./gradlew test aggregate -Ddelay.ms=2000       # mas lento para la exposicion
./gradlew test aggregate -Dheadless.mode=true -Ddelay.ms=0     # rapido / CI
./gradlew test aggregate -Dcucumber.filter.tags="@smoke"       # solo un tag
./gradlew test aggregate -Dsut.url=http://localhost:3100       # otro puerto
```
Requisitos: JDK 17-21 (Gradle 8.6 no soporta JDK 26: usa `JAVA_HOME` apuntando a un JDK 21) y Chrome instalado
(el driver se descarga solo).

## Reporte Serenity

`target/site/serenity/index.html` (se genera con la tarea `aggregate`, incluye capturas por paso).

## Estructura

| Capa | Clases |
|------|--------|
| userinterfaces | `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage` (Targets por `data-test`) |
| tasks (negocio) | `AbrirTienda`, `IniciarSesion`, `AgregarAlCarrito`, `QuitarDelCarrito`, `AbrirCarrito`, `SeguirComprando`, `HacerCheckout`, `FinalizarCompra`, `CerrarSesion` |
| interactions | `Pausa` (delay entre pasos, `-Ddelay.ms`) + Click/Enter/Open/WaitUntil de Serenity |
| questions | `InsigniaDelCarrito`, `ProductosEnElCarrito`, `TextoDe`, `FormularioDeLogin` |
| stepdefinitions | `CarritoStepDefinitions` (hooks: reset del SUT + escenario del actor) |
| runners | `CarritoRunner` |
| features | `src/test/resources/features/carrito/carrito.feature` (17 escenarios) |

## Resultado de la última ejecución
17/17 escenarios en verde (ruta feliz, alternos y excepciones).
