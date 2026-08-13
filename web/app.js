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
    contesta: "Antes de leer nada, contesta tú",
    marcador_resp: "Con tus palabras. Se queda en este aparato.",
    guardar: "Guardar y ver el verso",
    tu: "Lo que contestaste",
    leer: "Volver a leerlo",
    lector_sig: "Significado",
    lector_fuente: "Texto de vedabase.cc",
    lector_cerrar: "Cerrar",
    lector_ir: "Abrirlo en vedabase.cc",
    paso1: "Tu respuesta",
    paso2: "El significado",
    ganar: "Leerlo con su significado",
    ganar_pie: "y el sobre {n} es tuyo",
    ganada: "Sobre {n} abierto",
    compartir: "Mandársela a alguien",
    copiado: "Copiado",
    codigo: "Pásaselo a alguien",
    via_movil: "Por el móvil",
    via_voz: "De viva voz",
    via_papel: "En papel o en tela",
    copiar: "Copiar el mensaje",
    imagen: "Imagen para compartir",
    imagen_bajar: "Descargar la imagen",
    copiada_clave: "Clave copiada",
    consejo: "La clave y el código abren lo mismo. Dárselos a alguien no te quita el sobre.",
    camiseta: "En camiseta",
    cam_titulo: "Tu QR en una camiseta",
    cam_donde: "A la espalda. Un QR se lee desde unas diez veces su tamaño: a 25 cm, desde dos metros y medio. Por debajo de 10 cm hay que acercarse mucho, y al pecho de un desconocido no se acerca nadie. Oscuro sobre tela clara y sin arrugas.",
    cam_medida: "¿De qué tamaño?",
    cam_hazla: "Vector",
    cam_hazla_pie: "Escala sin perder nada. Es lo que pide una imprenta.",
    cam_png: "PNG a 300 ppp",
    cam_png_pie: "Para webs de camisetas que no aceptan vector.",
    cam_pide: "Pedírmela",
    cam_pide_pie: "Sin tienda todavía: escríbeme y lo vemos.",
    coleccion: "Las trece",
    encontradas: "{n} de {total}",
    racha: "{n} días seguidos",
    lote: "Nivel",
    sellado: "Sellado",
    completo: "Completo",
    intro: "Trece sobres. Cada día se puede abrir uno.",
    intro2: "Los demás se abren con su clave. Si alguien te pasa la suya, la escribes aquí y el sobre es tuyo.",
    su_codigo: "Ver la clave",
    clave_barra: "Clave",
    clave_titulo: "¿Te han pasado una clave?",
    clave_pie: "Escríbela y se abre su sobre, sea su día o no.",
    clave_abrir: "Abrir",
    clave_mal: "Esa clave no es de ningún sobre",
    tu_clave: "Clave del sobre {n}",
    reparte_pie: "Solo se reparten los sobres que has abierto.",
    hoy_hecho: "El de hoy ya está abierto. Mañana hay otro.",
    cerrado: "Se abre el día que le toque, o con su clave.",
    imprimir_larga: "Puedes imprimir las tuyas y repartirlas.",
    respaldo_pie: "Guarda tu avance fuera de este navegador",
    copia: "Obtener un código",
    restaurar: "Tengo un código de respaldo",
    aviso_copia: "Tu colección vive en este navegador. Guárdala si vas a cambiar de móvil.",
    aviso_codigo: "Esto no abre sobres. Recupera tu colección entera, con lo que hayas escrito.",
    tu_codigo: "Tu código de respaldo",
    pide_codigo: "Escribe tu código de respaldo",
    guardando: "Guardando…",
    restaurado: "Recuperado",
    fallo: "No hay nada con ese código"
  },
  en: {
    imprimir: "Print your own",
    fuente: "Verses and purports on",
    hoy: "Today's card",
    ver: "Uncover it",
    contesta: "Before you read anything, answer it yourself",
    marcador_resp: "In your own words. It stays on this device.",
    guardar: "Save and see the verse",
    tu: "What you answered",
    leer: "Read it again",
    lector_sig: "Purport",
    lector_fuente: "Text from vedabase.cc",
    lector_cerrar: "Close",
    lector_ir: "Open it on vedabase.cc",
    paso1: "Your answer",
    paso2: "The purport",
    ganar: "Read it with the purport",
    ganar_pie: "and envelope {n} is yours",
    ganada: "Envelope {n} opened",
    compartir: "Send it to someone",
    copiado: "Copied",
    codigo: "Pass it on",
    via_movil: "On the phone",
    via_voz: "Out loud",
    via_papel: "On paper or fabric",
    copiar: "Copy the message",
    imagen: "Image to share",
    imagen_bajar: "Download the image",
    copiada_clave: "Key copied",
    consejo: "The key and the code open the same thing. Giving them away doesn\u2019t cost you the envelope.",
    camiseta: "On a shirt",
    cam_titulo: "Your QR on a shirt",
    cam_donde: "On the back. A QR reads from about ten times its own size: at 25 cm, from two and a half metres. Under 10 cm you have to get close, and nobody gets close to a stranger's chest. Dark on light fabric, and flat.",
    cam_medida: "What size?",
    cam_hazla: "Vector",
    cam_hazla_pie: "Scales with no loss. This is what a print shop wants.",
    cam_png: "PNG at 300 dpi",
    cam_png_pie: "For shirt sites that don't take vector.",
    cam_pide: "Ask me for one",
    cam_pide_pie: "No shop yet: write to me and we'll sort it out.",
    coleccion: "The thirteen",
    encontradas: "{n} of {total}",
    racha: "{n} days in a row",
    lote: "Level",
    sellado: "Sealed",
    completo: "Complete",
    intro: "Thirteen envelopes. Each day you can open one.",
    intro2: "The others open with their key. If someone passes you theirs, type it here and the envelope is yours.",
    su_codigo: "See the key",
    clave_barra: "Key",
    clave_titulo: "Someone passed you a key?",
    clave_pie: "Type it and its envelope opens, whatever day it is.",
    clave_abrir: "Open",
    clave_mal: "That key doesn't match any envelope",
    tu_clave: "Key to envelope {n}",
    reparte_pie: "You can only pass on the envelopes you have opened.",
    hoy_hecho: "Today's is open. There's another tomorrow.",
    cerrado: "Opens on its day, or with its key.",
    imprimir_larga: "You can print your own and hand them out.",
    respaldo_pie: "Save your progress beyond this browser",
    copia: "Get a code",
    restaurar: "I have a backup code",
    aviso_copia: "Your collection lives in this browser. Save it if you are changing phones.",
    aviso_codigo: "This opens no envelopes. It restores your whole collection, with whatever you wrote.",
    tu_codigo: "Your backup code",
    pide_codigo: "Type your backup code",
    guardando: "Saving…",
    restaurado: "Restored",
    fallo: "Nothing found with that code"
  }
};

