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
    leer: "Leerlo entero en vedabase",
    paso1: "Contéstala tú",
    paso2: "Rompe el lacre",
    ganar: "Leerlo con su significado",
    ganar_pie: "y el sobre {n} es tuyo",
    ganada: "Sobre {n} abierto",
    compartir: "Mandársela a alguien",
    copiado: "Copiado",
    codigo: "Su código",
    svg: "Vector (camisetas)",
    png: "Imagen grande",
    copiar: "Copiar enlace",
    consejo: "Para camisetas, a la espalda y de 8 a 10 cm. Oscuro sobre tela clara y sin arrugas.",
    coleccion: "Las trece",
    encontradas: "{n} de {total}",
    racha: "{n} días seguidos",
    lote: "Nivel",
    sellado: "Sellado",
    completo: "Completo",
    intro: "Trece sobres. Cada día se puede abrir uno.",
    intro2: "Los demás andan por la calle, en tarjetas. El código de cada tarjeta abre el suyo.",
    hoy_hecho: "El de hoy ya está abierto. Mañana hay otro.",
    cerrado: "Este se abre el día que le toque, o con su tarjeta.",
    imprimir_larga: "Puedes imprimir las tuyas y repartirlas.",
    copia: "Guardar con código",
    restaurar: "Tengo un código",
    aviso_copia: "Todo esto vive en este navegador. Si lo borras o cambias de móvil, se pierde. Guárdalo con un código y apúntalo.",
    aviso_codigo: "Con el código se recupera en cualquier aparato. Quien lo tenga verá también lo que has escrito.",
    tu_codigo: "Tu código",
    pide_codigo: "Escribe tu código",
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
    leer: "Read it whole on vedabase",
    paso1: "Answer it yourself",
    paso2: "Break the seal",
    ganar: "Read it with the purport",
    ganar_pie: "and envelope {n} is yours",
    ganada: "Envelope {n} opened",
    compartir: "Send it to someone",
    copiado: "Copied",
    codigo: "Its code",
    svg: "Vector (for shirts)",
    png: "Large image",
    copiar: "Copy link",
    consejo: "For shirts, put it on the back, 8 to 10 cm. Dark on light fabric, and flat.",
    coleccion: "The thirteen",
    encontradas: "{n} of {total}",
    racha: "{n} days in a row",
    lote: "Level",
    sellado: "Sealed",
    completo: "Complete",
    intro: "Thirteen envelopes. Each day you can open one.",
    intro2: "The rest are out on the street, on cards. Each card's code opens its own.",
    hoy_hecho: "Today's is open. There's another tomorrow.",
    cerrado: "This one opens on its day, or with its card.",
    imprimir_larga: "You can print your own and hand them out.",
    copia: "Save with a code",
    restaurar: "I have a code",
    aviso_copia: "All of this lives in this browser. If you clear it or change phones, it is gone. Save it with a code and write it down.",
    aviso_codigo: "The code restores it on any device. Whoever has it also sees what you wrote.",
    tu_codigo: "Your code",
    pide_codigo: "Type your code",
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
  // Sobre de solapa cerrada con el lacre encima del pico. El borde del lacre
  // va irregular a propósito: la cera nunca sale redonda.
  return `<svg class="sobre" viewBox="0 0 260 168" role="img" aria-hidden="true">
    <rect x="1" y="1" width="258" height="166" rx="7"
          fill="var(--sobre)" stroke="var(--sobre-linea)" stroke-width="1.4"/>
    <path d="M1 12 L130 104 L259 12" fill="var(--sobre-solapa)"
          stroke="var(--sobre-linea)" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M1 158 L96 84 M259 158 L164 84" fill="none"
          stroke="var(--sobre-linea)" stroke-width="1.2" opacity=".65"/>
    <g transform="translate(130,100)">
      <path d="M0-31c9-4 15 2 21 5s13 1 15 10-4 13-3 20-2 14-10 16-12 8-20 7-13-6-21-8-15-4-17-13 3-12 2-19 1-15 9-17 15-7 24-1z"
            fill="var(--lacre)"/>
      <circle r="20" fill="none" stroke="var(--lacre-borde)" stroke-width="1.4" opacity=".8"/>
      <text y="8" text-anchor="middle" font-family="Georgia,serif" font-size="24"
            font-weight="700" fill="var(--lacre-letra)">${inicial}</text>
    </g>
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
      const abrible = abierta || empezada || id === hoy;
      const clases = ["mini", abierta ? "hallada" : "", id === hoy ? "hoy" : "",
                      abrible ? "" : "cerrado"].join(" ");
      const dentro = abierta
        ? `<span class="preg">${esc(c[idioma][2])}</span>`
        : sobreChico(esc(id));
      return abrible
        ? `<a class="${clases}" href="/${id}">${dentro}</a>`
        : `<span class="${clases}" title="${t("cerrado")}">${dentro}</span>`;
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

function pasos(id) {
  const p = paso(id);
  const uno = p.respuesta ? "hecho" : "ahora";
  const dos = p.respuesta ? (p.leido ? "hecho" : "ahora") : "";
  return `<ol class="pasos">
    <li class="${uno}"><span>1</span>${t("paso1")}</li>
    <li class="${dos}"><span>2</span>${t("paso2")}</li>
  </ol>`;
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
  <section class="respaldo">
    <p class="nota">${t("aviso_copia")}</p>
    ${estado.codigo ? `<p class="codigo-mio"><span>${t("tu_codigo")}</span><strong>${esc(estado.codigo)}</strong></p>` : ""}
    <div class="menu">
      <button id="copia">${t("copia")}</button>
      <button id="restaurar">${t("restaurar")}</button>
    </div>
    <p class="nota fina">${t("aviso_codigo")}</p>
  </section>`;
}

