package co.com.taller.saucedemo.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;

public final class CartPage {
    private CartPage() {}

    public static final Target ITEM_NAMES = Target.the("nombres de productos").locatedBy("[data-test='inventory-item-name']");
    public static final Target CONTINUE_SHOPPING = Target.the("boton Continue Shopping").locatedBy("[data-test='continue-shopping']");
    public static final Target CHECKOUT = Target.the("boton Checkout").locatedBy("[data-test='checkout']");
}