let datos = null;
let idioma = "es";
let estado = { progreso: {}, racha: 0, ultimoDia: 0 };

/* ---------------- Guardado ---------------- */
const leer = () => { try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { return {}; } };
const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) {} };

/* ---------------- Utilidades ---------------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
const t = k => T[idioma][k];
const diaDeHoy = () => Math.floor(Date.now() / DIA);
const buscar = id => datos.tarjetas.find(c => c.id === id);
const enlaceCarta = id => location.origin + "/" + id;

const paso = id => estado.progreso[id] || {};
const conClave = id => (estado.claves || []).includes(id);
// Una carta cuenta con las dos cosas hechas: contestarla y abrir el verso.
const hallada = id => !!(paso(id).respuesta && paso(id).leido);
const halladas = () => datos.tarjetas.filter(c => hallada(c.id)).length;

function cartaDelDia() {
  const abiertas = datos.lotes.filter(l => l.tarjetas.length);
  const pool = abiertas.length ? abiertas[0].tarjetas : datos.tarjetas.map(c => c.id);
  return buscar(pool[diaDeHoy() % pool.length]);
}

/* ---------------- El código ---------------- */
// borde: módulos de zona de silencio. En pantalla bastan 2; para imprimir,
// la norma son 4, y sin ellos muchos lectores fallan.
// medida: si se da, el SVG sale con tamaño físico. Un SVG solo con viewBox
// lo pintan diminuto algunos visores, y entonces la cámara no lo lee.
function svgDelCodigo(texto, tinta, borde, medida) {
  borde = borde || 2;
  const q = qrcode(0, "M");
  q.addData(texto);
  q.make();
  const n = q.getModuleCount(), lado = n + borde * 2;
  let d = "";
  for (let f = 0; f < n; f++)
    for (let c = 0; c < n; c++)
      if (q.isDark(f, c)) d += `M${c + borde} ${f + borde}h1v1h-1z`;
  const tam = medida ? ` width="${medida}" height="${medida}"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg"${tam} viewBox="0 0 ${lado} ${lado}" ` +
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

// 100 mm de lado y borde de 4: se escanea desde el papel, la pantalla o una
// camiseta, y la imprenta lo puede escalar sin pensar.
const bajarSvg = (url, id) =>
  bajar(new Blob([svgDelCodigo(url, "#000", 4, "100mm")], { type: "image/svg+xml" }),
        `qrveda-${id}.svg`);

// PNG grande: el vector vale para casi todo, pero algunas imprentas de
// camisetas solo aceptan mapa de bits.
function bajarPng(url, id, px) {
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
    c.width = c.height = 0;   // un lienzo de varios miles de px ocupa memoria
  };
  img.src = "data:image/svg+xml;base64," +
            btoa(unescape(encodeURIComponent(svgDelCodigo(url, "#000", 4))));
}


