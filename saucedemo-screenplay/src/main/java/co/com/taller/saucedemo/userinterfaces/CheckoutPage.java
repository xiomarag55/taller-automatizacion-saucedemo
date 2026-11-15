package co.com.taller.saucedemo.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;

public final class CheckoutPage {
    private CheckoutPage() {}

    public static final Target FIRST_NAME = Target.the("campo nombre").locatedBy("[data-test='firstName']");
    public static final Target LAST_NAME = Target.the("campo apellido").locatedBy("[data-test='lastName']");
    public static final Target POSTAL_CODE = Target.the("campo codigo postal").locatedBy("[data-test='postalCode']");
    public static final Target CONTINUE = Target.the("boton Continue").locatedBy("[data-test='continue']");
    public static final Target SUBTOTAL = Target.the("subtotal").locatedBy("[data-test='subtotal-label']");
    public static final Target TAX = Target.the("impuesto").locatedBy("[data-test='tax-label']");
    public static final Target TOTAL = Target.the("total").locatedBy("[data-test='total-label']");
    public static final Target FINISH = Target.the("boton Finish").locatedBy("[data-test='finish']");
    public static final Target COMPLETE_HEADER = Target.the("mensaje de orden completa").locatedBy("[data-test='complete-header']");
}
