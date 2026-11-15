package co.com.taller.saucedemo.interactions;

import co.com.taller.saucedemo.utils.Config;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Interaction;

import static net.serenitybdd.screenplay.Tasks.instrumented;

/** Delay entre pasos para observar la ejecucion. Configurable con -Ddelay.ms. */
public class Pausa implements Interaction {
    private final long ms;

    public Pausa(long ms) { this.ms = ms; }

    public static Pausa breve() { return instrumented(Pausa.class, Config.delayMs()); }

    @Override
    @Step("{0} espera #ms ms para observar la pantalla")
    public <T extends Actor> void performAs(T actor) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