/* ---------------- El sobre lacrado ---------------- */
function sobreChico(marca) {
  // El mismo sobre, reducido a lo esencial, para las cartas por descubrir.
  return `<svg class="sobrecito" viewBox="0 0 120 78" role="img" aria-hidden="true">
    <rect x="1" y="1" width="118" height="76" rx="5"
          fill="var(--sobre)" stroke="var(--sobre-linea)" stroke-width="1.2"/>
    <path d="M1 8 L60 50 L119 8" fill="var(--sobre-solapa)"
          stroke="var(--sobre-linea)" stroke-width="1.2" stroke-linejoin="round"/>
    <g transform="translate(60,48)">
      <path d="M0-15c4-2 7 1 10 2s6 1 7 5-2 6-1 9-1 7-5 8-6 4-10 3-6-3-10-4-7-2-8-6 1-6 1-9 0-7 4-8 7-4 12 0z"
            fill="var(--lacre)"/>
      <text y="5" text-anchor="middle" font-family="Georgia,serif" font-size="14"
            font-weight="700" fill="var(--lacre-letra)">${marca}</text>
    </g>
  </svg>`;
}

function sobreLacrado(inicial) {
  // Orden de pintado: interior oscuro, la carta que asoma, el cuerpo del
  // sobre, la solapa que se levanta, y encima la cera. Así al abrirse se ve
  // el hueco de dentro en vez de un triángulo girando en el vacío.
  return `<svg class="sobre" viewBox="0 0 260 168" role="img" aria-hidden="true">
    <rect x="1" y="1" width="258" height="166" rx="7" fill="var(--sobre-dentro)"/>
    <g class="carta"><rect x="26" y="26" width="208" height="128" rx="4"
       fill="var(--carta-papel)" stroke="var(--sobre-linea)" stroke-width="1"/></g>
    <path class="cuerpo" d="M1 46 L1 161 a6 6 0 0 0 6 6 h246 a6 6 0 0 0 6-6 L259 46 L130 122Z"
          fill="var(--sobre)" stroke="var(--sobre-linea)" stroke-width="1.4"
          stroke-linejoin="round"/>
    <path d="M1 158 L96 84 M259 158 L164 84" fill="none"
          stroke="var(--sobre-linea)" stroke-width="1.2" opacity=".5"/>
    <path class="solapa" d="M1 12 L130 104 L259 12 a6 6 0 0 0-6-6 H7 a6 6 0 0 0-6 6z"
          fill="var(--sobre-solapa)" stroke="var(--sobre-linea)" stroke-width="1.4"
          stroke-linejoin="round"/>
    <g transform="translate(130,100)">
      <g class="cera">
        <path d="M0-31c9-4 15 2 21 5s13 1 15 10-4 13-3 20-2 14-10 16-12 8-20 7-13-6-21-8-15-4-17-13 3-12 2-19 1-15 9-17 15-7 24-1z"
              fill="var(--lacre)"/>
      </g>
      <g class="sello-marca">
        <circle r="20" fill="none" stroke="var(--lacre-borde)" stroke-width="1.4" opacity=".8"/>
        <text y="8" text-anchor="middle" font-family="Georgia,serif" font-size="24"
              font-weight="700" fill="var(--lacre-letra)">${inicial}</text>
      </g>
    </g>
  </svg>`;
}

// Un enlace pelado no dice nada. Se copia la pregunta con él.
function mensajeDe(id) {
  const c = buscar(id);
  const [l1, l2, preg] = c[idioma];
  return `${l1} ${l2}\n«${preg}»\n\n${enlaceCarta(id)}`;
}

// Imagen cuadrada: la pregunta grande y el código debajo. Es lo que circula
// por los estados y las historias, donde nadie pincha un enlace.
//
// Se prepara al pintar la carta, no al pulsar: navigator.share exige que se
// le llame dentro del gesto del usuario, y montar el lienzo se lo come.
let imagenLista = { id: null, fichero: null };

function dibujarImagen(id) {
  return new Promise(resolver => {
    const c = buscar(id);
    const [l1, l2, preg] = c[idioma];
    const L = 1080;
    const lienzo = document.createElement("canvas");
    lienzo.width = lienzo.height = L;
    const g = lienzo.getContext("2d");

    g.fillStyle = "#12100e";
    g.fillRect(0, 0, L, L);

    const serif = '"Iowan Old Style", Palatino, Georgia, serif';
    const margen = 96;
    let y = 190;

    const escribir = (texto, tam, color, cursiva) => {
      g.font = `${cursiva ? "italic " : ""}${tam}px ${serif}`;
      g.fillStyle = color;
      let linea = "";
      for (const w of texto.split(" ")) {
        const prueba = linea ? linea + " " + w : w;
        if (g.measureText(prueba).width > L - margen * 2 && linea) {
          g.fillText(linea, margen, y);
          y += tam * 1.24;
          linea = w;
        } else linea = prueba;
      }
      if (linea) { g.fillText(linea, margen, y); y += tam * 1.24; }
    };

    escribir(l1 + " " + l2, 44, "#8b8378", false);
    y += 22;
    escribir(preg, 76, "#c9a05e", true);

    const qr = new Image();
    qr.onload = () => {
      const lado = 300, x = (L - lado) / 2, arriba = L - lado - 150;
      g.fillStyle = "#fff";
      g.fillRect(x - 16, arriba - 16, lado + 32, lado + 32);
      g.drawImage(qr, x, arriba, lado, lado);
      g.font = "28px ui-monospace, Menlo, monospace";
      g.fillStyle = "#8b8378";
      g.textAlign = "center";
      g.fillText("qr.vedicvault.org", L / 2, L - 74);
      lienzo.toBlob(b => resolver(new File([b], `qrveda-${id}.png`, { type: "image/png" })),
                    "image/png");
    };
    qr.src = "data:image/svg+xml;base64," +
             btoa(unescape(encodeURIComponent(svgDelCodigo(enlaceCarta(id), "#111", 3))));
  });
}

