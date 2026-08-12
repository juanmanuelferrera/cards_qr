#!/usr/bin/env python3
"""Sirve web/ en local igual que lo hará Cloudflare Pages.

El servidor normal de Python devuelve 404 en rutas como /7, porque no existe
esa carpeta. Aquí se aplica la misma regla que hay en web/_redirects: lo que
no sea un archivo real se sirve como index.html y lo resuelve el JavaScript.

Uso:  python3 src/servir.py [puerto]
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent / "web"


class Servidor(SimpleHTTPRequestHandler):
    def send_head(self):
        pedido = (WEB / self.path.lstrip("/").split("?")[0]).resolve()
        es_archivo = pedido.is_file() or (pedido / "index.html").is_file()
        if not es_archivo and WEB in pedido.parents:
            self.path = "/index.html"
        return super().send_head()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *a):
        pass


def main():
    puerto = int(sys.argv[1]) if len(sys.argv) > 1 else 8899
    servidor = ThreadingHTTPServer(("", puerto), partial(Servidor, directory=str(WEB)))
    print(f"qrveda en http://localhost:{puerto}/   (Ctrl-C para parar)")
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print()


if __name__ == "__main__":
    main()
