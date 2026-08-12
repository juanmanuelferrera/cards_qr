/* Copias de seguridad por código.
 *
 * POST  /api/copia          guarda el avance y devuelve un código de seis
 *                           caracteres, o reescribe el que se le pase
 * GET   /api/copia?c=ABC123 devuelve el avance guardado bajo ese código
 *
 * Sin cuentas, sin email y sin contraseña. El código es la única llave, y
 * quien lo tenga ve lo que hay dentro: por eso se avisa en la página de que
 * ahí van las respuestas escritas.
 */

// Sin I, L, O, U ni números que se confundan al copiarlos a mano.
const LETRAS = "ABCDEFGHJKMNPQRSTVWXYZ23456789";
const LARGO = 6;
const TOPE = 64 * 1024;          // 64 KB por copia, de sobra para trece respuestas
const CADUCA = 60 * 60 * 24 * 730; // dos años sin tocarla

const responder = (datos, estado = 200) =>
  new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

function codigoNuevo() {
  const bytes = crypto.getRandomValues(new Uint8Array(LARGO));
  return Array.from(bytes, b => LETRAS[b % LETRAS.length]).join("");
}

const limpio = c => typeof c === "string" &&
  new RegExp(`^[${LETRAS}]{${LARGO}}$`).test(c.toUpperCase());

export async function onRequestGet({ request, env }) {
  const codigo = (new URL(request.url).searchParams.get("c") || "").toUpperCase();
  if (!limpio(codigo)) return responder({ error: "codigo" }, 400);

  const guardado = await env.COPIAS.get(codigo);
  if (!guardado) return responder({ error: "no existe" }, 404);

  // Volver a escribirla renueva la caducidad: una copia que se usa no expira.
  await env.COPIAS.put(codigo, guardado, { expirationTtl: CADUCA });
  return responder({ codigo, estado: JSON.parse(guardado) });
}

export async function onRequestPost({ request, env }) {
  let cuerpo;
  try { cuerpo = await request.json(); }
  catch (e) { return responder({ error: "json" }, 400); }

  if (!cuerpo || typeof cuerpo.estado !== "object" || !cuerpo.estado.progreso) {
    return responder({ error: "sin progreso" }, 400);
  }

  const texto = JSON.stringify(cuerpo.estado);
  if (texto.length > TOPE) return responder({ error: "demasiado grande" }, 413);

  let codigo = (cuerpo.codigo || "").toUpperCase();
  if (!limpio(codigo)) {
    // Código nuevo. Se comprueba que esté libre; con 30^6 combinaciones el
    // choque es improbable, pero comprobarlo cuesta una lectura.
    do { codigo = codigoNuevo(); } while (await env.COPIAS.get(codigo));
  }

  await env.COPIAS.put(codigo, texto, { expirationTtl: CADUCA });
  return responder({ codigo });
}
