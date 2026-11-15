package co.com.taller.saucedemo.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.annotations.Subject;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static co.com.taller.saucedemo.userinterfaces.LoginPage.LOGIN_BUTTON;
import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

public class FormularioDeLogin implements Question<Boolean> {
    public static FormularioDeLogin visible() { return new FormularioDeLogin(); }

    @Override
    @Subject("si el formulario de login esta visible")
    public Boolean answeredBy(Actor actor) {
        actor.attemptsTo(WaitUntil.the(LOGIN_BUTTON, isVisible()).forNoMoreThan(10).seconds());
        return LOGIN_BUTTON.resolveFor(actor).isVisible();
    }
}
