# Sistema de Controle de Atendimento por Senhas 🎟️

### Alunos:
- `Alexandre Paschoal Teles de Andrade - 01780463`
- `Beatriz Kathleen Marques Silva - 01861292`
- `Geovanny Marcelino da Silva - 01731076`
- `Lucas Vinícius Moura Correia e Silva - 01780372`
- `Thiago Henrique de Andrade Silva - 01764230`


## 📌 Descrição do Projeto

Este projeto é um Sistema de Atendimento por Senhas, pensado para funcionar como um painel de chamada em clínicas, laboratórios, repartições públicas, recepções e ambientes de triagem.

O sistema foi desenvolvido em **HTML, CSS e JavaScript**, com foco em
simular um painel real de atendimento com regras avançadas de fila e
prioridade.

------------------------------------------------------------------------

## 🎯 Funcionalidades Principais

### ✔ Emissão de 3 tipos de senhas

-   **SP -- Senha Prioritária**
-   **SG -- Senha Geral**
-   **SE -- Senha de Exames**

Cada senha segue o padrão:

    YYMMDD-PPSQ
    Exemplo: 250307-SP03

------------------------------------------------------------------------

## ✔ Regras de Prioridade Implementadas

A fila segue a ordem:

    [SP] → [SE | SG] → [SP] → [SE | SG] → ...

### 📌 PRIORIDADES:

-   **SP** sempre tem prioridade máxima;
-   **SE** não é prioritária, mas é muito rápida --- entra como
    intermediária;
-   **SG** possui a menor prioridade;

O sistema sempre **alterna o tipo da próxima senha**, garantindo ciclo
justo entre categorias.

------------------------------------------------------------------------

## 🖥️ Painel Principal

-   Exibe apenas a senha chamada no momento;
-   A senha chamada **pisca** e **emite um som**;
-   Não aparece "emitido", apenas a chamada final;
-   Atualiza automaticamente após cada atendimento;

------------------------------------------------------------------------

## 📜 Histórico de Chamadas

-   Exibe as **5 últimas senhas chamadas**;
-   Nunca prevê a próxima senha;
-   Lista com rolagem para evitar sobrepor o header;

------------------------------------------------------------------------

## 🎟️ Como emitir as senhas?
Basta acessar esses atalhos abaixo, no teclado:

  - `P` - Emitir Senha Prioritária (SP)
  - `G` - Emitir Senha Geral (SG)
  - `E` - Emitir Senha de Exames (SE)
  - `C` - Chamar próxima senha
  - `R` - Resetar filas

Ou se preferir, clicar nos botões da página.

------------------------------------------------------------------------

## 🧩 Estrutura do Projeto

    /projeto
      ├── index.html
      ├── style.css
      ├── script.js
      ├── assets/
      │     ├── beep.mp3
      └── README.md

------------------------------------------------------------------------

## ⚙️ Funcionamento da Lógica

### ✔ Ao emitir senha

-   Gera no padrão YYMMDD-PPSQ
-   Armazena na fila correspondente
-   Atualiza interface

### ✔ Ao chamar

<p>1.  Chama "SP", se houver</p>
<p>2.  Se não houver "SP":</p>

-   Chama "SE", se existir; 
-   Senão chama "SG";

<p>3.  Atualiza painel principal</p>
<p>4.  Registra no histórico</p>

------------------------------------------------------------------------

## ▶️ Como Executar

Basta abrir o arquivo `index.html` no navegador.

------------------------------------------------------------------------

<h3 align="center">Tecnologias Utilizadas:</h3>

###

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="40" alt="html5 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="40" alt="css logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo"  />
</div>

###