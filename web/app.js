/* qrveda — html y javascript planos, sin dependencias.
   Lo que colecciona cada visitante vive en su navegador: sin cuentas,
   sin servidor y sin analítica. */
"use strict";

const CLAVE = "qrveda";
const DIA = 86400000;

const T = {
  es: {
    imprimir: "Imprime las tuyas",
    fuente: "Versos y significados en",
    hoy: "La carta de hoy",
    ver: "Descubrirla",
    leer: "Leerlo entero en vedabase",
    clases: "Prabhupāda habla de este verso",
    compartir: "Mandársela a alguien",
    copiado: "Copiado",
    coleccion: "Las trece",
    encontradas: "Has encontrado {n} de {total}",
    racha: "{n} días seguidos",
    volver: "Volver",
    intro: "Trece preguntas. Cada una tiene su respuesta en un verso.",
    intro2: "Las que te faltan están en las tarjetas de papel. Hay que encontrarlas.",
    imprimir_larga: "Puedes imprimir las tuyas y repartirlas.",
    codigo: "Su código",
    svg: "Vector (camisetas)",
    png: "Imagen grande",
    copiar: "Copiar enlace",
    consejo: "Para camisetas, a la espalda y de 8 a 10 cm. Oscuro sobre tela clara y sin arrugas."
  },
  en: {
    imprimir: "Print your own",
    fuente: "Verses and purports on",
    hoy: "Today's card",
    ver: "Uncover it",
    leer: "Read it whole on vedabase",
    clases: "Prabhupāda speaks on this verse",
    compartir: "Send it to someone",
    copiado: "Copied",
    coleccion: "The thirteen",
    encontradas: "You've found {n} of {total}",
    racha: "{n} days in a row",
    volver: "Back",
    intro: "Thirteen questions. Each one is answered by a verse.",
    intro2: "The ones you're missing are on the paper cards. You have to find them.",
    imprimir_larga: "You can print your own and hand them out.",
    codigo: "Its code",
    svg: "Vector (for shirts)",
    png: "Large image",
    copiar: "Copy link",
    consejo: "For shirts, put it on the back, 8 to 10 cm. Dark on light fabric, and flat."
  }
};

let datos = null;
let idioma = "es";
let estado = { halladas: [], racha: 0, ultimoDia: 0 };

/* ---------------- Guardado ---------------- */
function leer() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { return {}; }
}
function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) {}
}

/* ---------------- Utilidades ---------------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
const t = k => T[idioma][k];
const diaDeHoy = () => Math.floor(Date.now() / DIA);
const cartaDelDia = () => datos.tarjetas[diaDeHoy() % datos.tarjetas.length];
const buscar = id => datos.tarjetas.find(c => c.id === id);
const hallada = id => estado.halladas.includes(id);
const enlaceCarta = id => location.origin + "/" + id;

function marcar(id) {
  if (!hallada(id)) { estado.halladas.push(id); guardar(); }
}

/* ---------------- El código ---------------- */
function svgDelCodigo(texto, tinta) {
  const q = qrcode(0, "M");
  q.addData(texto);
  q.make();
  const n = q.getModuleCount(), borde = 2, lado = n + borde * 2;
  let d = "";
  for (let f = 0; f < n; f++)
    for (let c = 0; c < n; c++)
      if (q.isDark(f, c)) d += `M${c + borde} ${f + borde}h1v1h-1z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" ` +
         `shape-rendering="crispEdges"><rect width="${lado}" height="${lado}" fill="#fff"/>` +
         `<path fill="${tinta}" d="${d}"/></svg>`;
}

function bajar(blob, nombre) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nombre;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function bajarSvg(url, id) {
  bajar(new Blob([svgDelCodigo(url, "#000")], { type: "image/svg+xml" }), `qrveda-${id}.svg`);
}

// PNG grande: el vector vale para casi todo, pero algunas imprentas de
// camisetas solo aceptan mapa de bits.
function bajarPng(url, id, px) {
  const svg = svgDelCodigo(url, "#000");
  const img = new Image();
  img.onload = function () {
    const c = document.createElement("canvas");
    c.width = c.height = px;
    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, px, px);
    ctx.drawImage(img, 0, 0, px, px);
    c.toBlob(b => bajar(b, `qrveda-${id}-${px}px.png`), "image/png");
  };
  img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

/* ---------------- Piezas ---------------- */
function cara(c) {
  const [l1, l2, preg] = c[idioma];
  return `<div class="cara">
    <p class="frase">${esc(l1)}<br>${esc(l2)}</p>
    <p class="pregunta">${esc(preg)}</p>
  </div>`;
}

function malla() {
  const hoy = cartaDelDia().id;
  const piezas = datos.tarjetas.map(c => {
    const abierta = hallada(c.id);
    const clases = ["mini", abierta ? "hallada" : "", c.id === hoy ? "hoy" : ""].join(" ");
    const dentro = abierta
      ? `<span class="preg">${esc(c[idioma][2])}</span>`
      : `<span class="sello">◇</span>`;
    return `<a class="${clases}" href="/${c.id}">${dentro}</a>`;
  }).join("");

  const n = estado.halladas.length;
  return `<section class="coleccion">
    <h2>${t("coleccion")}</h2>
    <p class="marcador">${t("encontradas").replace("{n}", n).replace("{total}", datos.tarjetas.length)}</p>
    <div class="malla">${piezas}</div>
  </section>`;
}

