// O Décimo Círculo — cliente.
// O servidor manda vitais e falas; a natação é toda local, a 60fps.

// ─── Backend URL ───────────────────────────────────────────────────────────
// Quando servido pelo próprio Worker, usa a mesma origem.
// Quando servido do GitHub Pages (ou outro host), aponta para o Worker.
// Pode ser sobrescrito com <script>window.DECIMO_BACKEND = "https://..."</script>
const BACKEND = (() => {
  if (window.DECIMO_BACKEND) return window.DECIMO_BACKEND.replace(/\/$/, "");
  const h = location.hostname;
  if (h === "localhost" || h === "127.0.0.1" || h.endsWith(".workers.dev")) return "";
  return "https://decimo-circulo.thothandson.workers.dev";
})();

const cv = document.getElementById("aquario");
const ctx = cv.getContext("2d");
const elTanque = document.getElementById("tanque");
const elBaloes = document.getElementById("balões");
const elConexao = document.getElementById("estadoConexao");
const elCronica = document.getElementById("listaCronica");

const ficha = {
  raiz: document.getElementById("ficha"),
  marca: document.getElementById("fichaMarca"),
  nome: document.getElementById("fichaNome"),
  epiteto: document.getElementById("fichaEpiteto"),
  era: document.getElementById("fichaEra"),
  escola: document.getElementById("fichaEscola"),
  pecado: document.getElementById("fichaPecado"),
  fome: document.getElementById("barraFome"),
  humor: document.getElementById("barraHumor"),
  conversa: document.getElementById("conversa"),
  form: document.getElementById("formFala"),
  campo: document.getElementById("campoFala"),
  botao: document.getElementById("botaoFala"),
  fechar: document.getElementById("fecharFicha"),
};

const peixes = new Map();
let fichas = new Map(); // dados de /api/personas (inclui o pecado)
let migalhas = [];
let bolhas = [];
let selecionado = null;
let ws = null;
let tentativas = 0;
let largura = 0;
let altura = 0;

const aleatorio = (a, b) => a + Math.random() * (b - a);

// ─── Canvas ────────────────────────────────────────────────────────────────

