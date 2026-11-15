package co.com.taller.saucedemo.tasks;

import co.com.taller.saucedemo.interactions.Pausa;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;

import static co.com.taller.saucedemo.userinterfaces.CheckoutPage.FINISH;
import static net.serenitybdd.screenplay.Tasks.instrumented;

public class FinalizarCompra implements Task {
    public static FinalizarCompra ahora() { return instrumented(FinalizarCompra.class); }

    @Override
    @Step("{0} finaliza la compra")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(Click.on(FINISH), Pausa.breve());
    }
}
