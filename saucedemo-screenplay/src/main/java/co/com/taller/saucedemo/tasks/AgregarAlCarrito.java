package co.com.taller.saucedemo.tasks;

import co.com.taller.saucedemo.interactions.Pausa;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.waits.WaitUntil;

import java.util.List;

import static co.com.taller.saucedemo.userinterfaces.InventoryPage.*;
import static net.serenitybdd.screenplay.Tasks.instrumented;
import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

/** Agrega uno o varios productos desde el inventario y espera a que el boton cambie a Remove. */
public class AgregarAlCarrito implements Task {
    private final List<String> productos;

    public AgregarAlCarrito(List<String> productos) { this.productos = productos; }

    public static AgregarAlCarrito productos(List<String> productos) {
        return instrumented(AgregarAlCarrito.class, productos);
    }

    @Override
    @Step("{0} agrega al carrito: #productos")
    public <T extends Actor> void performAs(T actor) {
        for (String nombre : productos) {
            actor.attemptsTo(
                    Click.on(ADD_BUTTON.of(slug(nombre))),
                    WaitUntil.the(REMOVE_BUTTON.of(slug(nombre)), isVisible()).forNoMoreThan(10).seconds(),
                    Pausa.breve());
        }
    }
}
