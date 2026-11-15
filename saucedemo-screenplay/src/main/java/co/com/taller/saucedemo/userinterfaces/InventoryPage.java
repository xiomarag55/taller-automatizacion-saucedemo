package co.com.taller.saucedemo.userinterfaces;

import net.serenitybdd.screenplay.targets.Target;

public final class InventoryPage {
    private InventoryPage() {}

    public static final Target TITLE = Target.the("titulo de la pagina").locatedBy("[data-test='title']");
    public static final Target ADD_BUTTON = Target.the("boton agregar de {0}").locatedBy("[data-test='add-to-cart-{0}']");
    public static final Target REMOVE_BUTTON = Target.the("boton quitar de {0}").locatedBy("[data-test='remove-{0}']");
    public static final Target CART_LINK = Target.the("icono del carrito").locatedBy("[data-test='shopping-cart-link']");
    public static final Target CART_BADGE = Target.the("contador del carrito").locatedBy("[data-test='shopping-cart-badge']");
    public static final Target MENU_BUTTON = Target.the("boton de menu").locatedBy("[data-test='open-menu']");
    public static final Target LOGOUT_LINK = Target.the("enlace Logout").locatedBy("[data-test='logout-sidebar-link']");

    /** "Sauce Labs Backpack" -> "sauce-labs-backpack" (igual que los data-test). */
    public static String slug(String productName) {
        return productName.toLowerCase().replace(" ", "-");
    }
}