function carta(id) {
  const c = buscar(id);
  if (!c) return portada();
  const p = paso(id);
  document.title = `${c[idioma][2]} — qrveda`;

  // Primero contestas tú. El verso no aparece hasta entonces.
  if (!p.respuesta) {
    return `<section class="unacarta">
      ${pasos(id)}
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
  return `<section class="unacarta">
    ${pasos(id)}
    ${cara(c)}
    <div class="tuya hecha">
      <h2>${t("tu")}</h2>
      <p class="respuesta">${esc(p.respuesta)}</p>
    </div>
    <blockquote>
      <p>${esc(c.verso[idioma])}</p>
      <cite>Bhagavad-gītā ${ref}</cite>
    </blockquote>
    <div class="acciones">
      <a class="principal${p.leido ? "" : " gana"}" href="${esc(c.url[idioma])}" data-leido>${
        p.leido ? t("leer")
                : `<strong>${t("ganar")}</strong><em>${t("ganar_pie").replace("{n}", id)}</em>`
      }</a>
      <button id="compartir">${t("compartir")}</button>
    </div>
    ${p.leido ? `<p class="conseguida">${t("ganada").replace("{n}", id)}</p>` : ""}
    <div class="codigo">
      <h2>${t("codigo")}</h2>
      <div class="lienzo">${svgDelCodigo(enlaceCarta(id), "#111")}</div>
      <div class="menu">
        <button data-qr="svg">${t("svg")}</button>
        <button data-qr="png">${t("png")}</button>
        <button data-qr="copiar">${t("copiar")}</button>
        <a href="/imprimir/">${t("imprimir")}</a>
      </div>
      <p class="consejo">${t("consejo")}</p>
    </div>
  </section>
  ${niveles()}`;
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
      scrollTo(0, 0);
    });
  }

  // Abrir el verso entero es el segundo paso: con eso la carta ya cuenta.
  document.querySelectorAll("[data-leido]").forEach(a => a.addEventListener("click", () => {
    estado.progreso[id] = Object.assign(paso(id), { leido: true });
    guardar();
    setTimeout(pintar, 400);
  }));

  const boton = document.getElementById("compartir");
  if (boton) boton.addEventListener("click", compartir);

  const copia = document.getElementById("copia");
  if (copia) {
    copia.addEventListener("click", async () => {
      const antes = copia.textContent;
      copia.textContent = t("guardando");
      try {
        const r = await fetch("/api/copia", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ codigo: estado.codigo || "", estado: estado })
        });
        const d = await r.json();
        if (!d.codigo) throw new Error("api");
        estado.codigo = d.codigo;
        guardar();
        pintar();
      } catch (e) {
        copia.textContent = antes;
      }
    });

    document.getElementById("restaurar").addEventListener("click", async () => {
      const codigo = (prompt(t("pide_codigo")) || "").trim().toUpperCase();
      if (!codigo) return;
      try {
        const r = await fetch("/api/copia?c=" + encodeURIComponent(codigo));
        const d = await r.json();
        if (!d.estado) throw new Error("no");
        // Se une, no se pisa: si tienes avances en los dos, no pierdes ninguno.
        estado.progreso = Object.assign({}, d.estado.progreso, estado.progreso);
        estado.racha = Math.max(estado.racha || 0, d.estado.racha || 0);
        estado.codigo = d.codigo;
        guardar();
        pintar();
      } catch (e) { alert(t("fallo")); }
    });
  }

  document.querySelectorAll("[data-qr]").forEach(b => b.addEventListener("click", async () => {
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
  // Sin esto, algunos navegadores tiran el almacenamiento tras unos días sin
  // visitas. Safari en iOS lo hace a los siete. Pedirlo no molesta al usuario.
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}

  datos = await (await fetch("/datos.json")).json();

  const g = leer();
  estado.progreso = g.progreso || {};
  estado.racha = g.racha || 0;
  estado.ultimoDia = g.ultimoDia || 0;
  estado.codigo = g.codigo || "";

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
