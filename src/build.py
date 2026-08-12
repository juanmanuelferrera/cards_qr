#!/usr/bin/env python3
"""Genera las tarjetas QR listas para imprenta.

Diez preguntas por idioma. Un solo código por tarjeta, que lleva al verso del
Bhagavad-gītā que responde a su pregunta.

Salida en dist/, un juego por idioma:
  tarjetas-A4-<idioma>.pdf   A4 con 10 tarjetas y marcas de corte
  tarjeta-1up-<idioma>.pdf   una página por pregunta, a tamaño final

Añadir un idioma es añadir un bloque a IDIOMAS. Nada más.

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

# --- Medidas (mm) ---
ANCHO, ALTO = 85, 55          # tarjeta estándar de cartera
QR = 30                       # lado del código impreso
COLS, FILAS = 2, 5            # 10 huecos por A4
MARGEN_X, MARGEN_Y = 10, 11
MARCA, SEPARACION = 4, 1.2    # marcas de corte: largo y separación

# vedabase.cc sirve una página por verso, montada en el servidor: /es/bg/2/13/
# es BG 2.13. El QR aterriza exactamente ahí. Son 33 módulos; a 23,5 mm salen
# 0,71 mm por celda. Por debajo de 0,5 un móvil falla con luz de interior.
MODULO_MINIMO = 0.50

BASE = "https://vedabase.cc"

# Cada pregunta: (línea 1, línea 2, cierre, capítulo, verso)
IDIOMAS = {
    "es": {
        "html_lang": "es",
        "ruta": "es/bg",
        "pie_gita": "Leerlo gratis, en castellano",
        "preguntas": [
            ("De ni&ntilde;o ten&iacute;as otro cuerpo.", "Y sigues diciendo &laquo;yo&raquo;.", "&iquest;Qui&eacute;n es ese?", 2, 13),
            ("Llevas a&ntilde;os intentando", "controlar tu cabeza.", "&iquest;Qui&eacute;n manda ah&iacute;?", 6, 35),
            ("Consigues lo que quer&iacute;as.", "A los tres d&iacute;as, otra cosa.", "&iquest;Por qu&eacute; nunca basta?", 3, 39),
            ("Haces el trabajo.", "El resultado no depende de ti.", "&iquest;Entonces qu&eacute; es tuyo?", 2, 47),
            ("Tu vida tendr&aacute; un", "&uacute;ltimo pensamiento.", "&iquest;Cu&aacute;l quieres que sea?", 8, 6),
            ("Todo lo que ves hoy", "habr&aacute; desaparecido.", "&iquest;Y t&uacute;?", 11, 32),
            ("Algo dentro de ti", "te observa pensar.", "&iquest;Qui&eacute;n es?", 13, 23),
            ("Le tienes miedo a morir.", "Pero eso le pasa al cuerpo.", "&iquest;Y a ti?", 2, 20),
            ("Quieres algo.", "Acabas enfadado.", "&iquest;C&oacute;mo se llega ah&iacute;?", 2, 62),
            ("Lo que ayer te dio placer,", "hoy te pasa factura.", "&iquest;Por qu&eacute; acaba siempre igual?", 18, 38),
            ("Es la &uacute;nica cita", "que no vas a poder cambiar.", "&iquest;Qu&eacute; pasa cuando mueres?", 15, 8),
            ("Le pasan cosas malas", "a la gente buena.", "&iquest;Por qu&eacute;?", 13, 21),
            ("Ya no te habla como antes.", "T&uacute; tampoco.", "&iquest;Por qu&eacute; tu mujer te odia?", 3, 39),
        ],
    },
    "en": {
        "html_lang": "en",
        "ruta": "en/bg",
        "pie_gita": "Read it free, in English",
        "preguntas": [
            ("As a child you had another body.", "And you still say &ldquo;I&rdquo;.", "Who is that?", 2, 13),
            ("You&rsquo;ve spent years trying", "to control your mind.", "Who&rsquo;s winning?", 6, 35),
            ("You get what you wanted.", "Three days later, you want more.", "Why is it never enough?", 3, 39),
            ("You do the work.", "The result isn&rsquo;t up to you.", "So what is yours?", 2, 47),
            ("Your life will have", "a last thought.", "Which one do you want?", 8, 6),
            ("Everything you see today", "will be gone.", "And you?", 11, 32),
            ("Something in you", "watches you think.", "Who is it?", 13, 23),
            ("You&rsquo;re afraid to die.", "But that happens to the body.", "What about you?", 2, 20),
            ("You want something.", "You end up angry.", "How did that happen?", 2, 62),
            ("What gave you pleasure once", "costs you now.", "Why does it always end the same?", 18, 38),
            ("It&rsquo;s the one appointment", "you can&rsquo;t reschedule.", "What happens when you die?", 15, 8),
            ("Bad things happen", "to good people.", "Why?", 13, 21),
            ("She doesn&rsquo;t talk to you like before.", "Neither do you.", "Why does your wife hate you?", 3, 39),
        ],
    },
}

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
  .codigos{{ margin-top:3mm; text-align:center; }}
  .codigo{{ display:inline-block; text-align:center; }}
  .codigo svg{{ width:{QR}mm; height:{QR}mm; display:block; margin:0 auto 1mm; }}
  .codigo .que{{ font-size:6.8pt; font-weight:600; letter-spacing:.03em; line-height:1.12; white-space:nowrap; }}
  .codigo .sub{{ font-size:5.8pt; color:var(--suave); margin-top:.4mm; line-height:1.15; }}
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


def comprobar(url, modulos):
    celda = QR / modulos
    if celda < MODULO_MINIMO:
        print(f"  AVISO  {celda:.2f} mm/celda ({modulos} módulos) — agranda el QR o acorta {url}")
    return celda


def tarjeta_html(cfg, pregunta):
    linea1, linea2, cierre, capitulo, verso = pregunta
    url = f"{BASE}/{cfg['ruta']}/{capitulo}/{verso}/"
    qr_gita, mod_gita = qr_svg(url)
    comprobar(url, mod_gita)
    return f"""<div class="tarjeta">
  <div class="titulo">{linea1}<br>{linea2}<br><span class="pregunta">{cierre}</span></div>
  <div class="codigos">
    <div class="codigo">{qr_gita}</div>
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


