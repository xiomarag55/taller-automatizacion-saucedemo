package co.com.taller.saucedemo.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;

public final class LoginPage {
    private LoginPage() {}

    public static final Target USERNAME = Target.the("campo usuario").locatedBy("[data-test='username']");
    public static final Target PASSWORD = Target.the("campo clave").locatedBy("[data-test='password']");
    public static final Target LOGIN_BUTTON = Target.the("boton Login").locatedBy("[data-test='login-button']");
    public static final Target ERROR = Target.the("mensaje de error").locatedBy("[data-test='error']");
}
