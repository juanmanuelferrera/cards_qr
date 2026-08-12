# cards_qr

Tarjetas de reparto con códigos QR: una pregunta corta delante, y dos códigos que llevan al *Bhagavad-gītā* completo y a un canto en sánscrito. Tamaño estándar de cartera, 85 × 55 mm, a una sola cara.

## Qué hay en `dist/`

| Fichero | Idioma | Qué es |
|---|---|---|
| `tarjetas-A4-imprenta.pdf` | Español | A4 con 10 tarjetas y marcas de corte |
| `tarjeta-1up-85x55.pdf` | Español | Una tarjeta a tamaño final |
| `cards-A4-print.pdf` | Inglés | A4 con 10 tarjetas y marcas de corte |
| `card-1up-85x55.pdf` | Inglés | Una tarjeta a tamaño final |

Cuál mandar a la imprenta depende de cómo cobren. **Por tarjeta**, manda el `1up`: ellos imponen el pliego, cortan a máquina y suele salir mejor y más barato en tiradas grandes. **Por hoja A4** o si lo imprimes tú, manda el pliego, que ya trae 10 por hoja y las marcas para guillotinar.

No lleva sangrado, y es correcto: el fondo es blanco y ningún elemento llega al borde, así que un corte desviado un milímetro no deja franja. Si la imprenta lo exige por norma, hay que regenerar con 3 mm y desplazar las marcas.

## Diseño

Una cara. A doble cara hay que cuadrar el reverso al imprimir, sale descentrado con facilidad, y mucha gente no le da la vuelta.

El texto es deliberadamente corto: una observación que el lector sabe que es cierta, una pregunta, y los dos códigos. Sin explicación intermedia, sin nombres propios que haya que conocer de antes, y sin prometer ningún resultado.

> De niño tenías otro cuerpo.
> Y sigues diciendo «yo».
> *¿Quién es ese?*

## Los códigos

Se generan con corrección de error **M** en lugar de H. Con H el código sale más denso y, a 17 mm impresos, las celdas quedan demasiado pequeñas para que un móvil las lea con comodidad. Con M y una URL corta salen 33 módulos, o sea **0,52 mm por celda**, que está por encima del umbral práctico.

Por eso las direcciones deben ser cortas. Una URL larga sube el código a 37 módulos y baja la celda a 0,41 mm, y ahí ya falla con poca luz.

Destinos actuales:

- `https://vedic-library.pages.dev/bg-es/` — *Bhagavad-gītā tal como es*
- `https://vedic-library.pages.dev/bg-en/` — *Bhagavad-gītā As It Is*
- `https://vedabase.cc/media/audio/bhajan.mp3` — canto en sánscrito, 20 min

## Regenerar

```bash
pip install segno weasyprint
python3 src/build.py
```

Todo se controla desde `src/build.py`: las URLs, los textos de cada idioma y las medidas de la imposición. Los PDF salen a `dist/` y las vistas previas en HTML a `preview/`.

Para cambiar un destino basta con editar la URL en el diccionario `IDIOMAS` y volver a ejecutar — el QR se regenera solo. Comprueba en la salida del script que el número de módulos no sube de 33.

## Nota sobre el papel

Para repartir en la calle, cartulina de 300 g. En papel normal la tarjeta se dobla el primer día y vuelve a ser un folleto, que es justo lo que se guarda menos.
