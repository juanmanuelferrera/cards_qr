# qrveda

Trece sobres lacrados. Cada uno guarda una pregunta y el verso del *Bhagavad-gītā* que la responde.

**https://qr.vedicvault.org**

> Un QR al día no hace daño

---

## Las reglas

**1. Cada día se puede abrir un sobre.** El mismo para todo el mundo. Cambia a medianoche.

**2. Los demás están cerrados.** Se ven en la colección, con su número, pero no se pueden tocar.

**3. Un sobre cerrado se abre con su clave.** Cuatro caracteres. Quien ya lo abrió puede dárselos a quien quiera: de palabra, por mensaje, en una tarjeta impresa o en una camiseta. El QR de la tarjeta lleva al mismo sitio.

**4. Para quedarte un sobre hay que hacer dos cosas.** Primero contestar la pregunta con tus palabras, antes de leer nada. Después abrir el verso entero con su significado. Con las dos, el sobre es tuyo.

**5. Solo se reparte lo que se ha abierto.** No puedes dar la clave de un sobre que no tienes.

**6. Al completar un mazo se abre el siguiente.** Hay tres: Sambandha, Abhidheya y Prayojana — quién eres, qué se hace con eso, a dónde lleva.

Sin cuentas, sin registro y sin recoger datos de nadie. La colección vive en el navegador de cada uno.

---

## Por qué está montado así

**Contestar antes de leer.** Es lo que hace que la pregunta caiga encima en vez de resbalar. Al final del mazo tienes trece preguntas con lo que tú respondiste al lado de lo que dice el verso.

**Uno al día, y el resto por clave.** Sin esa regla la colección se completa sola en veinte minutos y no queda nada. Con ella, trece días encerrado en casa o dos tardes si hay gente alrededor. Eso premia el reparto sin obligar a nadie a compartir para avanzar.

**Regalar no cuesta nada.** Dar tu clave no te quita el sobre. Al contrario que con los cromos, aquí regalar es gratis y aun así el que recibe siente que le han dado algo.

**Nada de peajes.** No hay que compartir para seguir jugando, ni cuenta atrás, ni notificaciones que empujen. Lo que tiene que aguantar el interés son las preguntas.

---

## Qué hay en el repositorio

```
data/      las preguntas, sus versos y sus claves
web/       el sitio: html y javascript planos, sin dependencias
functions/ la copia de seguridad por código (Cloudflare Pages Functions)
gui/       el creador de tarjetas, servido también en /imprimir/
src/       generadores de los PDF de imprenta y del caché de versos
dist/      PDF listos para mandar a la imprenta
```

## La web

Cuatro archivos, sin framework ni compilación:

| | |
|---|---|
| `index.html` | el armazón |
| `app.js` | rutas, colección, claves, idioma y descargas |
| `estilo.css` | oscuro por defecto, claro si el sistema lo pide |
| `datos.json` | solo el esqueleto: números de sobre y niveles |
| `sobres/<id>.json` | la pregunta, el verso y la clave de cada sobre |
| `versos/<cap>-<ver>.json` | el significado completo, que se pide al abrir |
| `qrcode.min.js` | generador de códigos |

Nada de eso viaja en la primera carga: cada sobre se pide cuando hace falta. Antes `datos.json` traía las trece preguntas y las trece claves, y bastaba con abrirlo para acabarse el juego.

**Las claves no están en el navegador.** `functions/api/clave.js` las recalcula con el mismo hash que el generador de tarjetas, así que no hay lista que espiar.

**Una URL por sobre, para los dos idiomas:** `qr.vedicvault.org/7`. El idioma se detecta del navegador y se cambia en la barra, así que un mismo código impreso sirve en español y en inglés.

**El sobre del día** sale del número de día, no del azar.

**Los códigos** se descargan desde cada sobre ganado: vector de 100 mm para camisetas, PNG de 2000 px para imprentas que no aceptan vector, o el enlace. Hay también un botón discreto de camiseta con dos salidas —descargar el diseño y hacérsela donde quiera, o pedirla por correo—. Cuando haya demanda se cambia por una tienda. Para camisetas, a la espalda y de 25 a 30 cm. Un QR se lee desde unas diez veces su tamaño, así que 25 cm dan dos metros y medio — la distancia de una cola o un semáforo. Por debajo de 10 cm hay que acercarse, y al pecho de un desconocido no se acerca nadie.

