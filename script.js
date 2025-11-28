/* =======================
   Sistema de Senhas - JS
   ======================= */

/*
Atalhos:
P = emitir SP (Prioritária)
E = emitir SE (Exame)
G = emitir SG (Geral)
C = chamar próximo (Atendente) -> aplica lógica de alternância
R = reset total
*/

// --- DOM ---
const painelSenhaEl = document.getElementById("painelSenha")
const audioChamada = document.getElementById("audioChamada")

const mostraSP = document.getElementById("mostraSP")
const mostraSE = document.getElementById("mostraSE")
const mostraSG = document.getElementById("mostraSG")

const btnSP = document.getElementById("btnSP")
const btnSE = document.getElementById("btnSE")
const btnSG = document.getElementById("btnSG")

const btnChamar = document.getElementById("btnChamar")
const btnLimpar = document.getElementById("btnLimpar")

const listaHistoricoEl = document.getElementById("listaHistorico")

// --- Persistência: chaves no localStorage ---
const LS = {
  filaSP: "filaSP_v1",
  filaSE: "filaSE_v1",
  filaSG: "filaSG_v1",
  seqs: "seqs_v1", // objeto de contadores por tipo e data
  historico: "historico_v1",
  ultimaChamada: "ultimaChamada_v1",
}

// --- Estado em memória (carregado do localStorage) ---
let filaSP = JSON.parse(localStorage.getItem(LS.filaSP)) || []
let filaSE = JSON.parse(localStorage.getItem(LS.filaSE)) || []
let filaSG = JSON.parse(localStorage.getItem(LS.filaSG)) || []

let seqs = JSON.parse(localStorage.getItem(LS.seqs)) || {} // { "YYMMDD": { SP: 3, SE: 8, SG: 12 } }

let historico = JSON.parse(localStorage.getItem(LS.historico)) || [] // últimas 5 chamadas
let ultimaChamada = localStorage.getItem(LS.ultimaChamada) || null // tipo da última chamada: "SP"/"SE"/"SG"

// --- helpers para data e formatação ---
function hojeYYMMDD() {
  const d = new Date()
  const yy = String(d.getFullYear()).slice(-2)
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return yy + mm + dd
}

function nextSequenceFor(type) {
  const data = hojeYYMMDD()
  if (!seqs[data]) seqs[data] = { SP: 0, SE: 0, SG: 0 }
  seqs[data][type] = (seqs[data][type] || 0) + 1
  // persistir contadores
  localStorage.setItem(LS.seqs, JSON.stringify(seqs))
  return seqs[data][type]
}

function formatarSenha(type, seq) {
  // type: "SP" | "SE" | "SG"
  const yy = hojeYYMMDD() // YYMMDD
  const sq = String(seq).padStart(3, "0")
  return `${yy}-${type}${sq}`
}

function salvarFilas() {
  localStorage.setItem(LS.filaSP, JSON.stringify(filaSP))
  localStorage.setItem(LS.filaSE, JSON.stringify(filaSE))
  localStorage.setItem(LS.filaSG, JSON.stringify(filaSG))
}

function salvarHistorico() {
  localStorage.setItem(LS.historico, JSON.stringify(historico))
  localStorage.setItem(LS.ultimaChamada, ultimaChamada || "")
}

// atualizar mostradores pequenos (mostra última senha emitida por tipo)
function atualizarMostradores() {
  mostraSP.textContent = filaSP.length ? filaSP[filaSP.length - 1] : "-- --"
  mostraSE.textContent = filaSE.length ? filaSE[filaSE.length - 1] : "-- --"
  mostraSG.textContent = filaSG.length ? filaSG[filaSG.length - 1] : "-- --"
}

// render histórico (últimas 5)
function renderHistorico() {
  listaHistoricoEl.innerHTML = ""
  historico.slice(0, 5).forEach((item) => {
    const li = document.createElement("li")
    li.textContent = item
    listaHistoricoEl.appendChild(li)
  })
}

// adiciona no histórico (topo) e limita a 5
function adicionarHistorico(senha) {
  historico.unshift(senha)
  if (historico.length > 5) historico = historico.slice(0, 5)
  salvarHistorico()
  renderHistorico()
}

/* =========================
   Emissão de senha (AC)
   ========================= */
function emitirSenha(tipo) {
  // tipo: "SP" | "SE" | "SG"
  const seq = nextSequenceFor(tipo)
  const codigo = formatarSenha(tipo, seq)

  if (tipo === "SP") filaSP.push(codigo)
  if (tipo === "SE") filaSE.push(codigo)
  if (tipo === "SG") filaSG.push(codigo)

  salvarFilas()
  atualizarMostradores()
}