function redimensionar() {
  const r = elTanque.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  largura = r.width;
  altura = r.height;
  cv.width = Math.round(largura * dpr);
  cv.height = Math.round(altura * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (!medido()) return;

  for (const p of peixes.values()) {
    // Peixes criados antes do tanque ter medidas nascem todos no mesmo canto;
    // no primeiro layout válido eles recebem o lugar de verdade.
    if (!p.posicionado) {
      posicionar(p);
      continue;
    }
    p.x = Math.min(Math.max(p.x, 40), largura - 40);
    p.y = Math.min(Math.max(p.y, 30), altura - 30);
  }
}

const observador = new ResizeObserver(redimensionar);
observador.observe(elTanque);

// ─── Modelo local dos peixes ───────────────────────────────────────────────

/** O tanque já tem medidas reais? Antes disso não dá para posicionar nada. */
const medido = () => largura > 0 && altura > 0;

/** Espalha o peixe pela largura, na faixa de profundidade da persona. */
function posicionar(p) {
  p.x = aleatorio(60, Math.max(120, largura - 60));
  p.y = Math.min(Math.max(p.profundidade * altura + aleatorio(-30, 30), 40), altura - 40);
  p.posicionado = true;
}

function criarPeixe(d) {
  const p = {
    ...d,
    x: 0,
    y: 0,
    vx: aleatorio(-0.4, 0.4) || 0.3,
    vy: 0,
    fase: Math.random() * Math.PI * 2,
    alvo: null, // migalha que este peixe vai comer
    balao: null,
    pensando: false,
    posicionado: false,
  };
  if (medido()) posicionar(p);
  return p;
}

function sincronizarTanque(lista) {
  for (const d of lista) {
    const existente = peixes.get(d.id);
    if (existente) {
      Object.assign(existente, {
        fome: d.fome,
        humor: d.humor,
        nome: d.nome,
        cor: d.cor,
      });
    } else {
      peixes.set(d.id, criarPeixe(d));
    }
  }
  if (selecionado) atualizarVitaisFicha(selecionado);
}

// ─── Desenho ───────────────────────────────────────────────────────────────

function desenharPeixe(p, t) {
  const escala = 22 * p.tamanho;
  const direcao = p.vx >= 0 ? 1 : -1;
  const velocidade = Math.hypot(p.vx, p.vy);
  const freqNado = 0.005 * (0.6 + p.velocidade * 0.5) + velocidade * 0.003;
  const balanco = Math.sin(t * freqNado + p.fase);
  const amplitudeCauda = 0.35 + Math.min(velocidade * 0.15, 0.45);
  const abanoCauda = balanco * amplitudeCauda;

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.scale(direcao, 1);

  const inclinacao = balanco * 0.04 + p.vy * 0.04;
  ctx.rotate(inclinacao);

  // Faminto perde o brilho; saciado reluz um pouco.
  const vigor = 1 - Math.min(p.fome, 100) / 180;
  ctx.globalAlpha = 0.6 + vigor * 0.4;

  // ── Cauda bifurcada ─────────────────────────────────────────────────
  const caudaX = -escala * 0.85;
  const forcada = abanoCauda * escala * 0.5;

  ctx.beginPath();
  ctx.moveTo(caudaX, 0);
  // Lobo superior
  ctx.quadraticCurveTo(
    caudaX - escala * 0.45, forcada - escala * 0.15,
    caudaX - escala * 0.95, forcada - escala * 0.65,
  );
  ctx.quadraticCurveTo(
    caudaX - escala * 0.55, forcada - escala * 0.05,
    caudaX - escala * 0.35, forcada * 0.3,
  );
  // Lobo inferior
  ctx.quadraticCurveTo(
    caudaX - escala * 0.55, forcada + escala * 0.05,
    caudaX - escala * 0.95, forcada + escala * 0.65,
  );
  ctx.quadraticCurveTo(
    caudaX - escala * 0.45, forcada + escala * 0.15,
    caudaX, 0,
  );
  ctx.closePath();

  ctx.globalAlpha = 0.5 * (0.6 + vigor * 0.4);
  ctx.fillStyle = p.cor;
  ctx.fill();
  ctx.globalAlpha = 0.6 + vigor * 0.4;

  // ── Corpo ───────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(escala * 0.95, 0);
  ctx.bezierCurveTo(
    escala * 0.75, -escala * 0.48,
    escala * 0.05, -escala * 0.56,
    -escala * 0.65, -escala * 0.18,
  );
  ctx.lineTo(-escala * 0.85, 0);
  ctx.lineTo(-escala * 0.65, escala * 0.18);
  ctx.bezierCurveTo(
    escala * 0.05, escala * 0.52,
    escala * 0.75, escala * 0.44,
    escala * 0.95, 0,
  );
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, -escala * 0.55, 0, escala * 0.55);
  grad.addColorStop(0, clarear(p.cor, 30));
  grad.addColorStop(0.35, p.cor);
  grad.addColorStop(0.7, escurecer(p.cor, 25));
  grad.addColorStop(1, escurecer(p.cor, 50));
  ctx.fillStyle = grad;
  ctx.fill();

  // Linha lateral sutil
  ctx.beginPath();
  ctx.moveTo(escala * 0.65, 0);
  ctx.quadraticCurveTo(0, -escala * 0.03, -escala * 0.55, escala * 0.02);
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 0.7;
  ctx.stroke();

  // ── Nadadeira dorsal ────────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(escala * 0.15, -escala * 0.48);
  ctx.quadraticCurveTo(
    -escala * 0.05, -escala * 0.95 - abanoCauda * escala * 0.15,
    -escala * 0.4, -escala * 0.38,
  );
  ctx.lineTo(escala * 0.15, -escala * 0.48);
  ctx.closePath();
  ctx.fillStyle = p.cor;
  ctx.globalAlpha = 0.4 * (0.6 + vigor * 0.4);
  ctx.fill();
  ctx.globalAlpha = 0.6 + vigor * 0.4;

  // ── Nadadeira peitoral ──────────────────────────────────────────────
  const abanoPeitoral = Math.sin(t * 0.004 + p.fase + 1.5) * 0.2;
  ctx.save();
  ctx.translate(escala * 0.15, escala * 0.18);
  ctx.rotate(0.35 + abanoPeitoral);
  ctx.beginPath();
  ctx.ellipse(0, escala * 0.12, escala * 0.09, escala * 0.22, 0, 0, Math.PI * 2);
  ctx.fillStyle = p.cor;
  ctx.globalAlpha = 0.3 * (0.6 + vigor * 0.4);
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 0.6 + vigor * 0.4;

  // ── Nadadeira anal (ventral traseira) ───────────────────────────────
  ctx.beginPath();
  ctx.moveTo(-escala * 0.25, escala * 0.32);
  ctx.quadraticCurveTo(-escala * 0.35, escala * 0.55, -escala * 0.55, escala * 0.35);
  ctx.lineTo(-escala * 0.25, escala * 0.32);
  ctx.closePath();
  ctx.fillStyle = p.cor;
  ctx.globalAlpha = 0.35 * (0.6 + vigor * 0.4);
  ctx.fill();
  ctx.globalAlpha = 0.6 + vigor * 0.4;

  // ── Olho ────────────────────────────────────────────────────────────
  const olhoX = escala * 0.55;
  const olhoY = -escala * 0.1;
  const olhoR = escala * 0.12;

  // Branco do olho
  ctx.beginPath();
  ctx.arc(olhoX, olhoY, olhoR, 0, Math.PI * 2);
  ctx.fillStyle = "#e8eef6";
  ctx.fill();

  // Íris (cor do peixe, mais escura)
  ctx.beginPath();
  ctx.arc(olhoX + olhoR * 0.15, olhoY, olhoR * 0.72, 0, Math.PI * 2);
  ctx.fillStyle = escurecer(p.cor, 40);
  ctx.fill();

  // Pupila
  ctx.beginPath();
  ctx.arc(olhoX + olhoR * 0.2, olhoY, olhoR * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = "#080b10";
  ctx.fill();

  // Brilho
  ctx.beginPath();
  ctx.arc(olhoX + olhoR * 0.35, olhoY - olhoR * 0.25, olhoR * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fill();

  // ── Boca ────────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.arc(escala * 0.88, escala * 0.04, escala * 0.06, 0.2, Math.PI - 0.2);
  ctx.strokeStyle = escurecer(p.cor, 35);
  ctx.lineWidth = 0.6;
  ctx.stroke();

  ctx.restore();

  // ── Halo de seleção ────────────────────────────────────────────────
  if (selecionado === p.id) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, escala * 1.8, 0, Math.PI * 2);
    ctx.strokeStyle = p.cor;
    ctx.globalAlpha = 0.3 + Math.sin(t * 0.004) * 0.15;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
}

/** Clareia um hex em `delta` pontos (0-255). */
function clarear(hex, delta) {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + delta);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + delta);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + delta);
  return `rgb(${r},${g},${b})`;
}

