# cards_qr

Tarjetas de reparto con códigos QR. Delante, una observación corta y una pregunta. Detrás del código, el verso del *Bhagavad-gītā* que la responde. Tamaño estándar de cartera, 85 × 55 mm, a una sola cara.

**Diez preguntas distintas por idioma**, cada una enlazada a su verso.

## Las diez

| Pregunta | Verso |
|---|---|
| ¿Quién es ese? — *De niño tenías otro cuerpo. Y sigues diciendo «yo».* | BG 2.13 |
| ¿Quién manda ahí? — *Llevas años intentando controlar tu cabeza.* | BG 6.35 |
| ¿Por qué nunca basta? — *Consigues lo que querías. A los tres días, otra cosa.* | BG 3.39 |
| ¿Entonces qué es tuyo? — *Haces el trabajo. El resultado no depende de ti.* | BG 2.47 |
| ¿Cuál quieres que sea? — *Tu vida tendrá un último pensamiento.* | BG 8.6 |
| ¿Y tú? — *Todo lo que ves hoy habrá desaparecido.* | BG 11.32 |
| ¿Quién es? — *Algo dentro de ti te observa pensar.* | BG 13.23 |
| ¿Y a ti? — *Le tienes miedo a morir. Pero eso le pasa al cuerpo.* | BG 2.20 |
| ¿Cómo se llega ahí? — *Quieres algo. Acabas enfadado.* | BG 2.62 |
| ¿Por qué acaba siempre igual? — *Lo que ayer te dio placer, hoy te pasa factura.* | BG 18.38 |

Ninguna promete un resultado ni pide creer nada. Todas parten de algo que el lector sabe que es cierto.

Cuidado con la de BG 13.23: la respuesta no es «ese observador eres tú», que es monismo. El verso dice que en el cuerpo hay **alguien más**.

## Qué hay en `dist/`

| Fichero | Qué es |
|---|---|
| `tarjetas-A4-es.pdf` · `tarjetas-A4-en.pdf` | A4 con 10 tarjetas y marcas de corte |
| `tarjeta-1up-es.pdf` · `tarjeta-1up-en.pdf` | Diez páginas de 85 × 55 mm, una por pregunta |

Manda el **pliego A4**. Con la hoja ya imposada, para la imprenta es un solo archivo: imprimen N copias y guillotinan. Que dentro haya diez diseños distintos o uno repetido diez veces les da igual — cobran por hojas impresas y por cortes, no por diseños.

Mandar los diez sueltos puede salir más caro: algunas imprentas cobran preparación por diseño, y las webs de tarjetas suelen cobrar **por diseño**, con lo que diez diseños son diez pedidos. El `1up` está ahí por si te lo piden expresamente.

Diez preguntas y diez huecos: el pliego sale sin repeticiones.

No lleva sangrado, y es correcto: el fondo es blanco y ningún elemento llega al borde, así que un corte desviado un milímetro no deja franja.

## Los códigos

Cada tarjeta enlaza a **su verso**, no al libro entero: quien escanea cae en la respuesta, no en un índice.

La URL de un verso ocupa 33 módulos, así que el QR a **23,5 mm** da 0,71 mm por celda. Con menos de 0,5 mm un móvil empieza a fallar con luz de interior. El script comprueba esa proporción en cada generación y avisa si se queda corta.

Se generan con corrección de error **M**, no H: con H el código sale más denso y las celdas se quedan pequeñas al imprimir.

Los enlaces van a **vedabase.cc**, que sirve una página por verso montada en el servidor: `/es/bg/2/13/` es BG 2.13, y el código aterriza exactamente ahí. El título de la página es el propio verso.

Se descartó vedic-library porque no tiene página por verso —el verso es un ancla dentro del capítulo y la navegación va capítulo a capítulo— y porque devuelve 200 a cualquier ruta, con lo que una URL inventada parece válida hasta que la abres.

Destinos: `vedabase.cc/<idioma>/bg/<capítulo>/<verso>/` y `vedabase.cc/media/audio/bhajan.mp3`.

## Añadir un idioma

Un bloque en `IDIOMAS`, dentro de `src/build.py`:

```python
"pt": {
    "html_lang": "pt",
    "ruta": "pt/bg",                      # idioma y libro en vedabase.cc
    "pie_gita": "Leia grátis, em português",
    "titulo_audio": "Canto em sânscrito",
    "pie_audio": "20 minutos",
    "preguntas": [
        ("linha 1", "linha 2", "pergunta?", 2, 13),   # capítulo, verso
        ...
    ],
},
```

Los PDF salen solos, nombrados por idioma. Comprueba antes que el idioma existe y que la página trae el verso:

```bash
curl -sL https://vedabase.cc/pt/bg/2/13/ | grep -o '<title>[^<]*'
```

## Editor en el navegador

`gui/index.html` — doble clic y ya está. No hay que instalar nada, no necesita conexión y funciona en cualquier ordenador.

### Cómo va

A la derecha se ve **la hoja A4 entera**, tal como saldrá impresa, con las diez tarjetas y sus marcas de corte. Pinchas una y se edita en el panel de la izquierda. La seleccionada queda marcada y cada hueco lleva su número en la esquina.

Se edita: las dos líneas, la pregunta, el capítulo y el verso.

- **Zoom** con − y +, **Ajustar** para ver la hoja completa, **100 %** para verla a tamaño real.
- **Flechas ← →** saltan de tarjeta sin tocar el ratón.
- **Copiar a todas** pone la tarjeta actual en los diez huecos, por si quieres una tirada de diez iguales.

### El campo de la URL

Se rellena solo al cambiar capítulo o verso (`vedabase.cc/es/bg/2/13/`). Si escribes encima, la etiqueta pasa a *escrita a mano* en rojo y esa tarjeta deja de seguir la fórmula; **Recalcular** la devuelve.

**Abrir y comprobar** abre esa dirección en otra pestaña. Merece la pena mirarlo antes de mandar nada a imprenta.

Debajo va el diagnóstico del código: milímetros por celda y número de módulos, en rojo si baja de 0,5 mm.

### Sacar el PDF

**Guardar PDF para imprenta** abre el diálogo de impresión. Elige *Guardar como PDF*, escala **100 %** y desactiva «ajustar al papel». Sale un A4 vectorial exacto, idéntico al que produce el script.

No hay botón que se salte ese diálogo, y es a propósito: el PDF del navegador es vectorial de verdad, mientras que una librería que lo exportara por su cuenta acabaría rasterizando el texto o moviendo las medidas un milímetro.

### Guardar el trabajo

Lo que edites se queda en el navegador. **Guardar .json** para llevártelo a otro ordenador, y **Copiar para build.py** te pone las diez preguntas con el formato del script, por si prefieres la terminal.

## Regenerar desde la terminal

```bash
pip install segno weasyprint
python3 src/build.py
```

Los PDF salen a `dist/` y las vistas previas en HTML a `preview/`. Da igual usar el editor o el script: producen la misma tarjeta con las mismas medidas.

## Diseño

Una cara. A doble cara hay que cuadrar el reverso al imprimir, sale descentrado con facilidad, y mucha gente no le da la vuelta.

Sin explicación intermedia, sin nombres propios que haya que conocer de antes. La tarjeta solo tiene que conseguir que escaneen; el contexto ya está al otro lado.

Para repartir en la calle, cartulina de 300 g. En papel normal se dobla el primer día y vuelve a ser un folleto, que es lo que menos se guarda.