/* =========================
   Lógica chamar próximo (AA)
   Regras:
   - Alternância: SP -> (SE|SG) -> SP -> ...
   - Sempre priorizar SP se for o passo para SP (e existir)
   - Após SP, chamar SE se existir, senão SG
   - Se SP não existir quando for hora de chamar SP, chamar SE ou SG conforme disponibilidade
   ========================= */

function chamarProximo() {
  // se filas vazias -> nada a fazer
  if (filaSP.length === 0 && filaSE.length === 0 && filaSG.length === 0) {
    // limpa painel temporariamente
    painelSenhaEl.textContent = "-- --"
    return null
  }

  let chamada = null

  // Se última chamada foi SP -> agora devemos chamar SE (se existir) ou SG
  if (ultimaChamada === "SP") {
    if (filaSE.length > 0) {
      chamada = filaSE.shift()
      ultimaChamada = "SE"
    } else if (filaSG.length > 0) {
      chamada = filaSG.shift()
      ultimaChamada = "SG"
    } else if (filaSP.length > 0) {
      // fallback: só tem SP
      chamada = filaSP.shift()
      ultimaChamada = "SP"
    }
  } else {
    // última não foi SP (pode ser SE, SG ou nula) -> tentar chamar SP
    if (filaSP.length > 0) {
      chamada = filaSP.shift()
      ultimaChamada = "SP"
    } else {
      // se não existir SP -> tentar SE, depois SG
      if (filaSE.length > 0) {
        chamada = filaSE.shift()
        ultimaChamada = "SE"
      } else if (filaSG.length > 0) {
        chamada = filaSG.shift()
        ultimaChamada = "SG"
      }
    }
  }

  // se ainda não escolheu, tente qualquer fila (só por segurança)
  if (!chamada) {
    if (filaSE.length > 0) {
      chamada = filaSE.shift()
      ultimaChamada = "SE"
    } else if (filaSG.length > 0) {
      chamada = filaSG.shift()
      ultimaChamada = "SG"
    } else if (filaSP.length > 0) {
      chamada = filaSP.shift()
      ultimaChamada = "SP"
    }
  }

  // persistir filas e ultimaChamada
  salvarFilas()
  salvarHistorico()
  atualizarMostradores()

  if (chamada) {
    // aciona painel principal: mostra codigo grande, pisca e toca som
    mostrarChamadaPainel(chamada)
    adicionarHistorico(chamada)
  }

  return chamada
}

/* Mostra no painel principal, pisca e toca som (2s) */
function mostrarChamadaPainel(codigo) {
  painelSenhaEl.textContent = codigo

  // tocar som
  try {
    audioChamada.currentTime = 0
    audioChamada.play().catch(() => {})
  } catch (err) {}

  // piscar
  painelSenhaEl.classList.add("piscar")
  setTimeout(() => {
    painelSenhaEl.classList.remove("piscar")
  }, 2000)
}

/* =========================
   Reset total (apertar R ou botão Reset)
   ========================= */
function resetTotal() {
  filaSP = []
  filaSE = []
  filaSG = []
  seqs = {} // reinicia contadores do dia
  historico = []
  ultimaChamada = null

  localStorage.removeItem(LS.filaSP)
  localStorage.removeItem(LS.filaSE)
  localStorage.removeItem(LS.filaSG)
  localStorage.removeItem(LS.seqs)
  localStorage.removeItem(LS.historico)
  localStorage.removeItem(LS.ultimaChamada)

  atualizarMostradores()
  renderHistorico()
  painelSenhaEl.textContent = "-- --"
}

/* =========================
   Eventos UI
   ========================= */

// clique para emitir (AC / totem)
btnSP.addEventListener("click", () => {
  emitirSenha("SP")
})
btnSE.addEventListener("click", () => {
  emitirSenha("SE")
})
btnSG.addEventListener("click", () => {
  emitirSenha("SG")
})

// chamar próximo (AA)
btnChamar.addEventListener("click", () => {
  chamarProximo()
})

// reset (apenas por botão)
btnLimpar.addEventListener("click", () => {
  resetTotal()
})

/* Teclas de atalho:
   p = emitir SP, e = emitir SE, g = emitir SG
   c = chamar próximo, r = reset
*/
window.addEventListener("keydown", (ev) => {
  const k = ev.key.toLowerCase()
  if (k === "p") {
    emitirSenha("SP")
    return
  }
  if (k === "e") {
    emitirSenha("SE")
    return
  }
  if (k === "g") {
    emitirSenha("SG")
    return
  }
  if (k === "c") {
    chamarProximo()
    return
  }
  if (k === "r") {
    resetTotal()
    return
  }
})

/* =========
   Inicialização visual
   ========= */
atualizarMostradores()
renderHistorico()

if (ultimaChamada) painelSenhaEl.textContent = ultimaChamada
else painelSenhaEl.textContent = "-- --"
