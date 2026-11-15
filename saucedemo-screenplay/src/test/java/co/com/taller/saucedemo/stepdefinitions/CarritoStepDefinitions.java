package co.com.taller.saucedemo.stepdefinitions;

import co.com.taller.saucedemo.questions.FormularioDeLogin;
import co.com.taller.saucedemo.questions.InsigniaDelCarrito;
import co.com.taller.saucedemo.questions.ProductosEnElCarrito;
import co.com.taller.saucedemo.questions.TextoDe;
import co.com.taller.saucedemo.tasks.*;
import co.com.taller.saucedemo.utils.SutAdmin;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.es.Cuando;
import io.cucumber.java.es.Dado;
import io.cucumber.java.es.Entonces;
import net.serenitybdd.screenplay.actors.OnStage;
import net.serenitybdd.screenplay.actors.OnlineCast;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static co.com.taller.saucedemo.userinterfaces.CheckoutPage.*;
import static co.com.taller.saucedemo.userinterfaces.InventoryPage.TITLE;
import static co.com.taller.saucedemo.userinterfaces.LoginPage.ERROR;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Definicion de pasos: solo traduce Gherkin a Tasks y Questions (sin logica de UI).
 * El actor principal es el cliente de la tienda (se nombra en el Background).
 */
public class CarritoStepDefinitions {

    @Before
    public void prepararEscenario() {
        SutAdmin.reset();
        OnStage.setTheStage(new OnlineCast());
    }

    @After
    public void cerrarEscenario() {
        OnStage.drawTheCurtain();
    }

    // ---------- Acciones ----------

    @Dado("^que (\\w+) abrió la tienda$")
    public void abrioLaTienda(String nombre) {
        OnStage.theActorCalled(nombre).attemptsTo(AbrirTienda.inicio());
    }

    @Cuando("^(?:que )?inicia sesión con \"([^\"]*)\" y \"([^\"]*)\"$")
    public void iniciaSesion(String usuario, String clave) {
        theActorInTheSpotlight().attemptsTo(IniciarSesion.con(usuario, clave));
    }

    @Cuando("^(?:que )?agrega (.+) al carrito$")
    public void agregaProductos(String listaDeProductos) {
        theActorInTheSpotlight().attemptsTo(AgregarAlCarrito.productos(extraerComillas(listaDeProductos)));
    }

    @Cuando("^abre el carrito$")
    public void abreElCarrito() {
        theActorInTheSpotlight().attemptsTo(AbrirCarrito.ahora());
    }

    @Cuando("^elimina \"([^\"]*)\"(?: desde el inventario)?$")
    public void eliminaProducto(String producto) {
        theActorInTheSpotlight().attemptsTo(QuitarDelCarrito.producto(producto));
    }

    @Cuando("^selecciona seguir comprando$")
    public void seleccionaSeguirComprando() {
        theActorInTheSpotlight().attemptsTo(SeguirComprando.ahora());
    }

    @Cuando("^hace checkout con nombre \"([^\"]*)\", apellido \"([^\"]*)\" y código postal \"([^\"]*)\"$")
    public void haceCheckout(String nombre, String apellido, String codigoPostal) {
        theActorInTheSpotlight().attemptsTo(HacerCheckout.con(nombre, apellido, codigoPostal));
    }

    @Cuando("^avanza al resumen del checkout con datos válidos$")
    public void avanzaAlResumen() {
        theActorInTheSpotlight().attemptsTo(HacerCheckout.con("Ana", "Gil", "050001"));
    }

    @Cuando("^finaliza la compra$")
    public void finalizaLaCompra() {
        theActorInTheSpotlight().attemptsTo(FinalizarCompra.ahora());
    }

    @Cuando("^cierra sesión$")
    public void cierraSesion() {
        theActorInTheSpotlight().attemptsTo(CerrarSesion.ahora());
    }

    @Cuando("^intenta abrir directamente \"([^\"]*)\"$")
    public void abreDirectamente(String ruta) {
        theActorInTheSpotlight().attemptsTo(AbrirTienda.en(ruta));
    }

    // ---------- Verificaciones ----------

    @Entonces("^el ícono del carrito muestra (\\d+)$")
    public void iconoMuestra(int cantidad) {
        assertThat(theActorInTheSpotlight().asksFor(InsigniaDelCarrito.cantidad())).isEqualTo(cantidad);
    }

    @Entonces("^el ícono del carrito no muestra cantidad$")
    public void iconoSinCantidad() {
        assertThat(theActorInTheSpotlight().asksFor(InsigniaDelCarrito.cantidad())).isZero();
    }

    @Entonces("^el carrito contiene solo \"([^\"]*)\"$")
    public void carritoContieneSolo(String producto) {
        assertThat(theActorInTheSpotlight().asksFor(ProductosEnElCarrito.nombres())).containsExactly(producto);
    }

    @Entonces("^el carrito está vacío$")
    public void carritoVacioEnPantalla() {
        assertThat(theActorInTheSpotlight().asksFor(ProductosEnElCarrito.nombres())).isEmpty();
        assertThat(theActorInTheSpotlight().asksFor(InsigniaDelCarrito.cantidad())).isZero();
    }

    @Entonces("^el carrito queda vacío$")
    public void carritoQuedaVacio() {
        assertThat(theActorInTheSpotlight().asksFor(InsigniaDelCarrito.cantidad())).isZero();
    }

    @Entonces("^ve el inventario$")
    public void veElInventario() {
        assertThat(theActorInTheSpotlight().asksFor(TextoDe.elemento(TITLE))).isEqualTo("Products");
    }

    @Entonces("^ve el mensaje \"([^\"]*)\"$")
    public void veElMensaje(String mensaje) {
        assertThat(theActorInTheSpotlight().asksFor(TextoDe.elemento(COMPLETE_HEADER))).isEqualTo(mensaje);
    }

    @Entonces("^ve el error \"([^\"]*)\"$")
    public void veElError(String mensaje) {
        assertThat(theActorInTheSpotlight().asksFor(TextoDe.elemento(ERROR))).isEqualTo(mensaje);
    }

    @Entonces("^ve el formulario de login$")
    public void veElLogin() {
        assertThat(theActorInTheSpotlight().asksFor(FormularioDeLogin.visible())).isTrue();
    }

    @Entonces("^el subtotal es \"([^\"]*)\", el impuesto \"([^\"]*)\" y el total \"([^\"]*)\"$")
    public void totales(String subtotal, String impuesto, String total) {
        assertThat(theActorInTheSpotlight().asksFor(TextoDe.elemento(SUBTOTAL))).endsWith(subtotal);
        assertThat(theActorInTheSpotlight().asksFor(TextoDe.elemento(TAX))).endsWith(impuesto);
        assertThat(theActorInTheSpotlight().asksFor(TextoDe.elemento(TOTAL))).endsWith(total);
    }

    /** Extrae los textos entre comillas de: "A", "B" y "C". */
    private static List<String> extraerComillas(String texto) {
        List<String> valores = new ArrayList<>();
        Matcher m = Pattern.compile("\"([^\"]+)\"").matcher(texto);
        while (m.find()) valores.add(m.group(1));
        return valores;
    }
}
