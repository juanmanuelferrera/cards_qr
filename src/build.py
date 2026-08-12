#!/usr/bin/env python3
"""Genera las tarjetas listas para imprenta a partir de data/datos.json.

Una sola fuente de verdad: las preguntas, sus versos y sus claves salen del
mismo fichero que usa la web, así que no hay forma de que se desincronicen.

El código de cada tarjeta lleva a su sobre en qrveda —no al verso—, porque
la tarjeta es una invitación al juego: quien escanea contesta, lee y se lo
queda. Además la URL es más corta y el código sale menos denso.

Salida en dist/, un juego por idioma:
  tarjetas-A4-<idioma>.pdf   A4 con marcas de corte, tantas hojas como hagan falta
  tarjeta-1up-<idioma>.pdf   una página por pregunta, a tamaño final

Requisitos:  pip install segno weasyprint
Uso:         python3 src/build.py
"""

import io
import json
from pathlib import Path

import segno
from weasyprint import HTML

RAIZ = Path(__file__).resolve().parent.parent
DIST = RAIZ / "dist"
PREVIEW = RAIZ / "preview"

SITIO = "https://qr.vedicvault.org"

# --- Medidas (mm) ---
ANCHO, ALTO = 85, 55          # tarjeta estándar de cartera
QR = 30                       # lado del código impreso
COLS, FILAS = 2, 5            # 10 huecos por A4
MARGEN_X, MARGEN_Y = 10, 11
MARCA, SEPARACION = 4, 1.2    # marcas de corte: largo y separación

# Por debajo de 0,5 mm por celda un móvil empieza a fallar con luz de interior.
MODULO_MINIMO = 0.50

cfg = json.loads((RAIZ / "data" / "datos.json").read_text())

ESTILO = f"""
  :root{{ --tinta:#171512; --suave:#6a6259; --acento:#8a6d3b; }}
  *{{ box-sizing:border-box; margin:0; padding:0; }}
  body{{
    font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Times New Roman",serif;
    color:var(--tinta); background:#fff;
  }}
  .tarjeta{{
    width:{ANCHO}mm; height:{ALTO}mm; padding:4.5mm 5.5mm 3.5mm;
    display:block; overflow:hidden; background:#fff;
  }}
  .titulo{{ font-size:10.6pt; line-height:1.2; letter-spacing:-.005em; }}
  .pregunta{{ font-style:italic; color:var(--acento); }}
  .codigos{{ margin-top:2.5mm; text-align:center; }}
  .codigo{{ display:inline-block; }}
  .codigo svg{{ width:{QR}mm; height:{QR}mm; display:block; margin:0 auto; }}
"""

_cache = {}


def qr_svg(url):
    """QR en SVG inline. Corrección M: menos módulos, celdas más grandes al imprimir."""
    if url not in _cache:
        codigo = segno.make(url, error="m")
        buffer = io.BytesIO()
        codigo.save(buffer, kind="svg", scale=1, border=2, svgclass=None, lineclass=None,
                    omitsize=True, dark="#111", xmldecl=False, svgns=True)
        _cache[url] = (buffer.getvalue().decode().strip(),
                       codigo.symbol_size(scale=1, border=2)[0])
    return _cache[url]


def tarjeta_html(tarjeta, idioma):
    linea1, linea2, pregunta = tarjeta[idioma]
    url = f"{SITIO}/{tarjeta['id']}"
    codigo, modulos = qr_svg(url)
    celda = QR / modulos
    if celda < MODULO_MINIMO:
        print(f"  AVISO  {celda:.2f} mm/celda ({modulos} módulos) en {url}")
    return f"""<div class="tarjeta">
  <div class="titulo">{linea1}<br>{linea2}<br><span class="pregunta">{pregunta}</span></div>
  <div class="codigos"><div class="codigo">{codigo}</div></div>
</div>"""


