package co.com.taller.saucedemo.tasks;

import co.com.taller.saucedemo.interactions.Pausa;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static co.com.taller.saucedemo.userinterfaces.InventoryPage.REMOVE_BUTTON;
import static co.com.taller.saucedemo.userinterfaces.InventoryPage.slug;
import static net.serenitybdd.screenplay.Tasks.instrumented;
import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isNotVisible;

/** Quita un producto (funciona igual en inventario y en carrito: mismo data-test). */
public class QuitarDelCarrito implements Task {
    private final String producto;

    public QuitarDelCarrito(String producto) { this.producto = producto; }

    public static QuitarDelCarrito producto(String producto) {
        return instrumented(QuitarDelCarrito.class, producto);
    }

    @Override
    @Step("{0} quita #producto del carrito")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(REMOVE_BUTTON.of(slug(producto))),
                WaitUntil.the(REMOVE_BUTTON.of(slug(producto)), isNotVisible()).forNoMoreThan(10).seconds(),
                Pausa.breve());
    }
}
