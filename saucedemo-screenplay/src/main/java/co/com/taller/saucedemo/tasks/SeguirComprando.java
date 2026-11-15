package co.com.taller.saucedemo.tasks;

import co.com.taller.saucedemo.interactions.Pausa;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;

import static co.com.taller.saucedemo.userinterfaces.CartPage.CONTINUE_SHOPPING;
import static net.serenitybdd.screenplay.Tasks.instrumented;

public class SeguirComprando implements Task {
    public static SeguirComprando ahora() { return instrumented(SeguirComprando.class); }

    @Override
    @Step("{0} selecciona seguir comprando")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(Click.on(CONTINUE_SHOPPING), Pausa.breve());
    }
}
