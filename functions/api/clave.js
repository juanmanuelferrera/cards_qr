/* Comprobación de claves.
 *
 * GET /api/clave?c=EBHN  ->  { id: "1" }  o  404
 *
 * Las claves no viajan al navegador: se calculan aquí con el mismo hash que
 * usa el generador de tarjetas, así que no hay lista que filtrar ni fichero
 * que espiar. Quien quiera abrir un sobre necesita la clave de verdad.
 */

const LETRAS = "ABCDEFGHJKMNPQRSTVWXYZ23456789";  // sin I, L, O ni U
const LARGO = 4;
const SOBRES = 13;

const responder = (datos, estado = 200) =>
  new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

async function claveDe(id) {
  const bytes = new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode("qrveda:" + id)));
  return Array.from(bytes.slice(0, LARGO), b => LETRAS[b % LETRAS.length]).join("");
}

export async function onRequestGet({ request }) {
  const pedida = (new URL(request.url).searchParams.get("c") || "").toUpperCase();
  if (!new RegExp(`^[${LETRAS}]{${LARGO}}$`).test(pedida)) {
    return responder({ error: "formato" }, 400);
  }

  for (let n = 1; n <= SOBRES; n++) {
    if (await claveDe(String(n)) === pedida) return responder({ id: String(n) });
  }
  return responder({ error: "no existe" }, 404);
}
