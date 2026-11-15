package co.com.taller.saucedemo.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.annotations.Subject;

import static co.com.taller.saucedemo.userinterfaces.InventoryPage.CART_BADGE;

/** Cantidad mostrada en el icono del carrito. 0 si el badge no existe (carrito vacio). */
public class InsigniaDelCarrito implements Question<Integer> {
    public static InsigniaDelCarrito cantidad() { return new InsigniaDelCarrito(); }

    @Override
    @Subject("la cantidad que muestra el icono del carrito")
    public Integer answeredBy(Actor actor) {
        var badges = CART_BADGE.resolveAllFor(actor);
        return badges.isEmpty() ? 0 : Integer.parseInt(badges.get(0).getText().trim());
    }
}