async function prepararImagen(id) {
  imagenLista = { id, fichero: await dibujarImagen(id) };
}

const sePuedeCompartirImagen = f =>
  !!(navigator.canShare && f && navigator.canShare({ files: [f] }));

async function compartirImagen(id) {
  const f = (imagenLista.id === id && imagenLista.fichero) || await dibujarImagen(id);
  if (sePuedeCompartirImagen(f)) {
    try { return await navigator.share({ files: [f], text: mensajeDe(id) }); }
    catch (e) { if (e.name === "AbortError") return; }
  }
  bajar(f, f.name);
}

// Camiseta vista por detrás, con el código a escala. El cuerpo va dibujado
// de x=60 a x=140 —ochenta unidades— y una espalda de adulto mide unos 50 cm,
// así que la conversión es directa y el dibujo no exagera.
const CUERPO = 80;            // ancho del cuerpo en el dibujo
const ESPALDA_CM = 50;        // lo que mide de ancho una espalda de adulto

function camisetaConCodigo(id, cm) {
  const lado = CUERPO * (cm / ESPALDA_CM);
  const x = 100 - lado / 2;
  const y = 96 - lado / 2;
  const codigo = svgDelCodigo(enlaceCarta(id), "#111", 3)
    .replace("<svg ", `<svg x="${x}" y="${y}" width="${lado}" height="${lado}" `);

  return `<svg class="prenda" viewBox="0 0 200 200" role="img" aria-hidden="true">
    <path d="M70 24 L86 16 q14 9 28 0 l16 8 38 24-16 26-16-11v106a6 6 0 0 1-6 6H66a6 6 0 0 1-6-6V87l-16 11-16-26z"
          fill="var(--prenda)" stroke="var(--prenda-linea)" stroke-width="1.6"
          stroke-linejoin="round"/>
    <path d="M86 16 q14 11 28 0" fill="none" stroke="var(--prenda-linea)" stroke-width="1.6"/>
    ${codigo}
  </svg>`;
}

/* ---------------- Piezas ---------------- */
function cara(c) {
  const [l1, l2, preg] = c[idioma];
  return `<div class="cara">
    <p class="frase">${esc(l1)}<br>${esc(l2)}</p>
    <p class="pregunta">${esc(preg)}</p>
  </div>`;
}

function niveles() {
  const hoy = cartaDelDia().id;
  return datos.lotes.map((lote, i) => {
    if (!lote.tarjetas.length) {
      return `<section class="nivel sellado">
        <h2>${t("lote")} ${i + 1} · ${esc(lote.nombre)}</h2>
        <p class="subtitulo">${esc(lote[idioma].titulo)}</p>
        <div class="lacre">
          ${sobreLacrado(esc(lote.nombre[0]))}
          <p>${esc(lote[idioma].pista)}</p>
        </div>
      </section>`;
    }

    const piezas = lote.tarjetas.map(id => {
      const c = buscar(id);
      const abierta = hallada(id);
      const empezada = !!paso(id).respuesta;
      const abrible = abierta || empezada || conClave(id) || id === hoy;
      const clases = ["mini", abierta ? "hallada" : "", id === hoy ? "hoy" : "",
                      abrible ? "" : "cerrado"].join(" ");
      const dentro = abierta
        ? `<span class="carta-abierta"><span class="preg">${esc(c[idioma][2])}</span><span class="folio">${esc(id)}</span></span>`
        : sobreChico(esc(id));
      if (!abrible) return `<span class="${clases}" title="${t("cerrado")}">${dentro}</span>`;
      // El código no se enseña de entrada: aparece si lo buscas.
      const tirador = abierta
        ? `<button class="verqr" data-ver="${id}" title="${t("su_codigo")}" aria-label="${t("su_codigo")}">⌗</button>`
        : "";
      return `<span class="envoltorio"><a class="${clases}" href="/${id}">${dentro}</a>${tirador}</span>`;
    }).join("");

    const n = lote.tarjetas.filter(hallada).length;
    const hecho = n === lote.tarjetas.length;
    return `<section class="nivel${hecho ? " hecho" : ""}">
      <h2>${t("lote")} ${i + 1} · ${esc(lote.nombre)}</h2>
      <p class="subtitulo">${esc(lote[idioma].titulo)}</p>
      <p class="marcador">${hecho ? t("completo") : t("encontradas").replace("{n}", n).replace("{total}", lote.tarjetas.length)}</p>
      <div class="malla">${piezas}</div>
    </section>`;
  }).join("");
}

