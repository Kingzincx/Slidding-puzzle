/**
 * Limpa todos os dados do localStorage.
 */
function clearLocalStorage() {
  if (
    confirm(
      "Tem a certeza de que deseja apagar todos os dados? Esta ação não pode ser desfeita."
    )
  ) {
    localStorage.clear();
    alert("Todos os dados foram apagados.");
    currentUser = "Convidado";
  }
}

/**
 * Registra um novo utilizador salvando seus dados no localStorage.
 */
function register() {
  let username = document.getElementById("register-username").value.trim();
  let password = document.getElementById("register-password").value;

  if (!username || !password) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (localStorage.getItem(username)) {
    alert("Nome de usuário já existe. Por favor, escolha outro.");
  } else {
    localStorage.setItem(
      username,
      JSON.stringify({ password: password, highScore: 0, time: 0 })
    );
    alert("Registro bem-sucedido! Você já pode fazer login.");
    showSection("login");
  }
}

/**
 * Realiza o login de um utilizador existente.
 */
function login() {
  let username = document.getElementById("login-username").value.trim();
  let password = document.getElementById("login-password").value;

  let userData = localStorage.getItem(username);
  if (userData) {
    let userObj = JSON.parse(userData);
    if (userObj.password === password) {
      currentUser = username;
      localStorage.setItem("currentUser", currentUser);
      alert(`Bem-vindo, ${currentUser}!`);
      showSection("modeSelect");
    } else {
      alert("Senha incorreta. Tente novamente.");
    }
  } else {
    alert("Utilizador não encontrado. Por favor, registre-se.");
  }
}

/**
 * Atualiza o ranking do jogador no localStorage.
 * @param {number} score - A pontuação atual do jogador.
 * @param {number} time - O tempo gasto pelo jogador.
 */
function updateRanking(score, time) {
  if (currentUser === "Convidado") return;
  if (currentMode === "timed") return;

  let userData = JSON.parse(localStorage.getItem(currentUser));
  if (!userData) return;

  if (
    score > userData.highScore ||
    (score === userData.highScore && time < userData.time)
  ) {
    userData.highScore = score;
    userData.time = time;
    localStorage.setItem(currentUser, JSON.stringify(userData));
  }
}

/**
 * Carrega e exibe o ranking dos jogadores.
 */
function loadRanking() {
  let rankingTable = document.getElementById("rankingTable");
  rankingTable.innerHTML = "";
  let table = document.createElement("table");
  let headerRow = document.createElement("tr");
  headerRow.innerHTML =
    "<th>Posição</th><th>Jogador</th><th>Pontuação</th><th>Tempo</th>";
  table.appendChild(headerRow);

  let users = [];

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key !== "currentUser" && key !== "theme") {
      let userData = JSON.parse(localStorage.getItem(key));
      users.push({
        username: key,
        highScore: userData.highScore || 0,
        time: userData.time || 0,
      });
    }
  }

  users.sort((a, b) => {
    if (b.highScore !== a.highScore) {
      return b.highScore - a.highScore; // Pontuação decrescente
    } else {
      return a.time - b.time; // Tempo crescente
    }
  });

  users.forEach((user, index) => {
    let row = document.createElement("tr");
    let positionCell = document.createElement("td");
    positionCell.innerText = index + 1;
    let usernameCell = document.createElement("td");
    usernameCell.innerText = user.username;
    let scoreCell = document.createElement("td");
    scoreCell.innerText = user.highScore;
    let timeCell = document.createElement("td");
    timeCell.innerText = formatTime(user.time);
    row.appendChild(positionCell);
    row.appendChild(usernameCell);
    row.appendChild(scoreCell);
    row.appendChild(timeCell);
    table.appendChild(row);
  });

  rankingTable.appendChild(table);
}