def marcas_de_corte():
    """Marcas en los márgenes, nunca sobre la tarjeta."""
    piezas = []
    for c in range(COLS + 1):
        x = MARGEN_X + c * ANCHO
        piezas.append(f'<div class="m v" style="left:{x}mm;top:{MARGEN_Y - SEPARACION - MARCA}mm"></div>')
        piezas.append(f'<div class="m v" style="left:{x}mm;top:{MARGEN_Y + FILAS * ALTO + SEPARACION}mm"></div>')
    for f in range(FILAS + 1):
        y = MARGEN_Y + f * ALTO
        piezas.append(f'<div class="m h" style="top:{y}mm;left:{MARGEN_X - SEPARACION - MARCA}mm"></div>')
        piezas.append(f'<div class="m h" style="top:{y}mm;left:{MARGEN_X + COLS * ANCHO + SEPARACION}mm"></div>')
    return "".join(piezas)


def construir(idioma):
    print(f"\n[{idioma}]")
    tarjetas = [tarjeta_html(t, idioma) for t in cfg["tarjetas"]]
    for t in cfg["tarjetas"]:
        print(f"  {t['id']:>2} · {t['clave']}  BG {t['cap']}.{t['ver']:<3} {t[idioma][2]}")

    suelta = f"""<!doctype html><html lang="{idioma}"><head><meta charset="utf-8">
<title>{ANCHO}x{ALTO} {idioma}</title><style>
@page {{ size: {ANCHO}mm {ALTO}mm; margin:0; }}
{ESTILO}
.tarjeta{{ page-break-after:always; }}
</style></head><body>{''.join(tarjetas)}</body></html>"""
    (PREVIEW / f"tarjeta-1up-{idioma}.html").write_text(suelta)
    HTML(string=suelta).write_pdf(DIST / f"tarjeta-1up-{idioma}.pdf")

    # Tantas hojas A4 como hagan falta. La última se completa girando por la
    # lista, para no mandar a imprenta media hoja en blanco.
    huecos = COLS * FILAS
    paginas = -(-len(tarjetas) // huecos)
    if paginas * huecos > len(tarjetas):
        repes = [cfg["tarjetas"][i % len(cfg["tarjetas"])]["id"]
                 for i in range(len(tarjetas), paginas * huecos)]
        print(f"  {len(tarjetas)} tarjetas en {paginas} hojas: se repiten {', '.join(repes)}")

    hojas = []
    for p in range(paginas):
        rejilla = "".join(tarjetas[(p * huecos + i) % len(tarjetas)] for i in range(huecos))
        hojas.append(f'<div class="hoja"><div class="rejilla">{rejilla}</div>{marcas_de_corte()}</div>')

    pliego = f"""<!doctype html><html lang="{idioma}"><head><meta charset="utf-8">
<title>A4 {idioma}</title><style>
@page {{ size: A4 portrait; margin:0; }}
{ESTILO}
.hoja{{ position:relative; width:210mm; height:297mm; page-break-after:always; }}
.hoja:last-child{{ page-break-after:auto; }}
.rejilla{{
  position:absolute; left:{MARGEN_X}mm; top:{MARGEN_Y}mm;
  display:grid; grid-template-columns:repeat({COLS},{ANCHO}mm); grid-template-rows:repeat({FILAS},{ALTO}mm);
}}
.m{{ position:absolute; background:#000; }}
.m.v{{ width:.25pt; height:{MARCA}mm; }}
.m.h{{ height:.25pt; width:{MARCA}mm; }}
</style></head><body>
{''.join(hojas)}
</body></html>"""
    (PREVIEW / f"pliego-{idioma}.html").write_text(pliego)
    HTML(string=pliego).write_pdf(DIST / f"tarjetas-A4-{idioma}.pdf")


if __name__ == "__main__":
    DIST.mkdir(exist_ok=True)
    PREVIEW.mkdir(exist_ok=True)
    ejemplo = f"{SITIO}/1"
    print(f"Los códigos llevan a {SITIO}/<sobre> — "
          f"{qr_svg(ejemplo)[1]} módulos, {QR / qr_svg(ejemplo)[1]:.2f} mm por celda a {QR} mm")
    for idioma in cfg["idiomas"]:
        construir(idioma)
    print(f"\nPDFs en {DIST}")