// Vive en la barra, no al final de la página: una clave llega en cualquier
// momento y no se puede pedir que la gente baje a buscar dónde meterla.
function pedirClave() {
  const capa = document.createElement("div");
  capa.className = "capa";
  capa.innerHTML = `<div class="visor clave">
    <h2>${t("clave_titulo")}</h2>
    <div class="menu">
      <input id="clave" maxlength="4" autocapitalize="characters" autocomplete="off"
             spellcheck="false" placeholder="····">
      <button id="abrirclave">${t("clave_abrir")}</button>
    </div>
    <p class="nota">${t("clave_pie")}</p>
  </div>`;

  const cerrar = () => capa.remove();
  capa.addEventListener("click", e => { if (e.target === capa) cerrar(); });
  addEventListener("keydown", e => { if (e.key === "Escape") cerrar(); }, { once: true });
  document.body.appendChild(capa);

  const caja = capa.querySelector("#clave");
  caja.focus();

  const probar = () => {
    const v = caja.value.trim().toUpperCase();
    const c = datos.tarjetas.find(x => x.clave === v);
    if (!c) { caja.value = ""; caja.placeholder = t("clave_mal"); return caja.focus(); }
    // Un sobre que ya tienes no merece repetir la ceremonia.
    if (hallada(c.id) || conClave(c.id)) { cerrar(); return irA("/" + c.id); }
    estado.claves = (estado.claves || []).concat(c.id);
    guardar();
    cerrar();
    derretirYEntrar(c.id);
  };
  capa.querySelector("#abrirclave").addEventListener("click", probar);
  caja.addEventListener("keydown", e => { if (e.key === "Enter") probar(); });
}

/* ---------------- Vistas ---------------- */
function portada() {
  const c = cartaDelDia();
  const racha = estado.racha > 1
    ? `<p class="racha">${t("racha").replace("{n}", estado.racha)}</p>` : "";

  const tarjeta = hallada(c.id)
    ? `<a class="hoy-cara" href="/${c.id}">${cara(c)}<p class="ya">${t("hoy_hecho")}</p></a>`
    : `<a class="hoy-cara tapada" href="/${c.id}">
         ${sobreLacrado(esc(c.id))}
         <p class="invita">${t("ver")}</p>
       </a>`;

  return `<section class="hoy">
    <h1>${t("hoy")}</h1>
    ${tarjeta}
    ${racha}
  </section>
  ${niveles()}
  <section class="explica">
    <p>${t("intro")}</p>
    <p>${t("intro2")}</p>
    <p>${t("imprimir_larga")} <a href="/imprimir/">${t("imprimir")}</a>.</p>
  </section>
  <p></p>`;
}

function carta(id) {
  const c = buscar(id);
  if (!c) return portada();
  const p = paso(id);
  document.title = `${c[idioma][2]} — qrveda`;

  // Primero contestas tú. El verso no aparece hasta entonces.
  if (!p.respuesta) {
    return `<section class="unacarta">
      ${cara(c)}
      <div class="tuya">
        <h2>${t("contesta")}</h2>
        <textarea id="respuesta" rows="3" placeholder="…"></textarea>
        <p class="nota">${t("marcador_resp")}</p>
        <button class="principal" id="guardar">${t("guardar")}</button>
      </div>
    </section>`;
  }

  const ref = `${c.cap}.${c.ver}`;
  // El verso solo se queda escrito en la carta cuando ya lo has abierto: si
  // apareciera antes, el paso 2 diría que falta algo que está a la vista.
  const versoEscrito = p.leido ? `<blockquote>
      <p>${esc(c.verso[idioma])}</p>
      <cite>Bhagavad-gītā ${ref}</cite>
    </blockquote>` : "";

  return `<section class="unacarta">
    ${cara(c)}
    <div class="tuya hecha">
      <h2>${t("tu")}</h2>
      <p class="respuesta">${esc(p.respuesta)}</p>
    </div>
    ${versoEscrito}
    <div class="acciones">
      <button class="principal${p.leido ? "" : " gana"}" data-leer="${id}">${
        p.leido ? t("leer")
                : `<strong>${t("ganar")}</strong><em>${t("ganar_pie").replace("{n}", id)}</em>`
      }</button>
    </div>
    ${p.leido ? `<p class="conseguida">${t("ganada").replace("{n}", id)}</p>` : ""}
    <div class="codigo">
      <h2>${t("codigo")}</h2>
      <div class="llave">
        <div class="lienzo">${svgDelCodigo(enlaceCarta(id), "#111")}</div>
        <div class="letras">
          <button class="clavegorda" data-qr="clave">${esc(c.clave)}</button>
          <p class="consejo">${t("consejo")}</p>
        </div>
      </div>
      <div class="menu">
        <button data-qr="copiar">${t("copiar")}</button>
        <button data-qr="imagen">${navigator.canShare ? t("imagen") : t("imagen_bajar")}</button>
        <a href="/imprimir/">${t("imprimir")}</a>
        <button data-camiseta="${id}">${t("camiseta")}</button>
      </div>
    </div>
  </section>
  ${niveles()}`;
}

