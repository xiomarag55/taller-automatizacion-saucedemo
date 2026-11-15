package co.com.taller.saucedemo.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.annotations.Subject;

import java.util.List;

import static co.com.taller.saucedemo.userinterfaces.CartPage.ITEM_NAMES;

public class ProductosEnElCarrito implements Question<List<String>> {
    public static ProductosEnElCarrito nombres() { return new ProductosEnElCarrito(); }

    @Override
    @Subject("los productos listados en el carrito")
    public List<String> answeredBy(Actor actor) {
        return ITEM_NAMES.resolveAllFor(actor).stream().map(e -> e.getText().trim()).toList();
    }
}
