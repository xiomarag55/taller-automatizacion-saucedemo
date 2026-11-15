package co.com.taller.saucedemo.tasks;

import co.com.taller.saucedemo.interactions.Pausa;
import co.com.taller.saucedemo.utils.Config;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Open;

import static net.serenitybdd.screenplay.Tasks.instrumented;

/** El actor abre una ruta de la tienda (por defecto el login). */
public class AbrirTienda implements Task {
    private final String path;

    public AbrirTienda(String path) { this.path = path; }

    public static AbrirTienda en(String path) { return instrumented(AbrirTienda.class, path); }

    public static AbrirTienda inicio() { return en("/"); }

    @Override
    @Step("{0} abre la tienda en #path")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(Open.url(Config.sutUrl() + path), Pausa.breve());
    }
}
