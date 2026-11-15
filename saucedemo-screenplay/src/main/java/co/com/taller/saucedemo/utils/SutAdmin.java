package co.com.taller.saucedemo.utils;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

/** Deja el SUT en estado inicial antes de cada escenario (aislamiento entre pruebas). */
public final class SutAdmin {
    private SutAdmin() {}

    public static void reset() {
        try {
            HttpRequest req = HttpRequest.newBuilder(URI.create(Config.sutUrl() + "/api/test/reset"))
                    .POST(HttpRequest.BodyPublishers.noBody()).build();
            HttpResponse<Void> res = HttpClient.newHttpClient().send(req, HttpResponse.BodyHandlers.discarding());
            if (res.statusCode() != 204) {
                throw new IllegalStateException("El reset del SUT respondio " + res.statusCode());
            }
        } catch (java.io.IOException | InterruptedException e) {
            throw new IllegalStateException("No se pudo contactar el SUT en " + Config.sutUrl()
                    + ". Esta corriendo 'npm run start' en saucedemo-nest?", e);
        }
    }
}
