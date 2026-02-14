/**
 * Clears all localStorage data.
 */
function clearLocalStorage() {
  if (
    confirm(
      "Are you sure you want to delete all data? This action cannot be undone.",
    )
  ) {
    localStorage.clear();
    alert("All data has been deleted.");
    currentUser = "Guest";
    updateUserCircle();
  }
}

/**
 * Registers a new user by saving their data in localStorage.
 */
function register() {
  let username = document.getElementById("register-username").value.trim();
  let password = document.getElementById("register-password").value;

  if (!username || !password) {
    alert("Please fill in all fields.");
    return;
  }

  if (localStorage.getItem(username)) {
    alert("Username already exists. Please choose another.");
  } else {
    localStorage.setItem(
      username,
      JSON.stringify({ password: password, highScore: 0, time: 0 }),
    );
    alert("Registration successful! You can now log in.");
    updateUserCircle();
    showSection("login");
  }
}

/**
 * Logs in an existing user.
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
      alert(`Welcome, ${currentUser}!`);
      updateUserCircle();
      showSection("main-menu");
    } else {
      alert("Incorrect password. Please try again.");
    }
  } else {
    alert("User not found. Please register.");
  }
}

/**
 * Updates the player's leaderboard data in localStorage.
 * @param {number} score - The player's current score.
 * @param {number} time - Time spent by the player.
 */
function updateRanking(score, time) {
  if (currentUser === "Guest") return;
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
 * Loads and displays the players leaderboard.
 */
function loadRanking() {
  let rankingTable = document.getElementById("rankingTable");
  rankingTable.innerHTML = "";
  let table = document.createElement("table");
  let headerRow = document.createElement("tr");
  headerRow.innerHTML =
    "<th>Rank</th><th>Player</th><th>Score</th><th>Time</th>";
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
      return b.highScore - a.highScore; // Score descending
    } else {
      return a.time - b.time; // Time ascending
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

/**
 * Updates the user circle and dropdown content.
 */
function updateUserCircle() {
  let circleText = document.getElementById("user-circle-text");
  let dropdown = document.getElementById("user-dropdown");
  if (!circleText || !dropdown) return;

  if (currentUser === "Guest") {
    circleText.innerText = "?";
    dropdown.innerHTML =
      "<button onclick=\"showSection('login'); toggleUserMenu()\">Login</button>" +
      "<button onclick=\"showSection('register'); toggleUserMenu()\">Register</button>" +
      "<button onclick=\"showSection('ranking'); toggleUserMenu()\">Leaderboard</button>";
  } else {
    circleText.innerText = currentUser.charAt(0).toUpperCase();

    let highScore = 0;
    let userData = localStorage.getItem(currentUser);
    if (userData) {
      let userObj = JSON.parse(userData);
      highScore = userObj.highScore || 0;
    }

    dropdown.innerHTML =
      '<div class="dropdown-username">' +
      currentUser +
      "</div>" +
      '<div class="dropdown-score">High Score: ' +
      highScore +
      "</div>" +
      "<button onclick=\"showSection('ranking'); toggleUserMenu()\">Leaderboard</button>" +
      '<button onclick="logoutUser()">Log Out</button>';
  }
}

/**
 * Toggles the user dropdown visibility.
 */
function toggleUserMenu() {
  let dropdown = document.getElementById("user-dropdown");
  if (!dropdown) return;

  if (dropdown.style.display === "none" || dropdown.style.display === "") {
    updateUserCircle();
    dropdown.style.display = "block";
  } else {
    dropdown.style.display = "none";
  }
}

/**
 * Logs out the user.
 */
function logoutUser() {
  currentUser = "Guest";
  localStorage.removeItem("currentUser");
  updateUserCircle();
  let dropdown = document.getElementById("user-dropdown");
  if (dropdown) dropdown.style.display = "none";
  showSection("main-menu");
}