/** Escurece um hex em `delta` pontos (0-255). */
function escurecer(hex, delta) {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - delta);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - delta);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - delta);
  return `rgb(${r},${g},${b})`;
}

function desenharMigalha(m) {
  const alpha = Math.min(1, m.vida / 40);
  // Rastro sutil
  ctx.save();
  ctx.beginPath();
  ctx.arc(m.x, m.y - 4, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(230,211,163,${alpha * 0.25})`;
  ctx.fill();
  ctx.restore();
  // Migalha
  ctx.save();
  ctx.beginPath();
  ctx.arc(m.x, m.y, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = "#e6d3a3";
  ctx.globalAlpha = alpha;
  ctx.shadowColor = "#e6d3a3";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.restore();
}

function desenharBolha(b) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(180, 220, 245, 0.04)";
  ctx.fill();
  ctx.strokeStyle = "rgba(180, 220, 245, 0.28)";
  ctx.lineWidth = 0.7;
  ctx.stroke();
  // Brilho
  if (b.r > 1.5) {
    ctx.beginPath();
    ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(220, 240, 255, 0.35)";
    ctx.fill();
  }
  ctx.restore();
}

function desenharFeixes(t) {
  // Feixes de luz vindos de cima: é a única coisa que entra no tanque.
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 4; i++) {
    const baseX = largura * (0.12 + i * 0.24) + Math.sin(t * 0.00018 + i * 1.3) * 50;
    const larguraFeixe = 35 + Math.sin(t * 0.0003 + i * 2) * 10;
    const g = ctx.createLinearGradient(baseX, 0, baseX + 80, altura);
    g.addColorStop(0, "rgba(140, 200, 235, 0.06)");
    g.addColorStop(0.5, "rgba(140, 200, 235, 0.025)");
    g.addColorStop(1, "rgba(140, 200, 235, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(baseX - larguraFeixe, 0);
    ctx.lineTo(baseX + larguraFeixe, 0);
    ctx.lineTo(baseX + larguraFeixe * 2.5, altura);
    ctx.lineTo(baseX + larguraFeixe * 0.5, altura);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function desenharPlantas(t) {
  // Algas discretas no fundo do tanque — oscilam devagar com a "corrente".
  ctx.save();
  const baseY = altura - 8;
  const plantas = [
    { x: largura * 0.08, h: 55, cor: "rgba(20,60,40,0.5)" },
    { x: largura * 0.14, h: 40, cor: "rgba(25,55,35,0.4)" },
    { x: largura * 0.22, h: 65, cor: "rgba(18,50,38,0.45)" },
    { x: largura * 0.78, h: 50, cor: "rgba(22,58,42,0.5)" },
    { x: largura * 0.88, h: 70, cor: "rgba(20,52,36,0.4)" },
    { x: largura * 0.94, h: 35, cor: "rgba(25,60,40,0.45)" },
  ];

  for (const pl of plantas) {
    const oscilar = Math.sin(t * 0.0008 + pl.x * 0.01) * 12;
    ctx.beginPath();
    ctx.moveTo(pl.x - 2, baseY);
    ctx.quadraticCurveTo(
      pl.x + oscilar, baseY - pl.h * 0.6,
      pl.x + oscilar * 1.4, baseY - pl.h,
    );
    ctx.quadraticCurveTo(
      pl.x + oscilar * 0.8 + 3, baseY - pl.h * 0.5,
      pl.x + 2, baseY,
    );
    ctx.fillStyle = pl.cor;
    ctx.fill();
  }

  // Algumas pedrinhas no fundo
  ctx.fillStyle = "rgba(40,50,55,0.3)";
  for (let i = 0; i < 8; i++) {
    const px = largura * (0.05 + i * 0.12) + Math.sin(i * 3.7) * 15;
    const pr = 3 + Math.sin(i * 2.1) * 2;
    ctx.beginPath();
    ctx.ellipse(px, baseY + 2, pr * 1.5, pr * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ─── Física ────────────────────────────────────────────────────────────────

function passo(dt, t) {
  if (!medido()) return;

  for (const p of peixes.values()) {
    // Rede de segurança: se um peixe chegou antes do layout, coloca-o agora.
    if (!p.posicionado) posicionar(p);

    const rapidez = 0.45 * p.velocidade;

    if (p.alvo && p.alvo.vida > 0) {
      // Bote na migalha.
      const dx = p.alvo.x - p.x;
      const dy = p.alvo.y - p.y;
      const dist = Math.hypot(dx, dy) || 1;
      p.vx += (dx / dist) * 0.14 * p.velocidade;
      p.vy += (dy / dist) * 0.14 * p.velocidade;
      if (dist < 14) {
        p.alvo.vida = 0;
        p.alvo = null;
      }
    } else {
      // Deriva: puxa para a própria faixa de profundidade e vagueia.
      const faixa = p.profundidade * altura;
      p.vy += (faixa - p.y) * 0.0009;
      if (Math.random() < 0.014) p.vx += aleatorio(-0.35, 0.35);
      if (Math.random() < 0.014) p.vy += aleatorio(-0.22, 0.22);
      // Com fome, fica inquieto.
      if (p.fome > 70 && Math.random() < 0.03) p.vx += aleatorio(-0.5, 0.5);
    }

    p.vx = Math.max(-rapidez * 3, Math.min(rapidez * 3, p.vx * 0.985));
    p.vy = Math.max(-rapidez * 2, Math.min(rapidez * 2, p.vy * 0.975));

    p.x += p.vx * dt * 0.06;
    p.y += p.vy * dt * 0.06;

    // Paredes: o vidro nunca cede.
    const margem = 40 * p.tamanho;
    if (p.x < margem) {
      p.x = margem;
      p.vx = Math.abs(p.vx) * 0.7;
    }
    if (p.x > largura - margem) {
      p.x = largura - margem;
      p.vx = -Math.abs(p.vx) * 0.7;
    }
    if (p.y < margem * 0.7) {
      p.y = margem * 0.7;
      p.vy = Math.abs(p.vy) * 0.5;
    }
    if (p.y > altura - margem * 0.7) {
      p.y = altura - margem * 0.7;
      p.vy = -Math.abs(p.vy) * 0.5;
    }
  }

  for (const m of migalhas) {
    m.y += 0.35;
    m.vida -= dt * 0.02;
    if (m.y > altura - 12) m.vida -= dt * 0.12;
  }
  migalhas = migalhas.filter((m) => m.vida > 0);

  if (Math.random() < 0.07 && bolhas.length < 50) {
    bolhas.push({
      x: aleatorio(0, largura),
      y: altura + 5,
      r: aleatorio(0.8, Math.random() < 0.15 ? 5 : 3),
      v: aleatorio(0.25, 0.85),
    });
  }
  for (const b of bolhas) {
    b.y -= b.v;
    b.x += Math.sin(b.y * 0.03) * 0.3;
  }
  bolhas = bolhas.filter((b) => b.y > -10);
}

let ultimo = performance.now();
function quadro(agora) {
  const dt = Math.min(agora - ultimo, 48);
  ultimo = agora;

  ctx.clearRect(0, 0, largura, altura);
  desenharFeixes(agora);
  desenharPlantas(agora);
  for (const b of bolhas) desenharBolha(b);
  for (const m of migalhas) desenharMigalha(m);

  // Desenha do fundo para a superfície — quem está mais perto do vidro vem por cima.
  const ordenados = [...peixes.values()].sort((a, b) => b.profundidade - a.profundidade);
  for (const p of ordenados) desenharPeixe(p, agora);

  passo(dt, agora);
  posicionarBaloes();
  requestAnimationFrame(quadro);
}

// ─── Balões ────────────────────────────────────────────────────────────────

function posicionarBaloes() {
  for (const p of peixes.values()) {
    if (!p.balao) continue;

    // O balão é centrado no peixe (translate -50%), então perto das bordas ele
    // sairia do tanque. Prende-se a meia largura de cada lado.
    const meia = p.balao.offsetWidth / 2 + 8;
    const x = Math.min(Math.max(p.x, meia), Math.max(meia, largura - meia));
    // Perto do topo, o balão desce para baixo do peixe em vez de vazar por cima.
    const acima = p.y - 30 * p.tamanho;
    const y = acima - p.balao.offsetHeight < 4 ? p.y + 42 * p.tamanho + p.balao.offsetHeight : acima;

    p.balao.style.left = `${x}px`;
    p.balao.style.top = `${y}px`;
  }
}

function mostrarBalao(id, texto, opcoes = {}) {
  const p = peixes.get(id);
  if (!p) return;
  if (p.balao) p.balao.remove();

  const el = document.createElement("div");
  el.className = "balao" + (opcoes.pensando ? " pensando" : "");
  el.style.setProperty("--cor", p.cor);
  el.innerHTML = `<span class="quem"></span>${
    opcoes.pensando ? '<span class="reticencias">· · ·</span>' : "<span class='fala'></span>"
  }`;
  el.querySelector(".quem").textContent = p.nome;
  if (!opcoes.pensando) el.querySelector(".fala").textContent = texto;

  elBaloes.appendChild(el);
  p.balao = el;
  p.pensando = Boolean(opcoes.pensando);

  clearTimeout(p.timer);
  if (!opcoes.pensando) {
    const ms = 3800 + Math.min(texto.length, 220) * 26;
    p.timer = setTimeout(() => {
      el.classList.add("saindo");
      setTimeout(() => {
        if (p.balao === el) {
          el.remove();
          p.balao = null;
        }
      }, 480);
    }, ms);
  }
}

// ─── Crônica ───────────────────────────────────────────────────────────────

function registrarCronica(fala) {
  const p = peixes.get(fala.peixe);
  const vazio = elCronica.querySelector(".vazio");
  if (vazio) vazio.remove();

  const li = document.createElement("li");
  if (p) li.style.setProperty("--cor", p.cor);
  const quem = document.createElement("span");
  quem.className = "quem";
  quem.textContent = p ? p.nome : fala.peixe;
  li.appendChild(quem);
  li.appendChild(document.createTextNode(fala.texto));

  elCronica.appendChild(li);
  while (elCronica.children.length > 40) elCronica.removeChild(elCronica.firstChild);
  elCronica.parentElement.scrollTop = elCronica.parentElement.scrollHeight;
}

// ─── Ficha e conversa ──────────────────────────────────────────────────────

function abrirFicha(id) {
  const p = peixes.get(id);
  if (!p) return;
  const meta = fichas.get(id) ?? {};

  selecionado = id;
  ficha.raiz.classList.remove("oculta");
  ficha.raiz.style.setProperty("--cor", p.cor);
  ficha.marca.style.setProperty("--cor", p.cor);
  ficha.nome.textContent = p.nome;
  ficha.epiteto.textContent = p.epiteto ?? meta.epiteto ?? "";
  ficha.era.textContent = p.era ?? meta.era ?? "—";
  ficha.escola.textContent = p.escola ?? meta.escola ?? "—";
  ficha.pecado.textContent = meta.pecado ?? "—";
  ficha.conversa.innerHTML = "";
  atualizarVitaisFicha(id);
  ficha.campo.focus();
}

function atualizarVitaisFicha(id) {
  if (selecionado !== id) return;
  const p = peixes.get(id);
  if (!p) return;
  ficha.fome.style.width = `${Math.max(0, Math.min(100, p.fome))}%`;
  ficha.humor.style.width = `${Math.max(0, Math.min(100, (p.humor + 100) / 2))}%`;
}

function linhaConversa(classe, texto) {
  const div = document.createElement("div");
  div.className = `linha ${classe}`;
  div.textContent = texto;
  ficha.conversa.appendChild(div);
  ficha.conversa.scrollTop = ficha.conversa.scrollHeight;
}

ficha.fechar.addEventListener("click", () => {
  ficha.raiz.classList.add("oculta");
  selecionado = null;
});

ficha.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = ficha.campo.value.trim();
  if (!texto || !selecionado) return;
  enviar({ t: "falar", peixe: selecionado, texto });
  linhaConversa("visitante", texto);
  ficha.campo.value = "";
  ficha.botao.disabled = true;
  setTimeout(() => (ficha.botao.disabled = false), 1200);
});

// ─── Interação com o tanque ────────────────────────────────────────────────

elTanque.addEventListener("click", (e) => {
  const r = elTanque.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;

  // Clicou num peixe? Abre a ficha. Senão, joga comida.
  let alvo = null;
  let melhor = Infinity;
  for (const p of peixes.values()) {
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < 40 * p.tamanho && d < melhor) {
      melhor = d;
      alvo = p;
    }
  }

  if (alvo) {
    abrirFicha(alvo.id);
    return;
  }

  // A migalha não é criada aqui: quem a cria é o eco do servidor, que já vem
  // com o comedor decidido. Criar uma local também deixaria uma migalha órfã,
  // que ninguém come, afundando sozinha.
  enviar({ t: "alimentar", x: x / largura, y: y / altura });
});

// ─── Ligação ───────────────────────────────────────────────────────────────

function conexao(estado, rotulo) {
  elConexao.dataset.estado = estado;
  elConexao.querySelector(".rotulo").textContent = rotulo;
}

function enviar(msg) {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
}

function ligar() {
  const wsBase = BACKEND ? BACKEND.replace(/^http/, "ws") : `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}`;
  ws = new WebSocket(`${wsBase}/ws`);

  ws.addEventListener("open", () => {
    tentativas = 0;
    conexao("ligado", "o tanque está vivo");
  });

  ws.addEventListener("message", (ev) => {
    let msg;
    try {
      msg = JSON.parse(ev.data);
    } catch {
      return;
    }
    receber(msg);
  });

  ws.addEventListener("close", () => {
    conexao("caido", "o tanque escureceu");
    const espera = Math.min(1000 * 2 ** tentativas++, 15000);
    setTimeout(ligar, espera);
  });

  ws.addEventListener("error", () => ws.close());
}

function receber(msg) {
  switch (msg.t) {
    case "tanque":
      sincronizarTanque(msg.peixes);
      break;

    case "vitais": {
      const p = peixes.get(msg.id);
      if (p) {
        p.fome = msg.fome;
        p.humor = msg.humor;
        atualizarVitaisFicha(msg.id);
      }
      break;
    }

    case "migalha": {
      const m = { x: msg.x * largura, y: msg.y * altura, vida: 100 };
      migalhas.push(m);
      const comedor = peixes.get(msg.comedor);
      if (comedor) comedor.alvo = m;
      break;
    }

    case "pensando":
      mostrarBalao(msg.id, "", { pensando: true });
      break;

    case "fala":
      mostrarBalao(msg.fala.peixe, msg.fala.texto);
      registrarCronica(msg.fala);
      if (selecionado === msg.fala.peixe) linhaConversa("peixe", msg.fala.texto);
      break;

    case "erro":
      if (selecionado) linhaConversa("visitante", `[${msg.mensagem}]`);
      break;
  }
}

// ─── Partida ───────────────────────────────────────────────────────────────

async function iniciar() {
  redimensionar();
  requestAnimationFrame(quadro);

  try {
    const [tanque, personas, cronica] = await Promise.all([
      fetch(`${BACKEND}/api/tanque`).then((r) => r.json()),
      fetch(`${BACKEND}/api/personas`).then((r) => r.json()),
      fetch(`${BACKEND}/api/cronica?limite=20`).then((r) => r.json()),
    ]);
    fichas = new Map(personas.personas.map((p) => [p.id, p]));
    sincronizarTanque(tanque.peixes);
    for (const f of cronica.falas) registrarCronica(f);
  } catch (erro) {
    console.error("não consegui ler o tanque", erro);
  }

  ligar();
  setInterval(() => enviar({ t: "ping" }), 45000);
}

iniciar();
