package co.com.taller.saucedemo.tasks;

import co.com.taller.saucedemo.interactions.Pausa;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;

import static co.com.taller.saucedemo.userinterfaces.CartPage.CHECKOUT;
import static co.com.taller.saucedemo.userinterfaces.CheckoutPage.*;
import static net.serenitybdd.screenplay.Tasks.instrumented;

/** Desde el inventario: carrito -> Checkout -> datos del cliente -> Continue. */
public class HacerCheckout implements Task {
    private final String nombre;
    private final String apellido;
    private final String codigoPostal;

    public HacerCheckout(String nombre, String apellido, String codigoPostal) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.codigoPostal = codigoPostal;
    }

    public static HacerCheckout con(String nombre, String apellido, String codigoPostal) {
        return instrumented(HacerCheckout.class, nombre, apellido, codigoPostal);
    }

    @Override
    @Step("{0} hace checkout como #nombre #apellido")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                AbrirCarrito.ahora(),
                Click.on(CHECKOUT), Pausa.breve(),
                Enter.theValue(nombre).into(FIRST_NAME), Pausa.breve(),
                Enter.theValue(apellido).into(LAST_NAME), Pausa.breve(),
                Enter.theValue(codigoPostal).into(POSTAL_CODE), Pausa.breve(),
                Click.on(CONTINUE), Pausa.breve());
    }
}
