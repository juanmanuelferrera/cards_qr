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

La URL de un verso ocupa 37 módulos, así que el QR va a **23,5 mm** para dar 0,64 mm por celda. Con menos de 0,5 mm un móvil empieza a fallar con luz de interior. El script comprueba esa proporción en cada generación y avisa si se queda corta.

Se generan con corrección de error **M**, no H: con H el código sale más denso y las celdas se quedan pequeñas al imprimir.

Destinos: `vedic-library.pages.dev/bg-<idioma>/<capítulo>/<verso>/` y `vedabase.cc/media/audio/bhajan.mp3`.

## Añadir un idioma

Un bloque en `IDIOMAS`, dentro de `src/build.py`:

```python
"pt": {
    "html_lang": "pt",
    "ruta": "bg-pt",                      # ruta en vedic-library
    "pie_gita": "Leia grátis, em português",
    "titulo_audio": "Canto em sânscrito",
    "pie_audio": "20 minutos",
    "preguntas": [
        ("linha 1", "linha 2", "pergunta?", 2, 13),   # capítulo, verso
        ...
    ],
},
```

Los PDF salen solos, nombrados por idioma. Comprueba antes que la ruta existe:

```bash
curl -o /dev/null -w "%{http_code}\n" https://vedic-library.pages.dev/bg-pt/2/13/
```

## Editor en el navegador

`gui/index.html` — ábrelo con doble clic. No hay que instalar nada, no necesita conexión y funciona en cualquier ordenador.

Muestra la hoja A4 entera con las diez tarjetas. Pinchas una y la editas en el panel de la izquierda: las dos líneas, la pregunta, el capítulo y el verso. El QR se regenera solo y avisa en rojo si las celdas bajan de 0,5 mm, que es donde un móvil empieza a fallar.

Zoom con los botones de la barra, o **Ajustar** para ver la hoja completa. Flechas ← → para saltar de tarjeta.

**Guardar PDF para imprenta** abre el diálogo de impresión: elige *Guardar como PDF*, escala **100 %** y sin «ajustar al papel». Sale un A4 vectorial exacto, con sus marcas de corte, listo para mandar.

Lo que edites se guarda en el propio navegador. Con **Guardar .json** te lo llevas a otro ordenador, y con **Copiar para build.py** pegas las diez preguntas en el script si prefieres generarlas desde la terminal.

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