def construir(idioma, cfg):
    print(f"\n[{idioma}]")
    tarjetas = [tarjeta_html(cfg, p) for p in cfg["preguntas"]]
    for p in cfg["preguntas"]:
        print(f"  BG {p[3]}.{p[4]:<3} {p[2]}")

    # Una página por pregunta, a tamaño final: para imprentas que cobran por tarjeta.
    suelta = f"""<!doctype html><html lang="{cfg['html_lang']}"><head><meta charset="utf-8">
<title>{ANCHO}x{ALTO} {idioma}</title><style>
@page {{ size: {ANCHO}mm {ALTO}mm; margin:0; }}
{ESTILO}
.tarjeta{{ page-break-after:always; }}
</style></head><body>{''.join(tarjetas)}</body></html>"""
    (PREVIEW / f"tarjeta-1up-{idioma}.html").write_text(suelta)
    HTML(string=suelta).write_pdf(DIST / f"tarjeta-1up-{idioma}.pdf")

    # Pliego A4: tantas páginas como hagan falta. La última se completa girando
    # por la lista, para no mandar a imprenta media hoja en blanco.
    huecos = COLS * FILAS
    paginas = -(-len(tarjetas) // huecos)
    total = paginas * huecos
    if total > len(tarjetas):
        repes = [cfg["preguntas"][i % len(cfg["preguntas"])][2] for i in range(len(tarjetas), total)]
        print(f"  {len(tarjetas)} preguntas en {paginas} hoja(s): se repiten {', '.join(repes)}")
    hojas = []
    for p in range(paginas):
        rejilla = "".join(tarjetas[(p * huecos + i) % len(tarjetas)] for i in range(huecos))
        hojas.append(f'<div class="hoja"><div class="rejilla">{rejilla}</div>{marcas_de_corte()}</div>')

    pliego = f"""<!doctype html><html lang="{cfg['html_lang']}"><head><meta charset="utf-8">
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
    for idioma, cfg in IDIOMAS.items():
        construir(idioma, cfg)
    print(f"\nPDFs en {DIST}")
