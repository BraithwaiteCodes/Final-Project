// According to ChatGPT need to wrap the DOM in an event listener

// Selecting required elements for implementing the game functionality
const userEl = document.querySelector(".player--0");
const opponentEl = document.querySelector(".player--1");
const userBtn = document.getElementById("score--0");
const oppBtn = document.getElementById("score--1");
const undoBtn = document.getElementById("undoBtn");
const gameWonModal = document.getElementById("gameWonModal");
const matchWonModal = document.getElementById("matchWonModal");
const endMatchModal = document.getElementById("endMatchModal");
const overlay = document.querySelector(".overlay");
const backBtn = document.getElementById("goBack");
const nextGameBtn = document.getElementById("nextGame");
const endMatchBtn = document.getElementById("endMatchBtn");
const noBtn = document.getElementById("noBtn");
const userGamesWon = document.getElementById("games--0");
const oppGamesWon = document.getElementById("games--1");

const serveButtons = document.querySelectorAll(".btn-serve");

///////////////////////////////////////////////////////////////////////////////////////

// Modal functionality
const openGameModal = function () {
  gameWonModal.classList.remove("hidden-modal");
  overlay.classList.remove("hidden-modal");
};

const closeGameModal = function () {
  gameWonModal.classList.add("hidden-modal");
  overlay.classList.add("hidden-modal");
};

const openWonMatchModal = function () {
  closeGameModal();
  matchWonModal.classList.remove("hidden-modal");
  overlay.classList.remove("hidden-modal");
};

const openEndMatchModal = function () {
  endMatchModal.classList.remove("hidden-modal");
  overlay.classList.remove("hidden-modal");
};

const closeEndMatchModal = () => {
  endMatchModal.classList.add("hidden-modal");
  overlay.classList.add("hidden-modal");
};

// Listeners for closing the modal window
backBtn.addEventListener("click", function () {
  removeLastScore();
  closeGameModal();
});

overlay.addEventListener("click", function () {
  removeLastScore();
  closeGameModal();
  closeEndMatchModal();
});

endMatchBtn.addEventListener("click", function () {
  openEndMatchModal();
});

noBtn.addEventListener("click", function () {
  closeEndMatchModal();
});

/////////////////////////////////////////////////////

// Gameplay Variables from form that was submitted
const games = document.getElementById("gamesToPlay").textContent.split(": ");
const points = document.getElementById("points").textContent.split(": ");
const winBy = document.getElementById("win_by").textContent.split(": ");
const gamesPlayed = document
  .getElementById("gamesPlayed")
  .textContent.split(": ");

// Storing variables into a dictionary for logic later
const gameInfo = {};
gameInfo[`${games[0]}`] = parseInt(games[1]);
gameInfo[`${points[0]}`] = parseInt(points[1]);
gameInfo[`${winBy[0]}`] = parseInt(winBy[1]);
gameInfo[`${gamesPlayed[0]}`] = parseInt(gamesPlayed[1]);

// Defining Variables for event listeners
let curPlayerScore, curPlayerScoreUsable;
let lastPlayerToScore = 0;

// Player 0 is the first nested array and player-1 is the second
let gameScores = [[], []];
const allGames = {};

const incrementScoreForPlayer = function (player) {
  curPlayerScore = document.getElementById(`score--${player}`);
  curPlayerScoreUsable = parseInt(curPlayerScore.textContent);
  curPlayerScoreUsable += 1;
  // Update the contents of the button
  curPlayerScore.textContent = curPlayerScoreUsable;

  // Store the score in the players Scores array
  gameScores[player].push(curPlayerScoreUsable);
  lastPlayerToScore = player;
};

const resetScores = function () {
  const resetUserScoreLocation = document.getElementById("score--0");
  const resetOpponentScoreLocation = document.getElementById("score--1");

  resetUserScoreLocation.textContent = 0;
  resetOpponentScoreLocation.textContent = 0;
};

// Removes the last score from the scores array when complete.
const removeLastScore = function () {
  if (
    lastPlayerToScore !== undefined &&
    gameScores[lastPlayerToScore].length > 0
  ) {
    // Remove the last entry for that player
    gameScores[lastPlayerToScore].pop();

    // Update the score for the player
    const decrementedScore = document.getElementById(
      `score--${lastPlayerToScore}`
    );
    decrementedScore.textContent =
      gameScores[lastPlayerToScore][gameScores[lastPlayerToScore].length - 1] ||
      0;
  }
};

