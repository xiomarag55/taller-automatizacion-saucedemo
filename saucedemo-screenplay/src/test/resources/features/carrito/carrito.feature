# language: es
Característica: Carrito de compras en la tienda online (Caso 1 - SauceDemo)
  Como cliente de la tienda
  Quiero agregar y quitar productos de mi carrito
  Para comprar solo lo que necesito y ver la cantidad correcta

  Antecedentes:
    Dado que Ana abrió la tienda

  # ---------- Ruta feliz ----------
  @smoke @happy-path
  Escenario: Compra E2E completa con un producto
    Cuando inicia sesión con "standard_user" y "secret_sauce"
    Y agrega "Sauce Labs Backpack" al carrito
    Y abre el carrito
    Y hace checkout con nombre "Ana", apellido "Gil" y código postal "050001"
    Y finaliza la compra
    Entonces ve el mensaje "Thank you for your order!"
    Y el carrito queda vacío

  @cart
  Escenario: Agregar varios productos actualiza la cantidad
    Dado que inicia sesión con "standard_user" y "secret_sauce"
    Cuando agrega "Sauce Labs Backpack", "Sauce Labs Bike Light" y "Sauce Labs Onesie" al carrito
    Entonces el ícono del carrito muestra 3

  @cart
  Escenario: Eliminar un producto desde el carrito
    Dado que inicia sesión con "standard_user" y "secret_sauce"
    Y agrega "Sauce Labs Backpack" y "Sauce Labs Bike Light" al carrito
    Cuando abre el carrito
    Y elimina "Sauce Labs Backpack"
    Entonces el carrito contiene solo "Sauce Labs Bike Light"
    Y el ícono del carrito muestra 1

  @cart
  Escenario: Eliminar un producto desde el inventario
    Dado que inicia sesión con "standard_user" y "secret_sauce"
    Y agrega "Sauce Labs Backpack" al carrito
    Cuando elimina "Sauce Labs Backpack" desde el inventario
    Entonces el ícono del carrito no muestra cantidad

  # ---------- Alternos ----------
  @cart @alternate
  Escenario: Quitar todos los productos deja el carrito vacío
    Dado que inicia sesión con "standard_user" y "secret_sauce"
    Y agrega "Sauce Labs Backpack" al carrito
    Cuando abre el carrito
    Y elimina "Sauce Labs Backpack"
    Entonces el carrito está vacío

  @cart @alternate
  Escenario: Seguir comprando conserva el carrito
    Dado que inicia sesión con "standard_user" y "secret_sauce"
    Y agrega "Sauce Labs Backpack" al carrito
    Cuando abre el carrito
    Y selecciona seguir comprando
    Entonces ve el inventario
    Y el ícono del carrito muestra 1

  @checkout @alternate
  Escenario: Los totales de la orden son correctos
    Dado que inicia sesión con "standard_user" y "secret_sauce"
    Y agrega "Sauce Labs Backpack" y "Sauce Labs Bike Light" al carrito
    Cuando avanza al resumen del checkout con datos válidos
    Entonces el subtotal es "$39.98", el impuesto "$3.20" y el total "$43.18"

  @logout @alternate
  Escenario: Cerrar sesión devuelve al login
    Dado que inicia sesión con "standard_user" y "secret_sauce"
    Cuando cierra sesión
    Entonces ve el formulario de login

  # ---------- Excepciones ----------
  @login @negative
  Esquema del escenario: Login inválido
    Cuando inicia sesión con "<usuario>" y "<clave>"
    Entonces ve el error "<mensaje>"

    Ejemplos:
      | usuario         | clave        | mensaje                                                                  |
      |                 | secret_sauce | Epic sadface: Username is required                                       |
      | standard_user   |              | Epic sadface: Password is required                                       |
      | standard_user   | incorrecta   | Epic sadface: Username and password do not match any user in this service |
      | locked_out_user | secret_sauce | Epic sadface: Sorry, this user has been locked out.                      |

  @checkout @negative
  Esquema del escenario: Datos de checkout incompletos
    Dado que inicia sesión con "standard_user" y "secret_sauce"
    Y agrega "Sauce Labs Backpack" al carrito
    Cuando hace checkout con nombre "<nombre>", apellido "<apellido>" y código postal "<cp>"
    Entonces ve el error "<mensaje>"

    Ejemplos:
      | nombre | apellido | cp     | mensaje                         |
      |        | Gil      | 050001 | Error: First Name is required   |
      | Ana    |          | 050001 | Error: Last Name is required    |
      | Ana    | Gil      |        | Error: Postal Code is required  |

  @security @negative
  Escenario: Acceso al inventario sin sesión
    Cuando intenta abrir directamente "/#/inventory"
    Entonces ve el error "Epic sadface: You can only access '/inventory' when you are logged in."

  @checkout @negative
  Escenario: No se puede finalizar una orden con el carrito vacío
    Dado que inicia sesión con "standard_user" y "secret_sauce"
    Cuando avanza al resumen del checkout con datos válidos
    Y finaliza la compra
    Entonces ve el error "Cart is empty"