/* ---------------- Vistas ---------------- */
function portada() {
  const c = cartaDelDia();
  const abierta = hallada(c.id);
  const racha = estado.racha > 1
    ? `<p class="racha">${t("racha").replace("{n}", estado.racha)}</p>` : "";

  const tarjeta = abierta
    ? `<a class="hoy-cara" href="/${c.id}">${cara(c)}</a>`
    : `<a class="hoy-cara tapada" href="/${c.id}">
         <p class="sello grande">◇</p>
         <p class="invita">${t("ver")}</p>
       </a>`;

  return `<section class="hoy">
    <h1>${t("hoy")}</h1>
    ${tarjeta}
    ${racha}
  </section>
  ${malla()}
  <section class="explica">
    <p>${t("intro")}</p>
    <p>${t("intro2")}</p>
    <p>${t("imprimir_larga")} <a href="/imprimir/">${t("imprimir")}</a>.</p>
  </section>`;
}

function carta(id) {
  const c = buscar(id);
  if (!c) return portada();
  marcar(id);

  const ref = `${c.cap}.${c.ver}`;
  const clases = c.clases
    ? `<a href="${esc(c.url[idioma])}">${t("clases")} — ${c.clases}</a>` : "";

  document.title = `${c[idioma][2]} — qrveda`;

  return `<section class="unacarta">
    ${cara(c)}
    <blockquote>
      <p>${esc(c.verso[idioma])}</p>
      <cite>Bhagavad-gītā ${ref}</cite>
    </blockquote>
    <div class="acciones">
      <a class="principal" href="${esc(c.url[idioma])}">${t("leer")}</a>
      ${clases}
      <button id="compartir">${t("compartir")}</button>
    </div>
    <div class="codigo">
      <h2>${t("codigo")}</h2>
      <div class="lienzo">${svgDelCodigo(enlaceCarta(c.id), "#111")}</div>
      <div class="menu">
        <button data-qr="svg">${t("svg")}</button>
        <button data-qr="png">${t("png")}</button>
        <button data-qr="copiar">${t("copiar")}</button>
        <a href="/imprimir/">${t("imprimir")}</a>
      </div>
      <p class="consejo">${t("consejo")}</p>
    </div>
  </section>
  ${malla()}`;
}

/* ---------------- Pintado ---------------- */
function pintar() {
  const id = location.pathname.replace(/\//g, "");
  document.getElementById("app").innerHTML = id ? carta(id) : portada();
  document.documentElement.lang = idioma;

  document.querySelectorAll("[data-t]").forEach(n => {
    n.textContent = n.dataset.t === "lema" ? datos.idiomas[idioma].lema : t(n.dataset.t);
  });
  document.getElementById("idioma").textContent = idioma === "es" ? "EN" : "ES";

  const boton = document.getElementById("compartir");
  if (boton) boton.addEventListener("click", compartir);

  document.querySelectorAll("[data-qr]").forEach(b => b.addEventListener("click", async () => {
    const id = location.pathname.replace(/\//g, "");
    const url = enlaceCarta(id);
    if (b.dataset.qr === "svg") return bajarSvg(url, id);
    if (b.dataset.qr === "png") return bajarPng(url, id, 2000);
    await navigator.clipboard.writeText(url);
    const antes = b.textContent;
    b.textContent = t("copiado");
    setTimeout(() => { b.textContent = antes; }, 2000);
  }));
}

async function compartir() {
  const c = buscar(location.pathname.replace(/\//g, ""));
  const datosCompartir = { title: "qrveda", text: c[idioma][2], url: location.href };
  try {
    if (navigator.share) return await navigator.share(datosCompartir);
    await navigator.clipboard.writeText(datosCompartir.text + "\n" + datosCompartir.url);
    const b = document.getElementById("compartir");
    const antes = b.textContent;
    b.textContent = t("copiado");
    setTimeout(() => { b.textContent = antes; }, 2500);
  } catch (e) { /* cancelado */ }
}

/* ---------------- Arranque ---------------- */
(async function () {
  datos = await (await fetch("/datos.json")).json();

  const g = leer();
  estado.halladas = Array.isArray(g.halladas) ? g.halladas : [];
  estado.racha = g.racha || 0;
  estado.ultimoDia = g.ultimoDia || 0;

  const hoy = diaDeHoy();
  if (estado.ultimoDia !== hoy) {
    estado.racha = (estado.ultimoDia === hoy - 1) ? estado.racha + 1 : 1;
    estado.ultimoDia = hoy;
  }

  const param = new URLSearchParams(location.search).get("l");
  idioma = param || g.idioma || (navigator.language || "es").slice(0, 2);
  if (!T[idioma]) idioma = "es";
  estado.idioma = idioma;
  guardar();

  document.getElementById("idioma").addEventListener("click", () => {
    idioma = idioma === "es" ? "en" : "es";
    estado.idioma = idioma;
    guardar();
    pintar();
  });

  document.addEventListener("click", e => {
    const a = e.target.closest("a");
    if (!a || a.host !== location.host || a.pathname.startsWith("/imprimir")) return;
    e.preventDefault();
    history.pushState({}, "", a.pathname);
    pintar();
    scrollTo(0, 0);
  });
  addEventListener("popstate", pintar);

  pintar();
})();
