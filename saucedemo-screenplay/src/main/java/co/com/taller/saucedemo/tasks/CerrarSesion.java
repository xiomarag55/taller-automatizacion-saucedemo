package co.com.taller.saucedemo.tasks;

import co.com.taller.saucedemo.interactions.Pausa;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;

import static co.com.taller.saucedemo.userinterfaces.InventoryPage.LOGOUT_LINK;
import static co.com.taller.saucedemo.userinterfaces.InventoryPage.MENU_BUTTON;
import static net.serenitybdd.screenplay.Tasks.instrumented;

public class CerrarSesion implements Task {
    public static CerrarSesion ahora() { return instrumented(CerrarSesion.class); }

    @Override
    @Step("{0} cierra sesion")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(Click.on(MENU_BUTTON), Pausa.breve(), Click.on(LOGOUT_LINK), Pausa.breve());
    }
}
