const vSenha = document.querySelector(".senha1")
let senhaNormal = Number(localStorage.getItem("senhaNormal")) || 0

const pSenha = document.querySelector(".senha2")
let senhaPreferencial = Number(localStorage.getItem("senhaPreferencial")) || 0

const eSenha = document.querySelector(".senha3")
let senhaExame = Number(localStorage.getItem("senhaExame")) || 0

let ultSenha = localStorage.getItem("ultSenha") || ""

const audioN = document.getElementById("audioNormal")
const audioP = document.getElementById("audioPreferencial")
const audioE = document.getElementById("audioExame")

const listaHistorico = document.getElementById("listaHistorico")
let historico = JSON.parse(localStorage.getItem("historico")) || []

function atualizarTela() {
  vSenha.innerHTML =
    "N" + senhaNormal.toLocaleString("pt-br", { minimumIntegerDigits: 3 })

  pSenha.innerHTML =
    "P" + senhaPreferencial.toLocaleString("pt-br", { minimumIntegerDigits: 3 })

  eSenha.innerHTML =
    "E" + senhaExame.toLocaleString("pt-br", { minimumIntegerDigits: 3 })
}

function piscarElemento(elemento) {
  elemento.classList.add("piscar")
  setTimeout(() => {
    elemento.classList.remove("piscar")
  }, 3000) // pisca por 3 segundos
}

function adicionarHistorico(tipo, numero) {
  const texto = `${tipo}${numero.toLocaleString("pt-br", {
    minimumIntegerDigits: 3,
  })}`
  historico.unshift(texto)
  if (historico.length > 15) historico.pop()

  localStorage.setItem("historico", JSON.stringify(historico))
  renderHistorico()
}

function renderHistorico() {
  listaHistorico.innerHTML = ""
  historico.forEach((item) => {
    const li = document.createElement("li")
    li.textContent = item
    listaHistorico.appendChild(li)
  })
}

function chamarSenha(tipo) {
  let elemento

  if (tipo === "N") {
    senhaNormal++
    ultSenha = "N"
    audioN.play()
    elemento = vSenha
    adicionarHistorico("N", senhaNormal)
  }

  if (tipo === "P") {
    senhaPreferencial++
    ultSenha = "P"
    audioP.play()
    elemento = pSenha
    adicionarHistorico("P", senhaPreferencial)
  }

  if (tipo === "E") {
    senhaExame++
    ultSenha = "E"
    audioE.play()
    elemento = eSenha
    adicionarHistorico("E", senhaExame)
  }

  piscarElemento(elemento)

  localStorage.setItem("senhaNormal", senhaNormal)
  localStorage.setItem("senhaPreferencial", senhaPreferencial)
  localStorage.setItem("senhaExame", senhaExame)
  localStorage.setItem("ultSenha", ultSenha)

  atualizarTela()
}

atualizarTela()
renderHistorico()

document
  .getElementById("btnNormal")
  .addEventListener("click", () => chamarSenha("N"))
document
  .getElementById("btnPreferencial")
  .addEventListener("click", () => chamarSenha("P"))
document
  .getElementById("btnExame")
  .addEventListener("click", () => chamarSenha("E"))

window.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "r":
      localStorage.clear()
      location.reload()
      break

    case "n":
      chamarSenha("N")
      break

    case "p":
      chamarSenha("P")
      break

    case "e":
      chamarSenha("E")
      break
  }
})
