# SUT Carrito de compras (Caso 1 - SauceDemo) en NestJS

Aplicación bajo prueba (SUT) para el taller de automatización con Screenplay + Serenity BDD.
Replica el comportamiento de https://www.saucedemo.com/ (mensajes de error y selectores `data-test` idénticos),
pero corre en local y es **determinista**: ideal para automatizar sin depender de un sitio externo.

## Ejecutar

```bash
npm install
npm run start        # http://localhost:3000
npm test             # unitarias (Jest)
npm run test:e2e     # API e2e (Jest + supertest)
```

## Usuarios

| Usuario           | Clave          | Comportamiento           |
|-------------------|----------------|--------------------------|
| `standard_user`   | `secret_sauce` | Acceso normal            |
| `locked_out_user` | `secret_sauce` | Bloqueado (403)          |
| `problem_user`    | `secret_sauce` | Acceso normal (reservado)|

## Pantallas (hash routes) y selectores clave

| Ruta                   | `data-test`                                                                                  |
|------------------------|----------------------------------------------------------------------------------------------|
| `/#/`  (login)         | `username`, `password`, `login-button`, `error`                                              |
| `/#/inventory`         | `inventory-item`, `inventory-item-name`, `add-to-cart-<slug>`, `remove-<slug>`, `shopping-cart-link`, `shopping-cart-badge` |
| `/#/cart`              | `cart-list`, `remove-<slug>`, `continue-shopping`, `checkout`                                |
| `/#/checkout-step-one` | `firstName`, `lastName`, `postalCode`, `continue`, `cancel`, `error`                         |
| `/#/checkout-step-two` | `subtotal-label`, `tax-label`, `total-label`, `finish`                                       |
| `/#/checkout-complete` | `complete-header`, `back-to-products`                                                        |
| Menú                   | `react-burger-menu-btn`, `logout-sidebar-link`                                               |

`<slug>` = nombre en minúsculas con espacios por guiones (ej. `add-to-cart-sauce-labs-backpack`).
El badge del carrito **no existe** cuando el carrito está vacío.

## API REST

`POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/products` · `GET|POST|DELETE /api/cart[/:id]` ·
`POST /api/checkout/info` · `GET /api/checkout/overview` · `POST /api/checkout/finish` ·
`POST /api/test/reset` (deja el SUT en estado inicial; llamarlo en un `@Before` de Cucumber).

Reglas: un producto solo puede estar una vez en el carrito (409), impuesto 8 %, finalizar con carrito vacío → 400.

## Para el taller

- Escenarios Gherkin propuestos: [docs/carrito.feature](docs/carrito.feature) (ruta feliz, alternos y excepciones).
- Sugerencia Screenplay: Tasks `Login`, `AddProductsToCart`, `RemoveProductFromCart`, `Checkout`;
  Interactions `Click`/`Enter` sobre targets `data-test`; Questions `CartBadgeCount`, `CartItems`, `ErrorMessage`, `OrderConfirmation`.
- Para el requisito de "delay entre pasos", usa un `Wait`/`Pause` configurable dentro de las Interactions.
