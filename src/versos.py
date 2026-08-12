#!/usr/bin/env python3
"""Trae de vedabase.cc la traducción de cada verso y la guarda en data/versos.json.

Se ejecuta a mano cuando cambian las tarjetas. El sitio se construye a partir
del caché, así que build_site.py no depende de la red.

Uso:  python3 src/versos.py
"""

import html
import json
import re
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DATOS = RAIZ / "data"

MARCA = {"es": "Traducción", "en": "Translation"}
FIN = {"es": "Significado", "en": "Purport"}


def pagina(url):
    peticion = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return urllib.request.urlopen(peticion).read().decode("utf-8", "replace")


def limpiar(t):
    t = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", t, flags=re.S | re.I)
    t = re.sub(r"<[^>]+>", "\n", t)
    return re.sub(r"[ \t]+", " ", html.unescape(t))


def traduccion(bruto, idioma):
    m = re.search(rf"{MARCA[idioma]}\s*(.{{0,1200}}?)\s*{FIN[idioma]}", limpiar(bruto), re.S)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""


def clases(bruto):
    m = re.search(r"lectures on this verse\s*(\d+)", re.sub(r"\s+", " ", limpiar(bruto)))
    return int(m.group(1)) if m else 0


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
            texto = traduccion(bruto, idioma)
            if not texto:
                raise SystemExit(f"Sin traducción en {url}")
            salida[referencia][idioma] = {"url": url, "traduccion": texto}
            if idioma == "en":
                salida[referencia]["clases"] = clases(bruto)
            print(f"  BG {referencia:<6} {idioma}  {len(texto):>4} car")

    (DATOS / "versos.json").write_text(
        json.dumps(salida, ensure_ascii=False, indent=2) + "\n")
    print(f"\n{len(salida)} versos en {DATOS / 'versos.json'}")


if __name__ == "__main__":
    main()