// Checks the scores array to see if meets the criteria for one game
const checkIfGameWon = function (player) {
  const pointsToWin = gameInfo["Points per Game"];
  const winBy = gameInfo["Win By"];
  const playerScore = parseInt(
    document.getElementById(`score--${player}`).textContent
  );
  const opponent = player ? 0 : 1;
  const opponentScore = parseInt(
    document.getElementById(`score--${opponent}`).textContent
  );
  // Getting current user
  const usersName = document.getElementById("user").textContent;
  const oppName = document.getElementById("opponent").textContent;
  let winner;

  if (player === 0) {
    winner = usersName;
  } else {
    winner = oppName;
  }
  // Logic for opening modal window for new game.
  if (playerScore === pointsToWin && playerScore - opponentScore >= winBy) {
    openGameModal();
    const gameModalTitle = document.getElementById("gameWonModalTitle");
    gameModalTitle.textContent = `${winner} won that game`;
  } else if (
    playerScore >= pointsToWin &&
    playerScore - opponentScore >= winBy
  ) {
    openGameModal();
    const gameModalTitle = document.getElementById("gameWonModalTitle");
    gameModalTitle.textContent = `${winner} won that game`;
  }
};

// Updates UI to show how many games user has won
const updateGamesWon = function (player, total_games) {
  // Get container that holds/ displays the score
  const scoreContainer = document.getElementById(`games--${player}`);
  // Manipulate content and extract just the score
  let scoreToUpdate = parseInt(scoreContainer.textContent.split(" / ")[0]);
  scoreToUpdate += 1;

  // Update UI with new score
  scoreContainer.textContent = `${scoreToUpdate} / ${total_games}`;
};

// Check match won
const checkMatchWon = function (player, best_of) {
  let gamesWon = document
    .getElementById(`games--${player}`)
    .textContent.split(" / ")[0];
  const gamesWonTotal = parseInt(gamesWon);
  // Getting current user
  const usersName = document.getElementById("user").textContent;
  const oppName = document.getElementById("opponent").textContent;
  let winner;

  if (player === 0) {
    winner = usersName;
  } else {
    winner = oppName;
  }

  if (gamesWonTotal === best_of) {
    openWonMatchModal();
    const matchWonModalTitle = document.getElementById("matchWonModalTitle");
    matchWonModalTitle.textContent = `${winner} won the Match. Return Home`;
    return true;
  } else {
    return false;
  }
};

/////////////////////////////////////////////////////
// LISTENERS
// UNDO button functionality
undoBtn.addEventListener("click", function () {
  removeLastScore();
});

// Scoreboard event listener for defined user
userBtn.addEventListener("click", function () {
  incrementScoreForPlayer(0);
  clearButtons(1);
  checkIfGameWon(0);
  toggleServeSide();
});

// Scoreboard event listener for defined user
oppBtn.addEventListener("click", function () {
  incrementScoreForPlayer(1);
  clearButtons(0);
  checkIfGameWon(1);
  toggleServeSide();
});

// Next Game event listener
nextGameBtn.addEventListener("click", function () {
  const totalGames = gameInfo["Total Games"];
  // if 3 total games, this will be 2. If 5 total games, this will be 3.
  const best_of = Math.ceil(totalGames / 2);

  // Get current played games
  curGamesPlayed = gameInfo["Games Played"];
  allGames[curGamesPlayed] = gameScores;
  // Reset game scores
  gameScores = [[], []];

  // Get current games played and increment.
  curGamesPlayed += 1;
  gameInfo["Games Played"] = curGamesPlayed;

  // Get locations for where we need to update the value
  gamesHTMLLocation = document.getElementById("gamesPlayed");
  gamesHTMLLocation.textContent = `Games Played: ${curGamesPlayed}`;

  // Update the user who won the games score
  updateGamesWon(lastPlayerToScore, totalGames);
  // Reset the buttons and close the modal window
  resetScores();
  closeGameModal();

  // Check if match won
  const matchWon = checkMatchWon(lastPlayerToScore, best_of);
  if (matchWon) {
    sendData();
  } else {
    return;
  }
});

// Final function that sends scores array to python/flask route
const sendData = function () {
  const player0Name = document.getElementById("user").textContent;
  const player1Name = document.getElementById("opponent").textContent;
  const userGamesWon = document
    .getElementById("games--0")
    .textContent.split(" / ")[0];
  const oppGamesWon = document
    .getElementById("games--1")
    .textContent.split(" / ")[0];
  const totalGamesPlayed = document
    .getElementById("gamesPlayed")
    .textContent.split(": ")[1];

  // Creating and modifying data to be sent
  const matchData = allGames;
  matchData["user"] = player0Name;
  matchData["opponent"] = player1Name;
  matchData["userGamesWon"] = userGamesWon;
  matchData["oppGamesWon"] = oppGamesWon;

  dataToSend = JSON.stringify(matchData);

  const request = new XMLHttpRequest();
  request.open("POST", `/matchFinished/${dataToSend}`);
  request.send();
};