function verCodigo(id) {
  const capa = document.createElement("div");
  capa.className = "capa";
  capa.innerHTML = `<div class="visor">
    <div class="cuadro">${svgDelCodigo(enlaceCarta(id), "#111")}</div>
    <div class="menu">
      <button data-qr="copiar">${t("copiar")}</button>
      <button data-qr="clave">${t("tu_clave").replace("{n}", id).split(" ")[0]}</button>
    </div>
    <p class="clave-suya"><span>${t("tu_clave").replace("{n}", id)}</span><strong>${esc(buscar(id).clave)}</strong></p>
    <p class="nota">${t("reparte_pie")}</p>
  </div>`;

  const cerrar = () => capa.remove();
  capa.addEventListener("click", e => { if (e.target === capa) cerrar(); });
  addEventListener("keydown", e => { if (e.key === "Escape") cerrar(); }, { once: true });

  capa.querySelectorAll("[data-qr]").forEach(b => b.addEventListener("click", async () => {
    if (b.dataset.qr === "imagen") return compartirImagen(id);
    await navigator.clipboard.writeText(
      b.dataset.qr === "clave" ? buscar(id).clave : mensajeDe(id));
    // No se cierra solo: quien copia suele querer mirar el código después.
    const antes = b.textContent;
    b.textContent = b.dataset.qr === "clave" ? t("copiada_clave") : t("copiado");
    setTimeout(() => { b.textContent = antes; }, 1600);
  }));

  document.body.appendChild(capa);
}

