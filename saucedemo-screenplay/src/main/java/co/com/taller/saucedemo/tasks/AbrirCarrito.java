package co.com.taller.saucedemo.tasks;

import co.com.taller.saucedemo.interactions.Pausa;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static co.com.taller.saucedemo.userinterfaces.CartPage.CHECKOUT;
import static co.com.taller.saucedemo.userinterfaces.InventoryPage.CART_LINK;
import static net.serenitybdd.screenplay.Tasks.instrumented;
import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

public class AbrirCarrito implements Task {
    public static AbrirCarrito ahora() { return instrumented(AbrirCarrito.class); }

    @Override
    @Step("{0} abre el carrito")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(CART_LINK),
                WaitUntil.the(CHECKOUT, isVisible()).forNoMoreThan(10).seconds(),
                Pausa.breve());
    }
}