### Probarla en local

```bash
python3 src/servir.py
```

Abre <http://localhost:8899/>. Ese servidor aplica la misma regla que `web/_redirects`, así que `/7` funciona igual que en producción. Con `python3 -m http.server` no.

### Desplegar

```bash
wrangler pages deploy
```

Lee `wrangler.toml`: carpeta `web/`, sin compilación, con el almacén KV de las copias. `_redirects` manda cualquier ruta a `index.html` salvo `/imprimir/`, y `_headers` desactiva la caché para que cada despliegue se vea al recargar.

## Lo que hace el servidor

Tres funciones, y ninguna guarda datos personales:

| | |
|---|---|
| `functions/[sobre].js` | sirve cada sobre con sus etiquetas de vista previa, para que un enlace compartido enseñe su pregunta. Y devuelve 404 de verdad en lo que no existe |
| `functions/api/clave.js` | comprueba una clave sin que las claves lleguen al navegador |
| `functions/api/copia.js` | la copia de seguridad por código |

## La copia de seguridad

La colección vive en el navegador. Eso basta y evita cuentas, pero tiene tres agujeros: cada aparato va por su cuenta, se pierde al borrar datos de navegación, y **Safari en iOS borra el almacenamiento a los siete días sin visitar el sitio**.

Por eso el sitio pide almacenamiento persistente al cargar, y ofrece guardar la colección bajo un **código de seis caracteres** (`functions/api/copia.js`, guardado en KV). Ese código no abre sobres: recupera la colección entera en otro aparato. Al restaurar se fusiona, no se pisa.

## El creador de tarjetas

`gui/index.html`, y en la web bajo `/imprimir/`. Doble clic, sin instalar nada y sin conexión.

Enseña la hoja A4 entera con las diez tarjetas. Pinchas una y la editas: las dos líneas, la pregunta, el capítulo y el verso. La URL se rellena sola y se puede escribir a mano; **Abrir y comprobar** la abre en otra pestaña.

**Guardar PDF para imprenta** abre el diálogo de impresión: *Guardar como PDF*, escala 100 %, sin «ajustar al papel».

## Las tarjetas

85 × 55 mm, tamaño de cartera, a una sola cara. Diez por hoja A4 con marcas de corte en los márgenes.

Delante van dos cosas: la pregunta y el código. Sin explicación, sin nombres que haya que conocer de antes y sin texto debajo del QR.

**El código lleva al sobre**, no al verso: la tarjeta es una invitación al juego, y quien escanea contesta, lee y se lo queda.

Se generan con corrección de error M, no H: con H salen más densos y las celdas se quedan pequeñas al imprimir. Con `qr.vedicvault.org/7` son 33 módulos, y a 30 mm dan 0,91 mm por celda. El generador avisa si alguna baja de 0,5 mm, que es donde un móvil empieza a fallar con luz de interior.

Sin sangrado: el fondo es blanco y ningún elemento llega al borde.

Para repartir en la calle, cartulina de 300 g. En papel normal se dobla el primer día.

### Qué mandar a la imprenta

El **pliego A4**. Con la hoja ya imposada es un solo archivo: imprimen N copias y guillotinan. Que dentro haya diez diseños distintos o uno repetido les da igual, porque cobran por hojas y por cortes.

Mandar los diez sueltos suele salir más caro: algunas imprentas cobran preparación por diseño, y las webs de tarjetas cobran por diseño casi siempre.

## Regenerar

```bash
pip install segno weasyprint
python3 src/versos.py      # refresca los versos desde vedabase.cc
python3 src/build.py       # PDF de imprenta a dist/
```

## Los enlaces

Todo apunta a **vedabase.cc**, que sirve una página por verso montada en el servidor: `/es/bg/2/13/` es BG 2.13 y el código aterriza exactamente ahí.

Se descartó vedic-library porque no tiene página por verso —el verso es un ancla dentro del capítulo— y porque devuelve 200 a cualquier ruta, con lo que una URL inventada parece válida hasta que la abres.
