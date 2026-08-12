#!/usr/bin/env python3
"""Genera las tarjetas QR listas para imprenta.

Salida en dist/:
  tarjetas-A4-imprenta.pdf   ES · A4 con 10 tarjetas y marcas de corte
  tarjeta-1up-85x55.pdf      ES · una tarjeta a tamaño final
  cards-A4-print.pdf         EN · A4 con 10 tarjetas y marcas de corte
  card-1up-85x55.pdf         EN · una tarjeta a tamaño final

Requisitos:  pip install segno weasyprint
Uso:         python3 src/build.py
"""

import io
from pathlib import Path

import segno
from weasyprint import HTML

RAIZ = Path(__file__).resolve().parent.parent
DIST = RAIZ / "dist"
PREVIEW = RAIZ / "preview"

# --- Tamaños de la tarjeta y de la imposición (mm) ---
ANCHO, ALTO = 85, 55          # tarjeta estándar
COLS, FILAS = 2, 5            # 10 por A4
MARGEN_X, MARGEN_Y = 10, 11   # margen de la retícula en A4
MARCA, SEPARACION = 4, 1.2    # largo de la marca de corte y su separación

AUDIO = "https://vedabase.cc/media/audio/bhajan.mp3"

IDIOMAS = {
    "es": {
        "lang": "es",
        "gita": "https://vedic-library.pages.dev/bg-es/",
        "titulo": "De ni&ntilde;o ten&iacute;as otro cuerpo.<br>"
                  "Y sigues diciendo &laquo;yo&raquo;.<br>"
                  '<span class="pregunta">&iquest;Qui&eacute;n es ese?</span>',
        "qr1_titulo": "Bhagavad-g&#299;t&#257;",
        "qr1_pie": "Leerlo gratis, en castellano",
        "qr2_titulo": "Canto s&aacute;nscrito",
        "qr2_pie": "20 minutos",
        "pliego": "tarjetas-A4-imprenta.pdf",
        "suelta": "tarjeta-1up-85x55.pdf",
    },
    "en": {
        "lang": "en",
        "gita": "https://vedic-library.pages.dev/bg-en/",
        "titulo": "As a child you had another body.<br>"
                  "And you still say &ldquo;I&rdquo;.<br>"
                  '<span class="pregunta">Who is that?</span>',
        "qr1_titulo": "Bhagavad-g&#299;t&#257;",
        "qr1_pie": "Read it free, in English",
        "qr2_titulo": "Sanskrit chant",
        "qr2_pie": "20 minutes",
        "pliego": "cards-A4-print.pdf",
        "suelta": "card-1up-85x55.pdf",
    },
}

ESTILO = """
  :root{ --tinta:#171512; --suave:#6a6259; --acento:#8a6d3b; }
  *{ box-sizing:border-box; margin:0; padding:0; }
  body{
    font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Times New Roman",serif;
    color:var(--tinta); background:#fff;
  }
  .tarjeta{
    width:%(ancho)smm; height:%(alto)smm; padding:5mm 5.5mm 4.5mm;
    display:block; overflow:hidden; background:#fff;
  }
  .titulo{ font-size:11.4pt; line-height:1.24; letter-spacing:-.005em; }
  .pregunta{ font-style:italic; color:var(--acento); }
  .codigos{ margin-top:4mm; display:grid; grid-template-columns:1fr 1fr; gap:5mm; align-items:end; }
  .codigo{ text-align:center; min-width:0; }
  .codigo svg{ width:17mm; height:17mm; display:block; margin:0 auto 1.2mm; }
  .codigo .que{ font-size:7pt; font-weight:600; letter-spacing:.03em; line-height:1.15; white-space:nowrap; }
  .codigo .sub{ font-size:6pt; color:var(--suave); margin-top:.5mm; line-height:1.2; }
""" % {"ancho": ANCHO, "alto": ALTO}


def qr_svg(url):
    """QR en SVG inline. Corrección M: menos módulos, celdas más grandes al imprimir."""
    codigo = segno.make(url, error="m")
    buffer = io.BytesIO()
    codigo.save(buffer, kind="svg", scale=1, border=2, svgclass=None, lineclass=None,
                omitsize=True, dark="#111", xmldecl=False, svgns=True)
    return buffer.getvalue().decode().strip(), codigo.symbol_size(scale=1, border=2)[0]


def tarjeta_html(cfg):
    qr_gita, mod_gita = qr_svg(cfg["gita"])
    qr_audio, mod_audio = qr_svg(AUDIO)
    print(f"  {cfg['lang']}: gita {mod_gita} módulos ({17/mod_gita:.2f} mm/módulo) · "
          f"audio {mod_audio} módulos ({17/mod_audio:.2f} mm/módulo)")
    return f"""<div class="tarjeta">
  <div class="titulo">{cfg['titulo']}</div>
  <div class="codigos">
    <div class="codigo">{qr_gita}<div class="que">{cfg['qr1_titulo']}</div><div class="sub">{cfg['qr1_pie']}</div></div>
    <div class="codigo">{qr_audio}<div class="que">{cfg['qr2_titulo']}</div><div class="sub">{cfg['qr2_pie']}</div></div>
  </div>
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


def construir(cfg):
    tarjeta = tarjeta_html(cfg)

    suelta = f"""<!doctype html><html lang="{cfg['lang']}"><head><meta charset="utf-8">
<title>{ANCHO}x{ALTO}</title><style>
@page {{ size: {ANCHO}mm {ALTO}mm; margin:0; }}
{ESTILO}
</style></head><body>{tarjeta}</body></html>"""
    (PREVIEW / f"tarjeta-{cfg['lang']}.html").write_text(suelta)
    HTML(string=suelta).write_pdf(DIST / cfg["suelta"])

    pliego = f"""<!doctype html><html lang="{cfg['lang']}"><head><meta charset="utf-8">
<title>A4</title><style>
@page {{ size: A4 portrait; margin:0; }}
{ESTILO}
.hoja{{ position:relative; width:210mm; height:297mm; }}
.rejilla{{
  position:absolute; left:{MARGEN_X}mm; top:{MARGEN_Y}mm;
  display:grid; grid-template-columns:repeat({COLS},{ANCHO}mm); grid-template-rows:repeat({FILAS},{ALTO}mm);
}}
.m{{ position:absolute; background:#000; }}
.m.v{{ width:.25pt; height:{MARCA}mm; }}
.m.h{{ height:.25pt; width:{MARCA}mm; }}
</style></head><body>
<div class="hoja">
  <div class="rejilla">{tarjeta * (COLS * FILAS)}</div>
  {marcas_de_corte()}
</div>
</body></html>"""
    (PREVIEW / f"pliego-{cfg['lang']}.html").write_text(pliego)
    HTML(string=pliego).write_pdf(DIST / cfg["pliego"])


if __name__ == "__main__":
    DIST.mkdir(exist_ok=True)
    PREVIEW.mkdir(exist_ok=True)
    for cfg in IDIOMAS.values():
        construir(cfg)
    print(f"\nPDFs en {DIST}")
