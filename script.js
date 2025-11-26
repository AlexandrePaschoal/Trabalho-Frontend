const vSenha = document.querySelector(".senha1")
let senhaNormal = localStorage.getItem("senhaNormal")
const pSenha = document.querySelector(".senha2")
let senhaPreferencial = localStorage.getItem("senhaPreferencial")
const eSenha = document.querySelector(".senha3")
let senhaExame = localStorage.getItem("senhaExame")
let ultSenha = localStorage.getItem("ultSenha")

// ALTERAR AUDIO AQUI!!//
let audio1 = new Audio("normal.mp3")
let audio2 = new Audio("prioridade.mp3")
let audio3 = new Audio("exame.mp3")

function mostrarSenha() {
  if (ultSenha == "N") {
    vSenha.innerHTML =
      "N" +
      parseInt(senhaNormal).toLocaleString("pt-br", { minimumIntegerDigits: 3 })
  } else {
    pSenha.innerHTML =
      "P" +
      parseInt(senhaPreferencial).toLocaleString("pt-br", {
        minimumIntegerDigits: 3,
      })
    eSenha.innerHTML =
      "E" +
      parseInt(senhaExame).toLocaleString("pt-br", { minimumIntegerDigits: 3 })
  }
}

if (!senhaNormal) senhaNormal = 0

if (!senhaPreferencial) senhaPreferencial = 0

if (!senhaExame) senhaExame = 0

if (!ultSenha) ultSenha = 0

mostrarSenha()

window.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "r":
      ultSenha = "N"
      senhaNormal = 0
      senhaPreferencial = 0
      senhaExame = 0
      this.window.location.reload(true)
      break
    case "n":
      senhaNormal++
      ultSenha = "N"
      audio1.play()
      break
    case "p":
      senhaPreferencial++
      ultSenha = "P"
      audio2.play()
      break
    case "e":
      senhaExame++
      ultSenha = "E"
      audio3.play()
      break
    default:
      break
  }

  localStorage.setItem("senhaNormal", senhaNormal)
  localStorage.setItem("senhaPreferencial", senhaPreferencial)
  localStorage.setItem("senhaExame", senhaExame)
  localStorage.setItem("ultSenha", ultSenha)
  mostrarSenha()
})
