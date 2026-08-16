/* Cada sobre, con su propia vista previa.
 *
 * El sitio se monta en el navegador, y WhatsApp o Telegram no ejecutan
 * JavaScript: al compartir /9 enseñaban la descripción genérica del sitio.
 * Aquí se sirve el mismo armazón con las etiquetas de ese sobre dentro, así
 * que el enlace llega con su pregunta.
 *
 * Y de paso, lo que no es un sobre devuelve 404 de verdad.
 */

const SITIO = "https://qr.vedicvault.org";

const escapar = t => String(t)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function idioma(request) {
  const quiere = (request.headers.get("accept-language") || "").toLowerCase();
  return quiere.startsWith("en") ? "en" : "es";
}

export async function onRequestGet(context) {
  const { request, env, params } = context;
  const id = String(params.sobre || "");

  // Un sobre es un número del 1 al 13. Lo demás puede ser un archivo de
  // verdad —datos.json, el manifiesto, un icono—, así que primero se mira si
  // existe y solo se responde 404 cuando no hay nada.
  if (!/^\d{1,2}$/.test(id) || +id < 1 || +id > 13) {
    const archivo = await env.ASSETS.fetch(request);
    if (archivo.status !== 404) return archivo;
    const fuera = await env.ASSETS.fetch(new URL("/404.html", request.url));
    return new Response(await fuera.text(), {
      status: 404,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const sobre = await env.ASSETS.fetch(new URL(`/sobres/${id}.json`, request.url));
  if (!sobre.ok) return env.ASSETS.fetch(new URL("/index.html", request.url));

  const datos = await sobre.json();
  const lang = idioma(request);
  const [l1, l2, pregunta] = datos[lang];

  const titulo = `${pregunta} — qrveda`;
  const resumen = `${l1} ${l2}`;

  const armazon = await env.ASSETS.fetch(new URL("/index.html", request.url));
  let html = await armazon.text();

  html = html
    .replace("<title>qrveda</title>", `<title>${escapar(titulo)}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      [
        `<meta name="description" content="${escapar(resumen)}">`,
        `<meta property="og:type" content="article">`,
        `<meta property="og:title" content="${escapar(pregunta)}">`,
        `<meta property="og:description" content="${escapar(resumen)}">`,
        `<meta property="og:url" content="${SITIO}/${id}">`,
        `<meta property="og:site_name" content="qrveda">`,
        `<meta name="twitter:card" content="summary">`,
        `<meta name="twitter:title" content="${escapar(pregunta)}">`,
        `<meta name="twitter:description" content="${escapar(resumen)}">`,
      ].join("\n"));

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
  });
}
