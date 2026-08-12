# qrveda

Trece preguntas. Cada una tiene su respuesta en un verso del *Bhagavad-gītā*.

Dos cosas que se alimentan entre sí: **tarjetas de papel** con una pregunta y un código, y una **web** donde ese código abre el verso y va completando una colección. Las cartas que faltan solo aparecen encontrando más tarjetas.

> Un QR al día no hace daño

## Qué hay aquí

```
data/     las preguntas, los versos y las URLs
web/      el sitio: html y javascript planos, sin dependencias
gui/      el creador de tarjetas (el mismo que se sirve en /imprimir/)
src/      generadores de los PDF de imprenta y del caché de versos
dist/     PDF listos para mandar
```

## La web

`web/` es HTML y JavaScript sin framework, sin build y sin base de datos. Cuatro archivos:

| | |
|---|---|
| `index.html` | el armazón |
| `app.js` | rutas, colección, idioma y compartir |
| `estilo.css` | oscuro por defecto, claro si el sistema lo pide |
| `datos.json` | las trece preguntas con su verso ya dentro |
| `qrcode.min.js` | generador de códigos, para las descargas |

**Una URL por carta, para los dos idiomas:** `qrveda.com/7`. El idioma se detecta del navegador y se puede cambiar en la barra, así que un mismo código impreso sirve en español y en inglés. Eso mantiene el QR corto y evita imprimir dos juegos.

Lo que colecciona cada visitante vive en su navegador: sin cuentas, sin servidor y sin analítica.

**La carta del día** sale del número de día, no del azar: es la misma para todo el mundo y cambia a medianoche.

**El código de cada carta** se muestra en su página con un menú: descargarlo en vector para camisetas, en PNG de 2000 px para imprentas que no aceptan vector, copiar el enlace o pasar al creador de tarjetas. El código lleva de vuelta a `qrveda.com/7`, no a vedabase, para que quien lo escanee entre por el juego.

Para camisetas: a la espalda y de 8 a 10 cm. En el pecho nadie se atreve a acercar el móvil; en una cola, la espalda de quien va delante se escanea sola. Oscuro sobre tela clara, plano y sin arrugas.

### Probarla en local

```bash
python3 src/servir.py
```

Abre <http://localhost:8899/>. Ese servidor aplica la misma regla que `web/_redirects`, así que `/7` funciona igual que en producción. Con `python3 -m http.server` no: devuelve 404 en todo lo que no sea un archivo real.

### Desplegar

Cloudflare Pages, carpeta `web/`, sin comando de compilación. `_redirects` manda cualquier ruta a `index.html`, salvo `/imprimir/`.

## El creador de tarjetas

`gui/index.html`, y en la web bajo `/imprimir/`. Abre con doble clic, no necesita conexión ni instalación.

Enseña la hoja A4 entera con las diez tarjetas. Pinchas una y la editas: las dos líneas, la pregunta, el capítulo y el verso. La URL se rellena sola y se puede escribir a mano; **Abrir y comprobar** la abre en otra pestaña.

Zoom en la barra, flechas ← → para saltar de tarjeta, y **Guardar PDF para imprenta**, que abre el diálogo de impresión — elige *Guardar como PDF*, escala 100 % y sin «ajustar al papel».

## Las tarjetas

85 × 55 mm, tamaño de cartera, a una sola cara. Diez por hoja A4 con marcas de corte en los márgenes.

Delante van solo dos cosas: la pregunta y el código. Sin explicación, sin nombres que haya que conocer de antes y sin texto debajo del QR. Lo único que tiene que conseguir la tarjeta es que escaneen.

**Los códigos** se generan con corrección de error M, no H: con H salen más densos y las celdas se quedan pequeñas al imprimir. Con las URLs actuales son 33 módulos, y a 30 mm dan 0,9 mm por celda. El generador avisa si alguna combinación baja de 0,5 mm, que es donde un móvil empieza a fallar con luz de interior.

Sin sangrado, y es correcto: el fondo es blanco y ningún elemento llega al borde.

Para repartir en la calle, cartulina de 300 g. En papel normal se dobla el primer día.

### Qué mandar a la imprenta

El **pliego A4**. Con la hoja ya imposada es un solo archivo: imprimen N copias y guillotinan. Que dentro haya diez diseños distintos o uno repetido les da igual, porque cobran por hojas y por cortes.

Mandar los diez sueltos suele salir más caro: algunas imprentas cobran preparación por diseño y las webs de tarjetas cobran por diseño casi siempre. El `1up` está por si lo piden.

## Regenerar

```bash
pip install segno weasyprint
python3 src/versos.py      # refresca los versos desde vedabase.cc
python3 src/build.py       # PDF de imprenta a dist/
```

`src/versos.py` solo hace falta cuando cambian las preguntas: baja de vedabase.cc la traducción de cada verso y el número de clases de Prabhupāda que hay sobre él.

## Añadir un idioma

Un bloque en `IDIOMAS`, dentro de `src/build.py`, y otro en `data/tarjetas.json`. Comprueba antes que la página existe y trae el verso:

```bash
curl -sL https://vedabase.cc/pt/bg/2/13/ | grep -o '<title>[^<]*'
```

## Los enlaces

Todo apunta a **vedabase.cc**, que sirve una página por verso montada en el servidor: `/es/bg/2/13/` es BG 2.13 y el código aterriza exactamente ahí.

Se descartó vedic-library porque no tiene página por verso —el verso es un ancla dentro del capítulo— y porque devuelve 200 a cualquier ruta, con lo que una URL inventada parece válida hasta que la abres.