/////////////////////////////////////////////////////////////
// Implement serve side functionality
const toggleServeSide = function () {
  // Get nodelist of both buttons for user
  const servingBtns = document.querySelectorAll(
    `.btn-player--${lastPlayerToScore}`
  );
  // 0 is left button, 1 is right btn in nodelist
  const leftServe = servingBtns[0];
  const rightServe = servingBtns[1];
  const serveFromLeft = leftServe.classList.contains("btn-active");
  const serveFromRight = rightServe.classList.contains("btn-active");

  // check if the buttons contain btn-active
  // If none have it, add it to the right button.
  // If one has it, toggle it off and then on for the opposite button
  if (serveFromLeft) {
    rightServe.classList.toggle("btn-active");
    leftServe.classList.toggle("btn-active");
    rightServe.classList.toggle("btn-disabled");
    leftServe.classList.toggle("btn-disabled");
  } else if (serveFromRight) {
    rightServe.classList.toggle("btn-active");
    leftServe.classList.toggle("btn-active");
    rightServe.classList.toggle("btn-disabled");
    leftServe.classList.toggle("btn-disabled");
  } else if (!serveFromLeft && !serveFromRight) {
    rightServe.classList.toggle("btn-active");
    rightServe.classList.toggle("btn-disabled");
  }
};

const clearButtons = function (player) {
  // Get nodelist of all serve buttons
  const oppBtnsToClear = document.querySelectorAll(`.btn-player--${player}`);
  oppBtnsToClear.forEach((btn) => {
    btn.classList.add("btn-disabled");
    btn.classList.remove("btn-active");
  });
};

// Event listeners for each serve button
const p0LeftServeBtn = document.getElementById("left--0");
const p0RightServeBtn = document.getElementById("right--0");
const p1LeftServeBtn = document.getElementById("left--1");
const p1RightServeBtn = document.getElementById("right--1");

p0LeftServeBtn.addEventListener("click", function () {
  if (p0LeftServeBtn.classList.contains("btn-active")) {
    return;
  }
  p0LeftServeBtn.classList.add("btn-active");
  p0LeftServeBtn.classList.remove("btn-disabled");

  // make all other buttons disabled
  p0RightServeBtn.classList.remove("btn-active");
  p0RightServeBtn.classList.add("btn-disabled");
  p1RightServeBtn.classList.remove("btn-active");
  p1RightServeBtn.classList.add("btn-disabled");
  p1LeftServeBtn.classList.remove("btn-active");
  p1LeftServeBtn.classList.add("btn-disabled");
});

p0RightServeBtn.addEventListener("click", function () {
  if (p0RightServeBtn.classList.contains("btn-active")) {
    return;
  }
  p0RightServeBtn.classList.add("btn-active");
  p0RightServeBtn.classList.remove("btn-disabled");

  // make all other buttons disabled
  p0LeftServeBtn.classList.remove("btn-active");
  p0LeftServeBtn.classList.add("btn-disabled");
  p1RightServeBtn.classList.remove("btn-active");
  p1RightServeBtn.classList.add("btn-disabled");
  p1LeftServeBtn.classList.remove("btn-active");
  p1LeftServeBtn.classList.add("btn-disabled");
});

p1LeftServeBtn.addEventListener("click", function () {
  if (p1LeftServeBtn.classList.contains("btn-active")) {
    return;
  }
  p1LeftServeBtn.classList.add("btn-active");
  p1LeftServeBtn.classList.remove("btn-disabled");

  // make all other buttons disabled
  p0RightServeBtn.classList.remove("btn-active");
  p0RightServeBtn.classList.add("btn-disabled");
  p1RightServeBtn.classList.remove("btn-active");
  p1RightServeBtn.classList.add("btn-disabled");
  p0LeftServeBtn.classList.remove("btn-active");
  p0LeftServeBtn.classList.add("btn-disabled");
});

p1RightServeBtn.addEventListener("click", function () {
  if (p1RightServeBtn.classList.contains("btn-active")) {
    return;
  }
  p1RightServeBtn.classList.add("btn-active");
  p1RightServeBtn.classList.remove("btn-disabled");

  // make all other buttons disabled
  p0LeftServeBtn.classList.remove("btn-active");
  p0LeftServeBtn.classList.add("btn-disabled");
  p0RightServeBtn.classList.remove("btn-active");
  p0RightServeBtn.classList.add("btn-disabled");
  p1LeftServeBtn.classList.remove("btn-active");
  p1LeftServeBtn.classList.add("btn-disabled");
});
