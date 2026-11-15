package co.com.taller.saucedemo.utils;

/** Parametros de ejecucion (se sobreescriben con -Dsut.url=... -Ddelay.ms=...). */
public final class Config {
    private Config() {}

    public static String sutUrl() {
        return System.getProperty("sut.url", "http://localhost:3000");
    }

    /** Pausa entre pasos para poder observar la prueba (requisito de socializacion del taller). */
    public static long delayMs() {
        return Long.parseLong(System.getProperty("delay.ms", "1000"));
    }
}
