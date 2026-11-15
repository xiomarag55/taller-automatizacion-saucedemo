package co.com.taller.saucedemo.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.annotations.Subject;
import net.serenitybdd.screenplay.targets.Target;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

/** Espera a que el elemento aparezca y devuelve su texto (errores, confirmaciones, totales, titulo). */
public class TextoDe implements Question<String> {
    private final Target target;

    private TextoDe(Target target) { this.target = target; }

    public static TextoDe elemento(Target target) { return new TextoDe(target); }

    @Override
    @Subject("el texto mostrado en pantalla")
    public String answeredBy(Actor actor) {
        actor.attemptsTo(WaitUntil.the(target, isVisible()).forNoMoreThan(10).seconds());
        return target.resolveFor(actor).getText().trim();
    }
}
