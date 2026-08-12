#!/usr/bin/env python3
"""Trae de vedabase.cc la traducción y el significado de cada verso.

Se ejecuta a mano cuando cambian las tarjetas. Escribe:
  data/versos.json          todo junto, para consultarlo
  web/versos/<cap>-<ver>.json  uno por verso, que es lo que pide la web

La extracción va por la estructura del HTML, no por longitudes ni por
palabras clave: vedabase envuelve cada pieza en su propio bloque
(av-translation, av-purport) y dentro separa el idioma principal
(dual-col-primary) del secundario. Así entra el significado entero, tenga
dos párrafos o cuarenta.

Uso:  python3 src/versos.py
"""

import html
import json
import re
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DATOS = RAIZ / "data"
WEB = RAIZ / "web" / "versos"


def pagina(url):
    peticion = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return urllib.request.urlopen(peticion).read().decode("utf-8", "replace")


def bloque(html_texto, clase):
    """Devuelve el contenido del primer <div class="clase">, con sus divs cerrados.

    Hay que contar aperturas y cierres: los bloques llevan divs dentro y un
    corte por el primer </div> se quedaría con el primer párrafo.
    """
    inicio = re.search(rf'<div[^>]*class="[^"]*\b{clase}\b[^"]*"[^>]*>', html_texto)
    if not inicio:
        return ""
    i = inicio.end()
    hondo = 1
    for etiqueta in re.finditer(r"<(/?)div\b[^>]*>", html_texto[i:]):
        hondo += -1 if etiqueta.group(1) else 1
        if hondo == 0:
            return html_texto[i:i + etiqueta.start()]
    return html_texto[i:]


def parrafos(trozo):
    """Cada div hoja del bloque es un párrafo. Se conserva el orden y no se filtra."""
    if not trozo:
        return []
    principal = bloque(trozo, "dual-col-primary") or trozo
    # Los párrafos son los divs sin divs dentro; si no hay, vale el bloque entero.
    hojas = re.findall(r"<div[^>]*>((?:(?!<div)[\s\S])*?)</div>", principal)
    if not hojas:
        hojas = [principal]
    salida = []
    for h in hojas:
        h = re.sub(r"<br\s*/?>", " ", h)
        texto = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", h))).strip()
        if texto:
            salida.append(texto)
    return salida


def main():
    cfg = json.loads((DATOS / "tarjetas.json").read_text())
    base = cfg["vedabase"]
    salida = {}

    for tarjeta in cfg["tarjetas"]:
        cap, ver = tarjeta["cap"], tarjeta["ver"]
        referencia = f"{cap}.{ver}"
        if referencia in salida:
            continue
        salida[referencia] = {}

        for idioma, cfg_idioma in cfg["idiomas"].items():
            url = f"{base}/{cfg_idioma['ruta']}/{cap}/{ver}/"
            bruto = pagina(url)

            traduccion = " ".join(parrafos(bloque(bruto, "av-translation")))
            significado = parrafos(bloque(bruto, "av-purport"))
            if not traduccion:
                raise SystemExit(f"Sin traducción en {url}")

            salida[referencia][idioma] = {
                "url": url,
                "traduccion": traduccion,
                "significado": significado,
            }
            letras = sum(len(p) for p in significado)
            print(f"  BG {referencia:<6} {idioma}  traducción {len(traduccion):>4}  "
                  f"significado {len(significado):>2} párr / {letras:>5} car")

    (DATOS / "versos.json").write_text(
        json.dumps(salida, ensure_ascii=False, indent=2) + "\n")

    WEB.mkdir(parents=True, exist_ok=True)
    for referencia, d in salida.items():
        (WEB / (referencia.replace(".", "-") + ".json")).write_text(
            json.dumps(d, ensure_ascii=False) + "\n")

    peso = sum(f.stat().st_size for f in WEB.glob("*.json"))
    print(f"\n{len(salida)} versos · {peso // 1024} KB en {WEB}")


if __name__ == "__main__":
    main()