// Después de cada acción, la vista va sola a lo que acaba de cambiar.
function llevarA(selector) {
  requestAnimationFrame(() => {
    const n = document.querySelector(selector);
    if (n) n.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

// Una clave acertada merece ver cómo se derrite la cera.
function irA(ruta) {
  history.pushState({}, "", ruta);
  pintar();
  scrollTo(0, 0);
}

function derretirYEntrar(id) {
  const ir = () => irA("/" + id);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return ir();

  const capa = document.createElement("div");
  capa.className = "capa derritiendo";
  capa.innerHTML = sobreLacrado(id);
  document.body.appendChild(capa);
  requestAnimationFrame(() => capa.querySelector(".sobre").classList.add("rompiendo"));
  setTimeout(() => { capa.remove(); ir(); }, 2400);
}

// El significado se lee aquí dentro. Sacar a la gente a otra pestaña la
// perdía: en el móvil casi nadie vuelve.
async function abrirLector(id) {
  const c = buscar(id);
  const capa = document.createElement("div");
  capa.className = "capa lector";
  capa.innerHTML = `<div class="hoja-lectura">
    <button class="cerrar" aria-label="${t("lector_cerrar")}">×</button>
    <div class="rollo"><p class="cargando">·  ·  ·</p></div>
  </div>`;
  const cerrar = () => { capa.remove(); document.body.classList.remove("quieto"); };
  capa.addEventListener("click", e => { if (e.target === capa) cerrar(); });
  capa.querySelector(".cerrar").addEventListener("click", cerrar);
  addEventListener("keydown", e => { if (e.key === "Escape") cerrar(); }, { once: true });
  document.body.appendChild(capa);
  document.body.classList.add("quieto");

  let v;
  try {
    v = (await (await fetch(`/versos/${c.cap}-${c.ver}.json`)).json())[idioma];
  } catch (e) {
    return location.assign(c.url[idioma]);
  }

  capa.querySelector(".rollo").innerHTML = `
    <p class="ref">Bhagavad-gītā ${c.cap}.${c.ver}</p>
    <blockquote><p>${esc(v.traduccion)}</p></blockquote>
    <h3>${t("lector_sig")}</h3>
    ${v.significado.map(x => `<p>${esc(x)}</p>`).join("")}
    <p class="fuente">${t("lector_fuente")} —
      <a href="${esc(v.url)}" target="_blank" rel="noopener">${t("lector_ir")}</a></p>`;

  // Leerlo aquí es lo que gana el sobre.
  estado.progreso[id] = Object.assign(paso(id), { leido: true });
  guardar();
}

// Sin tienda montada: o te la haces donde quieras, o me la pides. Cuando
// haya demanda, esto se cambia por el enlace de la tienda y ya está.
function verCamiseta(id) {
  const asunto = encodeURIComponent(`Camiseta — sobre ${id}`);
  const cuerpo = encodeURIComponent(
    `Quiero una camiseta con el sobre ${id} de qrveda.\n${enlaceCarta(id)}\n\nTalla:\nColor:\n`);
  const capa = document.createElement("div");
  capa.className = "capa";
  capa.innerHTML = `<div class="visor camiseta">
    <h2>${t("cam_titulo")}</h2>
    <div class="prueba">${camisetaConCodigo(id, 25)}</div>
    <p class="nota">${t("cam_donde")}</p>
    <div class="opciones">
      <p class="rotulo">${t("cam_medida")}</p>
      <div class="medidas">
        ${[10, 15, 20, 25, 30].map((cm, i) =>
          `<button class="cm${i === 3 ? " puesta" : ""}" data-cm="${cm}">${cm}</button>`).join("")}
        <span>cm</span>
      </div>
      <button data-cam="svg">${t("cam_hazla")}</button>
      <p class="pie">${t("cam_hazla_pie")}</p>
      <button data-cam="png">${t("cam_png")}</button>
      <p class="pie" id="pngpie">${t("cam_png_pie")}</p>
      <a href="mailto:${datos.contacto}?subject=${asunto}&body=${cuerpo}">${t("cam_pide")}</a>
      <p class="pie">${t("cam_pide_pie")}</p>
    </div>
  </div>`;
  const cerrar = () => capa.remove();
  capa.addEventListener("click", e => { if (e.target === capa) cerrar(); });
  addEventListener("keydown", e => { if (e.key === "Escape") cerrar(); }, { once: true });
  let cm = 25;
  const pie = () => {
    const px = Math.round(cm / 2.54 * 300);
    capa.querySelector("#pngpie").textContent =
      `${t("cam_png_pie")} — ${px} × ${px} px`;
  };
  capa.querySelectorAll("[data-cm]").forEach(b => b.addEventListener("click", () => {
    cm = +b.dataset.cm;
    capa.querySelectorAll("[data-cm]").forEach(x => x.classList.toggle("puesta", x === b));
    capa.querySelector(".prueba").innerHTML = camisetaConCodigo(id, cm);
    pie();
  }));

  // El archivo sale ya a la medida elegida: así ninguna imprenta tiene que
  // adivinar a qué tamaño va, ni rechazarlo por resolución.
  capa.querySelector('[data-cam="svg"]').addEventListener("click", () =>
    bajar(new Blob([svgDelCodigo(enlaceCarta(id), "#000", 4, cm + "cm")],
                   { type: "image/svg+xml" }), `qrveda-${id}-${cm}cm.svg`));
  capa.querySelector('[data-cam="png"]').addEventListener("click", () =>
    bajarPng(enlaceCarta(id), id, Math.round(cm / 2.54 * 300)));

  document.body.appendChild(capa);
  pie();
}

// El respaldo no es del juego, pero tiene que poder encontrarse desde
// cualquier pantalla: por eso vive en el pie y se abre en su panel.
function pedirRespaldo() {
  const capa = document.createElement("div");
  capa.className = "capa";
  capa.innerHTML = `<div class="visor respaldo">
    <h2>${t("respaldo_pie")}</h2>
    <p class="nota">${t("aviso_copia")}</p>
    ${estado.codigo ? `<p class="codigo-mio"><span>${t("tu_codigo")}</span><strong>${esc(estado.codigo)}</strong></p>` : ""}
    <div class="menu">
      <button id="copia">${t("copia")}</button>
      <button id="restaurar">${t("restaurar")}</button>
    </div>
    <p class="nota fina">${t("aviso_codigo")}</p>
  </div>`;

  const cerrar = () => capa.remove();
  capa.addEventListener("click", e => { if (e.target === capa) cerrar(); });
  addEventListener("keydown", e => { if (e.key === "Escape") cerrar(); }, { once: true });
  document.body.appendChild(capa);

  const boton = capa.querySelector("#copia");
  boton.addEventListener("click", async () => {
    boton.textContent = t("guardando");
    try {
      const r = await fetch("/api/copia", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ codigo: estado.codigo || "", estado: estado }),
      });
      const d = await r.json();
      if (!d.codigo) throw new Error("api");
      estado.codigo = d.codigo;
      guardar();
      cerrar();
      pedirRespaldo();
    } catch (e) { boton.textContent = t("copia"); }
  });

  capa.querySelector("#restaurar").addEventListener("click", async () => {
    const codigo = (prompt(t("pide_codigo")) || "").trim().toUpperCase();
    if (!codigo) return;
    try {
      const d = await (await fetch("/api/copia?c=" + encodeURIComponent(codigo))).json();
      if (!d.estado) throw new Error("no");
      // Se une, no se pisa: si tienes avances en los dos, no pierdes ninguno.
      estado.progreso = Object.assign({}, d.estado.progreso, estado.progreso);
      estado.claves = [...new Set((estado.claves || []).concat(d.estado.claves || []))];
      estado.racha = Math.max(estado.racha || 0, d.estado.racha || 0);
      estado.codigo = d.codigo;
      guardar();
      cerrar();
      pintar();
    } catch (e) { alert(t("fallo")); }
  });
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

  const caja = document.getElementById("respuesta");
  if (caja) {
    caja.focus();
    document.getElementById("guardar").addEventListener("click", () => {
      const texto = caja.value.trim();
      if (!texto) return caja.focus();
      estado.progreso[id] = Object.assign(paso(id), { respuesta: texto });
      guardar();
      pintar();
      llevarA(".acciones");
    });
  }

  // Abrir el significado es el segundo paso: con eso el sobre ya es tuyo.
  document.querySelectorAll("[data-leer]").forEach(b => b.addEventListener("click", async () => {
    const yaEra = paso(b.dataset.leer).leido;
    await abrirLector(b.dataset.leer);
    if (!yaEra) setTimeout(() => { pintar(); llevarA(".conseguida"); }, 50);
  }));

  document.querySelectorAll("[data-ver]").forEach(b =>
    b.addEventListener("click", e => { e.preventDefault(); verCodigo(b.dataset.ver); }));

  document.querySelectorAll("[data-camiseta]").forEach(b =>
    b.addEventListener("click", () => verCamiseta(b.dataset.camiseta)));

  const boton = document.getElementById("compartir");
  if (boton) boton.addEventListener("click", compartir);

  const conImagen = document.querySelector('[data-qr="imagen"]');
  if (conImagen) prepararImagen(location.pathname.replace(/\//g, ""));

  document.querySelectorAll("[data-qr]").forEach(b => b.addEventListener("click", async () => {
    if (b.dataset.qr === "imagen") return compartirImagen(id);
    const esClave = b.dataset.qr === "clave";
    await navigator.clipboard.writeText(esClave ? buscar(id).clave : mensajeDe(id));
    const antes = b.textContent;
    b.textContent = esClave ? "✓" : t("copiado");
    setTimeout(() => { b.textContent = antes; }, 1600);
  }));
}

async function compartir() {
  const c = buscar(location.pathname.replace(/\//g, ""));
  const datosCompartir = { title: "qrveda", text: mensajeDe(c.id), url: location.href };
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
  // Sin esto, algunos navegadores tiran el almacenamiento tras unos días sin
  // visitas. Safari en iOS lo hace a los siete. Pedirlo no molesta al usuario.
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}

  datos = await (await fetch("/datos.json")).json();

  const g = leer();
  estado.progreso = g.progreso || {};
  estado.racha = g.racha || 0;
  estado.ultimoDia = g.ultimoDia || 0;
  estado.codigo = g.codigo || "";
  estado.claves = g.claves || [];

  const hoy = diaDeHoy();
  if (estado.ultimoDia !== hoy) {
    estado.racha = (estado.ultimoDia === hoy - 1) ? estado.racha + 1 : 1;
    estado.ultimoDia = hoy;
  }

  // Para probar el juego desde cero: qr.vedicvault.org/?reset
  if (new URLSearchParams(location.search).has("reset")) {
    try { localStorage.removeItem(CLAVE); } catch (e) {}
    return location.replace("/");
  }

  const param = new URLSearchParams(location.search).get("l");
  idioma = param || g.idioma || (navigator.language || "es").slice(0, 2);
  if (!T[idioma]) idioma = "es";
  estado.idioma = idioma;
  guardar();

  document.getElementById("pedirclave").addEventListener("click", pedirClave);
  document.getElementById("guardar-col").addEventListener("click", pedirRespaldo);

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

    const ir = () => { history.pushState({}, "", a.pathname); pintar(); scrollTo(0, 0); };

    // Si lo que se pulsa es un sobre lacrado, primero se rompe.
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sobre = a.classList.contains("tapada") ? a.querySelector(".sobre") : null;
    if (sobre && !quieto) {
      sobre.classList.add("rompiendo");
      return setTimeout(ir, 2350);
    }
    ir();
  });
  addEventListener("popstate", pintar);
  // El aviso de que hay más abajo aparece en cualquier pantalla y se apaga
  // al llegar al final. Antes solo estaba en la portada y solo al principio.
  const mirarFondo = () => {
    const queda = document.documentElement.scrollHeight - scrollY - innerHeight;
    document.body.classList.toggle("hayfondo", queda > 60);
  };
  addEventListener("scroll", mirarFondo, { passive: true });
  addEventListener("resize", mirarFondo);
  new MutationObserver(mirarFondo).observe(document.getElementById("app"), { childList: true });
  mirarFondo();

  pintar();
})();
